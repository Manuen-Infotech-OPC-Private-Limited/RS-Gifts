import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { fetchLiveProducts, fetchActiveCoupon } from '../services/productService';

export const FeaturedProducts = ({ onAddToCart }) => {
  const navigate = useNavigate();
  const { addToCart, closeCartDrawer } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState('All');
  const [addedItems, setAddedItems] = useState({});
  const [liveProducts, setLiveProducts] = useState(null);
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadProducts = () => {
      setLoading(true);
      fetchLiveProducts()
        .then((items) => {
          if (isMounted) {
            setLiveProducts(Array.isArray(items) ? items : []);
            setLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) {
            setLiveProducts([]);
            setLoading(false);
          }
        });

      fetchActiveCoupon()
        .then((coupon) => {
          if (isMounted && coupon) {
            setActiveCoupon(coupon);
          }
        })
        .catch(() => {});
    };

    loadProducts();

    window.addEventListener('focus', loadProducts);
    return () => {
      isMounted = false;
      window.removeEventListener('focus', loadProducts);
    };
  }, []);

  const dynamicDiscountLabel = activeCoupon
    ? (activeCoupon.discountType === 'flat' || activeCoupon.discountType === 'fixed'
      ? `₹${activeCoupon.discountValue} OFF`
      : `${activeCoupon.discountValue}% OFF`)
    : null;

  const validProducts = (liveProducts || []).filter((p) => p && p.active !== false);

  // If items are marked featured in backend, show featured first; otherwise show all products from backend
  const featuredOnly = validProducts.filter((p) => p.featured === true);
  const productList = (featuredOnly.length > 0 ? featuredOnly : validProducts).map((p) => ({
    ...p,
    discount: dynamicDiscountLabel || p.discount || '',
  }));

  // Build dynamic filter tabs based on categories in live products
  const categorySet = new Set();
  productList.forEach((p) => {
    if (Array.isArray(p.categories)) {
      p.categories.forEach((c) => {
        if (c && c !== 'All') categorySet.add(c);
      });
    } else if (p.category && p.category !== 'All') {
      categorySet.add(p.category);
    }
  });
  const filterTabs = ['All', ...Array.from(categorySet).slice(0, 5)];

  const filteredProducts = activeTab === 'All'
    ? productList
    : productList.filter((p) => {
        const cats = Array.isArray(p.categories) ? p.categories : [p.category];
        return cats.some((c) => String(c).toLowerCase() === activeTab.toLowerCase());
      });

  const handleAddToCartClick = (product) => {
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    addToCart(product, 1);
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);

    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleBuyClick = (product) => {
    addToCart(product, 1);
    closeCartDrawer();
    navigate('/cart');
  };

  return (
    <section className="w-full bg-[#FFF9F5] py-4 sm:py-9">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Section Header */}
        <div className="flex md:hidden items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-[#1E1217] tracking-tight">
            Best Selling Gifts
          </h2>
          <button
            onClick={() => navigate('/birthday-gifts')}
            className="text-xs font-semibold text-[#821D38] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-4.5 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#ECE7EC] p-3 space-y-3">
                <div className="w-full aspect-square bg-neutral-200 rounded-xl" />
                <div className="h-4 bg-neutral-200 rounded w-3/4" />
                <div className="h-4 bg-neutral-200 rounded w-1/2" />
                <div className="h-8 bg-neutral-200 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Mobile Horizontal Swipeable Products Carousel */}
        {!loading && (
          <div
            className="md:hidden flex gap-3 overflow-x-auto no-scrollbar pb-2 snap-x mb-2"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {filteredProducts.map((product) => {
              const isWishlisted = isInWishlist(product.id);
              const discountPercent = product.originalPrice && product.price < product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.slug || product.id}`)}
                  className="w-[148px] shrink-0 snap-start bg-white rounded-2xl border border-[#ECE7EC] shadow-2xs overflow-hidden flex flex-col justify-between cursor-pointer select-none active:scale-[0.98] transition-transform"
                >
                  {/* Image Box */}
                  <div className="relative w-full aspect-[4/3.8] bg-[#FAF6F4] overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
                        RS Gifts
                      </div>
                    )}
                    {/* Floating Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/95 shadow-xs flex items-center justify-center cursor-pointer"
                      aria-label="Wishlist"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${isWishlisted ? 'text-[#E11D48] fill-[#E11D48]' : 'text-[#821D38] stroke-[2]'}`}
                      />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-2.5 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-xs font-semibold text-[#1E1217] truncate mb-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span className="text-xs font-bold text-[#1E1217]">
                          ₹{Number(product.price || 0).toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-[10px] text-gray-400 line-through">
                            ₹{Number(product.originalPrice || 0).toLocaleString('en-IN')}
                          </span>
                        )}
                        {discountPercent > 0 && (
                          <span className="text-[9px] font-bold text-[#16A34A] bg-[#DCFCE7] px-1 py-0.5 rounded">
                            {discountPercent}% OFF
                          </span>
                        )}
                      </div>

                      {/* Star Rating */}
                      <div className="flex items-center gap-1 text-[11px] text-[#705E67]">
                        <div className="flex text-[#C9A45C]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 fill-[#C9A45C] stroke-[#C9A45C]" />
                          ))}
                        </div>
                        <span className="text-[10px] font-medium text-[#705E67]">
                          {product.rating || '4.8'} ({product.reviews || '0'})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Desktop Section Header with Filter Tabs */}
        {!loading && (
          <div className="hidden md:flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl md:text-[26px] font-bold text-[#1E1217] tracking-tight">
              Featured Products
            </h2>

            {/* Dynamic Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 sm:px-5 py-1.5 rounded-full text-xs sm:text-[13px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-[#821D38] text-white shadow-xs font-semibold'
                      : 'bg-white text-[#4A3E45] hover:text-[#1E1217] border border-[#E8E2E5] hover:border-[#D5CAD0]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Desktop Products Grid */}
        {!loading && (
          filteredProducts.length === 0 ? (
            <div className="hidden md:block py-12 px-6 text-center bg-[#FAF6F4] rounded-2xl border border-dashed border-[#DFC8D0]">
              <p className="text-base font-bold text-[#561023]">No Products Available</p>
              <p className="text-xs text-[#705E67] mt-1 max-w-md mx-auto">
                No products are currently available in this category. Browse other categories or visit the store again soon.
              </p>
            </div>
          ) : (
            <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-4.5">
              {filteredProducts.map((product) => {
                const isWishlisted = isInWishlist(product.id);
                const isAdded = !!addedItems[product.id];

                return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl border border-[#EFEBEF] hover:border-[#DFC8D0] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5 select-none"
                  >
                    {/* Top Image Box */}
                    <div
                      onClick={() => navigate(`/product/${product.slug || product.id}`)}
                      className="relative w-full aspect-[314/276] overflow-hidden bg-[#FAF6F4] cursor-pointer"
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
                          RS Gifts
                        </div>
                      )}

                      {/* Wishlist Heart Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        aria-label="Add to Wishlist"
                        className="absolute top-2.5 right-2.5 w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-white/95 hover:bg-white shadow-sm flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            isWishlisted ? 'text-[#E11D48] fill-[#E11D48]' : 'text-[#821D38] stroke-[2]'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Card Details & Action */}
                    <div className="p-2.5 sm:p-3 flex flex-col justify-between flex-1">
                      <div>
                        {/* Title */}
                        <h3
                          onClick={() => navigate(`/product/${product.slug || product.id}`)}
                          className="text-xs sm:text-[13px] font-semibold text-[#271B21] line-clamp-1 mb-1.5 group-hover:text-[#821D38] transition-colors cursor-pointer"
                        >
                          {product.name}
                        </h3>

                        {/* Price & Discount */}
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-1.5">
                          <span className="text-sm sm:text-[15px] font-bold text-[#1E1217]">
                            ₹{Number(product.price || 0).toLocaleString('en-IN')}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-[11px] sm:text-xs text-gray-400 line-through">
                              ₹{Number(product.originalPrice || 0).toLocaleString('en-IN')}
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
                          <div className="flex items-center text-[#C9A45C]">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-[#C9A45C] stroke-[#C9A45C]" />
                            ))}
                          </div>
                          <span className="text-[11px] text-[#7A6E75] font-medium">
                            ({product.reviews || 0})
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => handleAddToCartClick(product)}
                          className={`w-full py-2 px-1 rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-200 shadow-2xs flex items-center justify-center gap-1 cursor-pointer active:scale-98 ${
                            isAdded
                              ? 'bg-[#15803D] text-white'
                              : 'bg-[#E8A0AD] hover:bg-[#df93a1] text-[#29252A]'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>Added!</span>
                            </>
                          ) : (
                            <span>Add to Cart</span>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleBuyClick(product)}
                          className="w-full py-2 px-1 rounded-xl text-[11px] sm:text-xs font-bold bg-[#A83F5B] hover:bg-[#93344D] text-white transition-all duration-200 shadow-2xs flex items-center justify-center gap-1 cursor-pointer active:scale-98"
                        >
                          <span>Buy</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
