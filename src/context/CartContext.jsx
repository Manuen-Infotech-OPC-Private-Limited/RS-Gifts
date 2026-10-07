import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('rs_gifts_cart');
      return saved ? JSON.parse(saved) : [
        // Seed with 1 initial demo item so the user immediately sees a realistic cart
        {
          id: 'prod-1',
          name: 'Teddy Bear (Premium)',
          price: 699,
          originalPrice: 999,
          discount: '30% OFF',
          image: '/images/products/teddy-bear.png',
          quantity: 1,
        }
      ];
    } catch {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  
  // Gifting Add-ons
  const [giftWrap, setGiftWrap] = useState(false); // ₹99
  const [giftMessage, setGiftMessage] = useState(''); // ₹49 if filled or chosen
  const [includeGiftNote, setIncludeGiftNote] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code: 'WELCOME10', discountPercent: 10 }

  useEffect(() => {
    try {
      localStorage.setItem('rs_gifts_cart', JSON.stringify(cartItems));
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
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const applyCoupon = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'WELCOME10' || clean === 'RSGIFTS10') {
      setAppliedCoupon({ code: clean, discountPercent: 10 });
      return { success: true, message: '10% discount applied successfully!' };
    }
    if (clean === 'FESTIVE20') {
      setAppliedCoupon({ code: clean, discountPercent: 20 });
      return { success: true, message: '20% Festive discount applied!' };
    }
    return { success: false, message: 'Invalid promo code. Try WELCOME10' };
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

  const giftWrapCost = giftWrap ? 99 : 0;
  const giftNoteCost = includeGiftNote && giftMessage.trim().length > 0 ? 49 : 0;
  const addonsTotal = giftWrapCost + giftNoteCost;

  const discountAmount = appliedCoupon
    ? Math.round((itemsSubtotal * appliedCoupon.discountPercent) / 100)
    : 0;

  // Free delivery threshold: ₹999
  const freeShippingThreshold = 999;
  const isFreeDelivery = itemsSubtotal >= freeShippingThreshold || itemsSubtotal === 0;
  const deliveryFee = isFreeDelivery ? 0 : 99;

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
