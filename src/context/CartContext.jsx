import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      // Clear legacy storage that held the seeded demo item
      localStorage.removeItem('rs_gifts_cart');
      const saved = localStorage.getItem('rs_gifts_cart_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (item) => item && !String(item.id).startsWith('prod-') && !item.name?.toLowerCase().includes('teddy bear')
          );
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    // Purge any phantom demo items from in-memory state on mount
    setCartItems((prev) =>
      prev.filter(
        (item) => item && !String(item.id).startsWith('prod-') && !item.name?.toLowerCase().includes('teddy bear')
      )
    );
  }, []);

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  
  // Gifting Add-ons (Complimentary / Inclusive)
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [includeGiftNote, setIncludeGiftNote] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Dynamic Shipping Settings loaded from Backend
  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: 999,
    standardShippingFee: 50,
  });

  useEffect(() => {
    let isMounted = true;
    api.get('/customer/content/settings')
      .then((res) => {
        const s = res?.settings || res?.data?.settings;
        if (s && isMounted) {
          setShippingSettings({
            freeShippingThreshold: Number(s.freeShippingThreshold) || 999,
            standardShippingFee: Number(s.standardShippingFee ?? 50),
          });
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    try {
      localStorage.removeItem('rs_gifts_cart');
      localStorage.setItem('rs_gifts_cart_v2', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice || product.price,
          discount: product.discount || '',
          image: product.image,
          quantity: quantity,
        },
      ];
    });
    // Open drawer automatically on add
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const applyCoupon = async (code) => {
    const clean = (code || '').trim().toUpperCase();
    if (!clean) {
      return { success: false, message: 'Please enter a coupon code.' };
    }

    try {
      const res = await api.post('/customer/coupons/validate', {
        code: clean,
        orderTotal: itemsSubtotal,
      });

      const c = res.coupon;
      if (c) {
        const isFlat = c.discountType === 'flat' || c.discountType === 'fixed';
        setAppliedCoupon({
          code: c.code,
          discountType: isFlat ? 'flat' : 'percentage',
          discountValue: Number(c.discountValue || 0),
          discountPercent: isFlat ? 0 : Number(c.discountValue || 0),
          flatDiscount: isFlat ? Number(c.discountValue || 0) : 0,
        });
        return { success: true, message: res.message || `Coupon ${c.code} applied!` };
      }
      return { success: false, message: res.message || 'Invalid coupon code.' };
    } catch (err) {
      // Check active coupon endpoint
      try {
        const activeRes = await api.get('/customer/coupons/active');
        const activeCpn = activeRes.activeCoupon || (Array.isArray(activeRes.coupons) ? activeRes.coupons[0] : null);
        if (activeCpn && activeCpn.code && activeCpn.code.toUpperCase() === clean) {
          const isFlat = activeCpn.discountType === 'flat' || activeCpn.discountType === 'fixed';
          setAppliedCoupon({
            code: activeCpn.code,
            discountType: isFlat ? 'flat' : 'percentage',
            discountValue: Number(activeCpn.discountValue || 0),
            discountPercent: isFlat ? 0 : Number(activeCpn.discountValue || 0),
            flatDiscount: isFlat ? Number(activeCpn.discountValue || 0) : 0,
          });
          return { success: true, message: `Coupon ${activeCpn.code} applied!` };
        }
      } catch {}

      const errMsg = err?.response?.data?.message || err.message || 'Invalid promo code.';
      return { success: false, message: errMsg };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  // Calculations
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const itemsSubtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const addonsTotal = 0;

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'flat') {
      discountAmount = Math.min(itemsSubtotal, appliedCoupon.discountValue || appliedCoupon.flatDiscount || 0);
    } else {
      discountAmount = Math.round(
        (itemsSubtotal * (appliedCoupon.discountPercent || appliedCoupon.discountValue || 0)) / 100
      );
    }
  }

  const freeShippingThreshold = shippingSettings.freeShippingThreshold;
  const isFreeDelivery = itemsSubtotal >= freeShippingThreshold || itemsSubtotal === 0;
  const deliveryFee = isFreeDelivery ? 0 : shippingSettings.standardShippingFee;

  const grandTotal = Math.max(
    0,
    itemsSubtotal + addonsTotal - discountAmount + deliveryFee
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        itemsSubtotal,
        giftWrap,
        setGiftWrap,
        giftMessage,
        setGiftMessage,
        includeGiftNote,
        setIncludeGiftNote,
        deliveryDate,
        setDeliveryDate,
        couponCode,
        setCouponCode,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        addonsTotal,
        discountAmount,
        deliveryFee,
        isFreeDelivery,
        freeShippingThreshold,
        grandTotal,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        openCartDrawer: () => setIsCartDrawerOpen(true),
        closeCartDrawer: () => setIsCartDrawerOpen(false),
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
