import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  ShoppingBag,
  Trash2,
  Heart,
  Plus,
  Minus,
  Gift,
  Calendar,
  Tag,
  Check,
  ArrowRight,
  ChevronRight,
  Info,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  Truck,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';

export const CartPage = () => {
  const { user, addresses, addCustomerOrder, openAuthModal } = useAuth();
  const {
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
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Checkout modal state
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  // Default address if available
  const defaultAddress = addresses?.find((a) => a.isDefault) || addresses?.[0] || null;

  const [checkoutForm, setCheckoutForm] = useState({
    recipientName: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    paymentMethod: 'COD', // COD | UPI
    orderNotes: '',
  });

  // Pre-fill form when user logs in or addresses change
  useEffect(() => {
    if (user) {
      setCheckoutForm((prev) => ({
        ...prev,
        recipientName: prev.recipientName || user.name || '',
        phone: prev.phone || user.phone || '',
        email: prev.email || user.email || '',
        addressLine1: prev.addressLine1 || defaultAddress?.street || defaultAddress?.addressLine1 || '',
        city: prev.city || defaultAddress?.city || '',
        state: prev.state || defaultAddress?.state || '',
        postalCode: prev.postalCode || defaultAddress?.postalCode || defaultAddress?.pincode || '',
      }));
    }
  }, [user, defaultAddress]);

  // Reset order placed screen when user logs out or cart gets emptied
  useEffect(() => {
    if (!placedOrder) {
      setCheckoutSuccess(false);
    }
  }, [user]);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const result = await applyCoupon(couponInput);
    setCouponMessage(result);
    if (result.success) {
      setCouponInput('');
    }
  };

  const handleMoveToWishlist = (item) => {
    if (!isInWishlist(item.id)) {
      toggleWishlist(item);
    }
    removeFromCart(item.id);
  };

  const handleOpenCheckout = () => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    setCheckoutError('');
    setIsCheckoutModalOpen(true);
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    if (
      !checkoutForm.recipientName.trim() ||
      !checkoutForm.phone.trim() ||
      !checkoutForm.addressLine1.trim() ||
      !checkoutForm.city.trim() ||
      !checkoutForm.state.trim() ||
      !checkoutForm.postalCode.trim()
    ) {
      setCheckoutError('Please fill in all required delivery fields (Name, Phone, Address, City, State, PIN).');
      return;
    }

    setSubmittingOrder(true);
    setCheckoutError('');

    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          product: item.id || item._id,
          title: item.name || item.title || 'Gift Item',
          quantity: item.quantity,
          price: item.price,
          image: item.image || '',
          personalizationData: {
            giftWrap: !!giftWrap,
            giftMessage: includeGiftNote ? giftMessage : '',
          },
        })),
        customerInfo: {
          name: checkoutForm.recipientName.trim(),
          email: user?.email || checkoutForm.email.trim() || 'customer@rsgifts.com',
          phone: checkoutForm.phone.trim(),
        },
        shippingAddress: {
          recipientName: checkoutForm.recipientName.trim(),
          phone: checkoutForm.phone.trim(),
          addressLine1: checkoutForm.addressLine1.trim(),
          addressLine2: checkoutForm.addressLine2.trim(),
          city: checkoutForm.city.trim(),
          state: checkoutForm.state.trim(),
          postalCode: checkoutForm.postalCode.trim(),
          country: 'India',
        },
        paymentMethod: checkoutForm.paymentMethod || 'COD',
        couponCode: appliedCoupon?.code || '',
        notes: [
          checkoutForm.orderNotes.trim(),
          giftWrap ? 'Includes Premium Ribbon Gift Wrap' : '',
          includeGiftNote && giftMessage ? `Greeting Card: "${giftMessage}"` : '',
        ]
          .filter(Boolean)
          .join(' | '),
      };

      const response = await api.post('/customer/orders', orderPayload);
      const createdOrder = response?.order || {
        orderNumber: `RS${Math.floor(10 + Math.random() * 90)}${Math.random().toString(36).substring(2, 4).toUpperCase()}`, // Strictly 6 characters
        totalAmount: grandTotal,
        orderStatus: 'Pending',
        createdAt: new Date().toISOString(),
        items: orderPayload.items,
        shippingAddress: orderPayload.shippingAddress,
      };

      // Sync into local AuthContext orders list
      if (addCustomerOrder) {
        addCustomerOrder(createdOrder);
      }

      setPlacedOrder(createdOrder);
      setIsCheckoutModalOpen(false);
      setCheckoutSuccess(true);
      clearCart();
    } catch (err) {
      console.error('Order creation error:', err);
      const errMsg = err.response?.data?.message || err.message || 'Failed to place order. Please check connection and try again.';
      setCheckoutError(errMsg);
    } finally {
      setSubmittingOrder(false);
    }
  };

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - itemsSubtotal);

  if (checkoutSuccess && placedOrder) {
    return (
      <div className="w-full bg-[#FFF9F5] py-16 px-4 font-sans select-none min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-[#ECE7EC] shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#15803D] flex items-center justify-center mx-auto shadow-sm">
            <Check size={32} strokeWidth={2.5} />
          </div>
          <div className="inline-block px-3 py-1 rounded-full bg-[#FDF2F4] text-[#821D38] text-xs font-bold font-mono">
            Order #{placedOrder.orderNumber}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1E1217]">
            Order Placed Successfully!
          </h2>
          <p className="text-xs sm:text-sm text-[#6F6870] leading-relaxed">
            Thank you for shopping with RS Gifts. Your order has been placed in our system. Our team will prepare and dispatch your gift package promptly!
          </p>

          <div className="p-3.5 rounded-2xl bg-[#FCFAFB] border border-[#ECE7EC] text-left text-xs space-y-1.5">
            <div className="flex justify-between text-neutral-600">
              <span>Recipient:</span>
              <span className="font-semibold text-neutral-900">{placedOrder.shippingAddress?.recipientName}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Delivery City:</span>
              <span className="font-semibold text-neutral-900">{placedOrder.shippingAddress?.city}, {placedOrder.shippingAddress?.state}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Total Amount:</span>
              <span className="font-bold text-[#821D38]">₹{(placedOrder.totalAmount || grandTotal).toLocaleString('en-IN')} ({placedOrder.paymentMethod || 'COD'})</span>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                setCheckoutSuccess(false);
                setPlacedOrder(null);
                navigate('/account?tab=orders');
              }}
              className="w-full py-3 rounded-xl bg-[#821D38] hover:bg-[#6E162E] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Track Order Status
            </button>
            <button
              onClick={() => {
                setCheckoutSuccess(false);
                setPlacedOrder(null);
                navigate('/');
              }}
              className="w-full py-2.5 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-xs font-semibold transition-colors cursor-pointer"
            >
              Back to Shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="w-full bg-[#FFF9F5] py-16 px-4 font-sans select-none min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#ECE7EC] shadow-sm text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-[#FDF2F4] text-[#821D38] flex items-center justify-center mx-auto">
            <ShoppingBag size={34} strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-bold text-[#1E1217]">
            Your Shopping Cart is Empty
          </h2>
          <p className="text-xs text-[#6F6870] leading-relaxed">
            You don't have any gifts in your cart yet. Explore our curated collections for birthdays, anniversaries, and personal occasions!
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 rounded-xl bg-[#821D38] hover:bg-[#6E162E] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center justify-center"
          >
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FFF9F5] py-6 sm:py-9 font-sans select-none min-h-[80vh]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1E1217]">
              Shopping Cart
            </h1>
            <p className="text-xs text-[#6F6870] mt-0.5">
              Review your selected items and personalize your gifting options
            </p>
          </div>
        </div>

        {/* 2-Column Cart Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* Left Column: Cart Items & Gifting Add-ons (8 cols) */}
          <div className="lg:col-span-8 space-y-5">

            {/* Items List */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#ECE7EC] shadow-xs divide-y divide-[#ECE7EC]">
              <div className="pb-3 flex items-center justify-between text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                <span>Gift Items ({cartCount})</span>
                <button
                  onClick={clearCart}
                  className="text-rose-600 hover:text-rose-700 font-medium normal-case cursor-pointer"
                >
                  Clear Cart
                </button>
              </div>

              {cartItems.map((item) => (
                <div key={item.id} className="py-4 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#FAF6F4] shrink-0 border border-neutral-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="text-sm sm:text-base font-bold text-[#1E1217] line-clamp-1">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#821D38]">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                      {item.originalPrice > item.price && (
                        <span className="text-xs text-neutral-400 line-through">
                          ₹{item.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                      {item.discount && (
                        <span className="text-[10px] font-semibold text-[#18794E] bg-[#E8F5E9] px-1.5 py-0.5 rounded">
                          {item.discount}
                        </span>
                      )}
                    </div>

                    {/* Move to Wishlist / Remove Actions */}
                    <div className="flex items-center gap-4 pt-1 text-xs">
                      <button
                        onClick={() => handleMoveToWishlist(item)}
                        className="flex items-center gap-1 text-neutral-500 hover:text-[#821D38] transition-colors cursor-pointer"
                      >
                        <Heart size={13} />
                        <span>Save to Wishlist</span>
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="flex items-center gap-1 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  {/* Quantity & Item Total */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 pt-2 sm:pt-0">
                    <div className="flex items-center border border-[#ECE7EC] rounded-xl overflow-hidden bg-[#FFF9F5]">
                      <button
                        disabled={item.quantity <= 1}
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        title={item.quantity <= 1 ? "Minimum quantity is 1" : "Decrease quantity"}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-neutral-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:bg-white transition-colors cursor-pointer"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <span className="text-sm font-bold text-neutral-900">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Luxury Gifting Enhancements Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#ECE7EC] shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#ECE7EC]">
                <Gift size={18} className="text-[#C9A45C]" />
                <h3 className="text-sm sm:text-base font-bold text-[#1E1217]">
                  Luxury Gifting Options
                </h3>
              </div>

              {/* 1. Gift Wrap Option */}
              <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-[#ECE7EC] hover:border-[#DFC8D0] bg-[#FFF9F5] transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  className="mt-0.5 rounded text-[#821D38] focus:ring-[#821D38] accent-[#821D38]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-[#1E1217]">
                      Add Luxury Velvet Gift Box & Ribbon
                    </span>
                    <span className="text-xs font-semibold text-[#15803D] bg-[#E8F5E9] px-2 py-0.5 rounded-full">
                      Included
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6F6870] mt-0.5 leading-relaxed">
                    Hand-wrapped in our signature burgundy presentation box with satin ribbon bow and gold wax seal.
                  </p>
                </div>
              </label>

              {/* 2. Personalized Greeting Card Note */}
              <div className="p-3.5 rounded-2xl border border-[#ECE7EC] bg-[#FFF9F5] space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeGiftNote}
                    onChange={(e) => setIncludeGiftNote(e.target.checked)}
                    className="mt-0.5 rounded text-[#821D38] focus:ring-[#821D38] accent-[#821D38]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-[#1E1217]">
                        Handwritten Custom Greeting Card
                      </span>
                      <span className="text-xs font-semibold text-[#15803D] bg-[#E8F5E9] px-2 py-0.5 rounded-full">
                        Included
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6F6870] mt-0.5">
                      We print or hand-inscribe your personal warm message on textured cardstock.
                    </p>
                  </div>
                </label>

                {includeGiftNote && (
                  <div className="pt-1">
                    <textarea
                      rows={3}
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      placeholder="write your message here"
                      className="w-full text-xs p-3 rounded-xl border border-[#ECE7EC] bg-white text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#821D38]"
                    />
                  </div>
                )}
              </div>

              {/* 3. Target Scheduled Delivery Date */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-[#ECE7EC] bg-[#FFF9F5]">
                <div className="flex items-center gap-2.5">
                  <Calendar size={18} className="text-[#C9A45C] shrink-0" />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-[#1E1217] block">
                      When to Deliver
                    </span>
                    <span className="text-[11px] text-[#6F6870]">
                      Ensure your gift arrives on the exact special day
                    </span>
                  </div>
                </div>

                <input
                  type="date"
                  value={deliveryDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#ECE7EC] bg-white text-xs text-neutral-800 focus:outline-none focus:border-[#821D38] cursor-pointer"
                />
              </div>

            </div>

          </div>

          {/* Right Column: Order Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">

            {/* Promo Code Input Card */}
            <div className="bg-white rounded-3xl p-5 border border-[#ECE7EC] shadow-xs space-y-3">
              <span className="text-xs font-bold text-[#1E1217] flex items-center gap-1.5">
                <Tag size={14} className="text-[#C9A45C]" />
                Have a Coupon Code?
              </span>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9] text-xs">
                  <div className="flex items-center gap-1.5 text-[#15803D] font-bold">
                    <Check size={14} />
                    <span>{appliedCoupon.code} ({appliedCoupon.discountPercent}% OFF)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter WELCOME10"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#ECE7EC] bg-[#FFF9F5] uppercase placeholder-neutral-400 focus:outline-none focus:border-[#821D38]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#821D38] hover:bg-[#6E162E] text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponMessage && !appliedCoupon && (
                <p className="text-[11px] text-rose-600">{couponMessage.message}</p>
              )}
            </div>

            {/* Summary Details Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#ECE7EC] shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#1E1217] pb-3 border-b border-[#ECE7EC]">
                Order Summary
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-neutral-900">
                    ₹{itemsSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {(giftWrap || (includeGiftNote && giftMessage.trim().length > 0)) && (
                  <div className="flex justify-between text-neutral-600">
                    <span>Gifting Add-ons</span>
                    <span className="font-semibold text-[#15803D]">
                      Included
                    </span>
                  </div>
                )}

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#15803D]">
                    <span>Coupon Discount</span>
                    <span className="font-bold">-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-600">
                  <span>Estimated Delivery</span>
                  {isFreeDelivery ? (
                    <span className="text-[#15803D] font-bold">FREE</span>
                  ) : (
                    <span className="font-semibold text-neutral-900">₹{deliveryFee}</span>
                  )}
                </div>

                <div className="border-t border-[#ECE7EC] pt-3 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-[#1E1217]">Estimated Total</span>
                  <span className="text-lg font-black text-[#821D38]">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleOpenCheckout}
                className="w-full py-3.5 rounded-xl bg-[#821D38] hover:bg-[#6E162E] text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight size={15} />
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* Checkout Delivery Details Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#ECE7EC] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-[#ECE7EC] flex items-center justify-between bg-[#FFF9F5]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FDF2F4] text-[#821D38] flex items-center justify-center">
                  <Truck size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1E1217]">Delivery & Checkout</h3>
                  <p className="text-[11px] text-[#6F6870]">Enter delivery address to confirm your gift order</p>
                </div>
              </div>
              <button
                onClick={() => setIsCheckoutModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-200/60 text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleConfirmOrder} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {checkoutError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{checkoutError}</span>
                </div>
              )}

              <div className="space-y-3">
                <span className="text-xs font-bold text-[#1E1217] uppercase tracking-wider block">
                  1. Recipient Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Recipient Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g.Rahuk"
                      value={checkoutForm.recipientName}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, recipientName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#ECE7EC] bg-[#FAF8FA] text-neutral-900 focus:bg-white focus:border-[#821D38] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={checkoutForm.phone}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#ECE7EC] bg-[#FAF8FA] text-neutral-900 focus:bg-white focus:border-[#821D38] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-[#1E1217] uppercase tracking-wider block">
                  2. Delivery Address
                </span>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Street Address / Flat / House No.
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat 402 Mg Road"
                    value={checkoutForm.addressLine1}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, addressLine1: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#ECE7EC] bg-[#FAF8FA] text-neutral-900 focus:bg-white focus:border-[#821D38] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hyderabad"
                      value={checkoutForm.city}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, city: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#ECE7EC] bg-[#FAF8FA] text-neutral-900 focus:bg-white focus:border-[#821D38] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Telangana"
                      value={checkoutForm.state}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, state: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#ECE7EC] bg-[#FAF8FA] text-neutral-900 focus:bg-white focus:border-[#821D38] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 500001"
                      value={checkoutForm.postalCode}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, postalCode: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#ECE7EC] bg-[#FAF8FA] text-neutral-900 focus:bg-white focus:border-[#821D38] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-[#1E1217] uppercase tracking-wider block">
                  3. Payment Method
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all ${checkoutForm.paymentMethod === 'COD'
                      ? 'border-[#821D38] bg-[#FDF2F4] text-[#821D38] font-bold'
                      : 'border-[#ECE7EC] bg-white text-neutral-700'
                      }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={checkoutForm.paymentMethod === 'COD'}
                      onChange={() => setCheckoutForm({ ...checkoutForm, paymentMethod: 'COD' })}
                      className="accent-[#821D38]"
                    />
                    <span>Cash on Delivery (COD)</span>
                  </label>

                  <label
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all ${checkoutForm.paymentMethod === 'UPI'
                      ? 'border-[#821D38] bg-[#FDF2F4] text-[#821D38] font-bold'
                      : 'border-[#ECE7EC] bg-white text-neutral-700'
                      }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={checkoutForm.paymentMethod === 'UPI'}
                      onChange={() => setCheckoutForm({ ...checkoutForm, paymentMethod: 'UPI' })}
                      className="accent-[#821D38]"
                    />
                    <span>UPI / Scan & Pay</span>
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                  Delivery Notes / Gifting Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ring the doorbell, leave with neighbor if unavailable"
                  value={checkoutForm.orderNotes}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, orderNotes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#ECE7EC] bg-[#FAF8FA] text-neutral-900 focus:bg-white focus:border-[#821D38] focus:outline-none"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFF9F5] border border-[#ECE7EC] flex items-center justify-between mt-2">
                <div>
                  <span className="text-xs text-neutral-500 block">Total Payable:</span>
                  <span className="text-base font-black text-[#821D38]">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#15803D] font-bold">
                  <ShieldCheck size={16} />
                  <span>100% Safe Checkout</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  disabled={submittingOrder}
                  onClick={() => setIsCheckoutModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingOrder}
                  className="px-6 py-2.5 rounded-xl bg-[#821D38] hover:bg-[#6E162E] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {submittingOrder ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Placing Order...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Place Order (₹{grandTotal})</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
