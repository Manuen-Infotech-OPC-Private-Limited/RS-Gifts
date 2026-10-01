import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { 
  Heart, 
  Trash2, 
  ShoppingBag, 
  Star, 
  Sparkles, 
  Share2, 
  Check, 
  Copy,
  ArrowRight
} from 'lucide-react';

export const WishlistPage = () => {
  const { wishlistItems, wishlistCount, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);
  const [addedItemMap, setAddedItemMap] = useState({});

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedItemMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const handleMoveAllToCart = () => {
    wishlistItems.forEach((item) => {
      addToCart(item, 1);
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Check out my curated gifting wishlist on RS Gifts: ${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="w-full bg-[#FFF9F5] py-16 px-4 font-sans select-none min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#ECE7EC] shadow-sm text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-[#FDF2F4] text-[#821D38] flex items-center justify-center mx-auto">
            <Heart size={34} strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-bold text-[#1E1217]">
            Your Wishlist is Empty
          </h2>
          <p className="text-xs text-[#6F6870] leading-relaxed">
            Save your favorite personalized items, flowers, and luxury hampers here so you can easily gift them later!
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 rounded-xl bg-[#821D38] hover:bg-[#6E162E] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles size={14} className="text-[#C9A45C]" />
            <span>Discover Thoughtful Gifts</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FFF9F5] py-6 sm:py-9 font-sans select-none min-h-[80vh]">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header with Title and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ECE7EC]">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-[#1E1217]">
                My Wishlist
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FDF2F4] text-[#821D38] border border-[#DFC8D0]">
                {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <p className="text-xs text-[#6F6870] mt-1">
              Your saved favorite gifts for upcoming birthdays, celebrations, and anniversaries
            </p>
          </div>

          {/* Top Actions: Move All & Share */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-white border border-[#ECE7EC] hover:border-[#821D38] text-xs font-semibold text-neutral-700 hover:text-[#821D38] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="px-3.5 py-2 rounded-xl bg-white border border-[#ECE7EC] hover:border-[#25D366] text-xs font-semibold text-neutral-700 hover:text-[#25D366] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 size={14} />
              <span>Share via WhatsApp</span>
            </button>

            <button
              onClick={handleMoveAllToCart}
              className="px-4 py-2 rounded-xl bg-[#821D38] hover:bg-[#6E162E] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag size={14} />
              <span>Move All to Cart</span>
            </button>
          </div>
        </div>

        {/* Product Cards Grid (Border-flush card style) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4 md:gap-5">
          {wishlistItems.map((product) => {
            const isAdded = !!addedItemMap[product.id];

            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-[#EFEBEF] hover:border-[#DFC8D0] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5 select-none"
              >
                {/* Image Box (Flush to top/sides) */}
                <div className="relative w-full aspect-[314/276] overflow-hidden bg-[#FAF6F4]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Remove Heart Button */}
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    aria-label="Remove from Wishlist"
                    className="absolute top-2.5 right-2.5 w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-white/95 hover:bg-white shadow-sm flex items-center justify-center transition-transform active:scale-90 cursor-pointer text-[#E11D48]"
                    title="Remove from wishlist"
                  >
                    <Heart size={15} className="fill-[#E11D48] text-[#E11D48]" />
                  </button>
                </div>

                {/* Details Section */}
                <div className="p-2.5 sm:p-3 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-xs sm:text-[13px] font-semibold text-[#271B21] line-clamp-1 mb-1.5 group-hover:text-[#821D38] transition-colors">
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-1.5">
                      <span className="text-sm sm:text-[15px] font-bold text-[#1E1217]">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-[11px] sm:text-xs text-gray-400 line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                      {product.discount && (
                        <span className="text-[10px] sm:text-[11px] font-semibold text-[#18794E] bg-[#E8F5E9] px-1.5 py-0.5 rounded">
                          {product.discount}
                        </span>
                      )}
                    </div>

                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-1 mb-2.5">
                      <div className="flex items-center text-[#F59E0B]">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 fill-[#F59E0B] stroke-[#F59E0B]"
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-[#7A6E75] font-medium">
                        ({product.reviews || 84})
                      </span>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`w-full py-2 rounded-xl text-xs sm:text-[13px] font-medium transition-all duration-200 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                      isAdded
                        ? 'bg-[#15803D] text-white'
                        : 'bg-[#821D38] hover:bg-[#6E162E] text-white active:scale-98'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={14} />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
