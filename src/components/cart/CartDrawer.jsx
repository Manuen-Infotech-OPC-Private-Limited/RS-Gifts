import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Gift, 
  ShieldCheck
} from 'lucide-react';

export const CartDrawer = () => {
  const {
    cartItems,
    cartCount,
    itemsSubtotal,
    freeShippingThreshold,
    isFreeDelivery,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const navigate = useNavigate();

  if (!isCartDrawerOpen) return null;

  const handleGoToCart = () => {
    closeCartDrawer();
    navigate('/cart');
  };

  return (
    <div
      style={{ zIndex: 9999 }}
      className="fixed inset-0 z-[9999] overflow-hidden font-sans select-none"
    >
      {/* Dimmed Backdrop */}
      <div
        onClick={closeCartDrawer}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full transform transition-transform duration-300 ease-in-out relative z-10">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#ECE7EC] flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-[#C9A45C]" />
              <h2 className="text-base sm:text-lg font-bold text-[#1E1217]">
                Shopping Bag
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FDF2F4] text-[#821D38] border border-[#DFC8D0]">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </span>
            </div>

            <button
              onClick={closeCartDrawer}
              aria-label="Close cart drawer"
              className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>


          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-[#FDF2F4] flex items-center justify-center text-[#821D38]">
                  <ShoppingBag size={34} strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-bold text-[#1E1217]">
                  Your cart is empty
                </h3>
                <p className="text-xs text-[#6F6870] max-w-xs leading-relaxed">
                  Looks like you haven't added any thoughtful gifts yet. Explore our curated collections to get started!
                </p>
                <button
                  onClick={() => {
                    closeCartDrawer();
                    navigate('/');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#821D38] hover:bg-[#6E162E] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Explore Trending Gifts
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3 rounded-2xl border border-[#ECE7EC] hover:border-[#DFC8D0] bg-white transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#FAF6F4] shrink-0 border border-neutral-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-semibold text-[#1E1217] line-clamp-1">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs font-bold text-[#821D38]">
                            ₹{item.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-neutral-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-50">
                      <div className="flex items-center border border-[#ECE7EC] rounded-lg overflow-hidden bg-[#FAF8FA]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:bg-white hover:text-rose-600 transition-colors cursor-pointer"
                          title={item.quantity <= 1 ? "Remove item from cart" : "Decrease quantity"}
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:bg-white transition-colors cursor-pointer"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-neutral-900">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#ECE7EC] bg-white space-y-3 shrink-0 shadow-lg">
              {/* Luxury Gifting Note Prompt */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FDF2F4] border border-[#DFC8D0] text-[11px] text-[#821D38]">
                <Gift size={14} className="shrink-0 text-[#C9A45C]" />
                <span>Add gift wrap & personal greeting note at checkout!</span>
              </div>

              {/* Subtotal */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600 font-medium">Subtotal</span>
                <span className="text-base font-bold text-[#1E1217]">
                  ₹{itemsSubtotal.toLocaleString('en-IN')}
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={handleGoToCart}
                  className="w-full py-2.5 rounded-xl border border-[#821D38] text-[#821D38] hover:bg-[#FDF2F4] text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  View Full Cart
                </button>
                <button
                  onClick={handleGoToCart}
                  className="w-full py-2.5 rounded-xl bg-[#821D38] hover:bg-[#6E162E] text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Checkout</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 text-[10px] text-neutral-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={12} className="text-[#C9A45C]" />
                  100% Safe Payments
                </span>
                <span>•</span>
                <span>Fast Express Dispatch</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
