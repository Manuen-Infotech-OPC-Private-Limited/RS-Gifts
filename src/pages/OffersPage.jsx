import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tag,
  Percent,
  Sparkles,
  Copy,
  Check,
  Heart,
  Star,
  ShoppingCart,
  ArrowRight,
  Gift,
  Clock,
  SlidersHorizontal,
  BadgePercent
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { fetchOfferProducts } from '../services/productService';
import SEO from '../components/common/SEO';

export const OffersPage = () => {
  const navigate = useNavigate();
  const { addToCart, openCartDrawer } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [loading, setLoading] = useState(true);
  const [offerProducts, setOfferProducts] = useState([]);
  const [activeCoupons, setActiveCoupons] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('discount_desc');
  const [copiedCode, setCopiedCode] = useState(null);
  const [addedItemIds, setAddedItemIds] = useState({});

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const loadOffers = () => {
    setLoading(true);
    fetchOfferProducts()
      .then((res) => {
        setOfferProducts(res.products || []);
        setActiveCoupons(res.activeCoupons || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading offers:', err);
        setOfferProducts([]);
        setActiveCoupons([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadOffers();
    window.addEventListener('focus', loadOffers);
    return () => window.removeEventListener('focus', loadOffers);
  }, []);

  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    }).catch(() => { });
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart({
      id: product.id || product._id,
      title: product.name || product.title,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      sku: product.sku
    });
    setAddedItemIds((prev) => ({ ...prev, [product.id || product._id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [product.id || product._id]: false }));
    }, 1800);
  };

  // Extract unique categories among offer products
  const availableCategories = useMemo(() => {
    const cats = new Set();
    offerProducts.forEach((p) => {
      if (p.category) cats.add(p.category);
      if (p.targetPage) cats.add(p.targetPage);
    });
    return ['All', ...Array.from(cats)];
  }, [offerProducts]);

  // Filter & Sort Products
  const processedProducts = useMemo(() => {
    let list = [...offerProducts];

    // Category filter
    if (selectedCategory !== 'All') {
      list = list.filter((p) =>
        p.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        p.targetPage?.toLowerCase() === selectedCategory.toLowerCase() ||
        (Array.isArray(p.targetPages) && p.targetPages.some((tp) => tp?.toLowerCase() === selectedCategory.toLowerCase()))
      );
    }

    // Sort options
    if (sortBy === 'discount_desc') {
      list.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
    } else if (sortBy === 'savings_desc') {
      list.sort((a, b) => (b.savingsAmount || 0) - (a.savingsAmount || 0));
    } else if (sortBy === 'price_asc') {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }

    return list;
  }, [offerProducts, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-neutral-800 pb-20">
      <SEO
        title="Special Offers, Deals & Coupons | RS Gifts"
        description="Save on luxury gift hampers, festive specials, and personalized presents with exclusive discounts and coupon codes at RS Gifts."
        canonical="/offers"
        keywords="gift offers, discount gift hampers, coupon codes RS gifts, cheap gift delivery"
      />

      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF0E6] via-[#FFF9F5] to-[#FFF9F5] pt-4 pb-1 sm:pt-6 sm:pb-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto text-center relative z-10">
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1E1217] tracking-tight">
            Special <span className="text-[#821D38] italic font-normal">Offers &amp; Deals</span>
          </h1>

          <p className="mt-1 text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto leading-relaxed">
            Handcrafted discounts, celebratory price cuts, and special offers to make your gift unforgettable.
          </p>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-0 space-y-5 sm:space-y-6">

        {/* 3. CONTROLS BAR: CATEGORIES & SORT */}
        <section className="bg-white rounded-xl border border-[#ECE7EC] py-2 px-3 sm:py-2.5 sm:px-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar py-0.5">
            {availableCategories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer select-none ${isSelected
                    ? 'bg-[#821D38] text-white shadow-2xs'
                    : 'bg-[#FAF6F4] text-neutral-700 hover:bg-[#F3ECEF] hover:text-[#821D38]'
                    }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 w-full md:w-auto justify-end">
            <span className="text-[11px] sm:text-xs text-neutral-500 font-medium flex items-center gap-1 shrink-0">
              <SlidersHorizontal size={12} />
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-[11px] sm:text-xs font-semibold text-neutral-800 bg-[#FAF6F4] border border-[#ECE7EC] rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-[#821D38] cursor-pointer"
            >
              <option value="discount_desc">Highest Discount (%)</option>
              <option value="savings_desc">Highest Savings (₹)</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </section>

        {/* 4. PRODUCT OFFERS GRID */}
        <section>
          {loading ? (
            /* Loading Skeletons */
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#ECE7EC] p-3 animate-pulse space-y-3">
                  <div className="w-full aspect-square bg-neutral-200 rounded-xl" />
                  <div className="h-4 bg-neutral-200 rounded w-3/4" />
                  <div className="h-4 bg-neutral-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : processedProducts.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs sm:text-sm font-semibold text-neutral-600">
                  Showing <span className="text-[#821D38] font-bold">{processedProducts.length}</span> active discounted gifts
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
                {processedProducts.map((product) => {
                  const isWishlisted = isInWishlist(product.id || product._id);
                  const isAdded = !!addedItemIds[product.id || product._id];

                  return (
                    <div
                      key={product.id || product._id}
                      onClick={() => navigate(`/product/${product.slug || product.id || product._id}`)}
                      className="group bg-white rounded-2xl border border-[#ECE7EC] shadow-2xs hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer select-none"
                    >
                      {/* Image Box */}
                      <div className="relative w-full aspect-square bg-[#FAF6F4] overflow-hidden">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name || product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
                            RS Gifts
                          </div>
                        )}

                        {/* Top Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10">
                          {product.discountPercent > 0 && (
                            <span className="bg-[#821D38] text-white text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded-lg shadow-xs tracking-tight">
                              {product.discountPercent}% OFF
                            </span>
                          )}
                          {product.offerTag && (
                            <span className="bg-amber-500 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-xs truncate max-w-[110px]">
                              {product.offerTag}
                            </span>
                          )}
                        </div>

                        {/* Floating Wishlist Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product);
                          }}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs shadow-xs flex items-center justify-center cursor-pointer hover:bg-white transition-colors z-10"
                          aria-label="Wishlist"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 transition-colors ${isWishlisted ? 'text-[#E11D48] fill-[#E11D48]' : 'text-[#821D38] stroke-[2]'
                              }`}
                          />
                        </button>
                      </div>

                      {/* Content Section */}
                      <div className="p-3 sm:p-4 flex flex-col justify-between flex-1 space-y-2">
                        <div>
                          <h3 className="text-xs sm:text-sm font-semibold text-[#1E1217] line-clamp-2 leading-snug group-hover:text-[#821D38] transition-colors">
                            {product.name || product.title}
                          </h3>

                          {/* 5-Star Rating Row with Number */}
                          <div
                            className="flex items-center gap-1.5 my-1"
                            title={`${product.rating || 4.8} out of 5 stars (${product.reviews || 0} reviews)`}
                          >
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((starIndex) => {
                                const isFilled = starIndex <= Math.round(Number(product.rating || 5));
                                return (
                                  <Star
                                    key={starIndex}
                                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                                      isFilled
                                        ? 'text-amber-400 fill-amber-400'
                                        : 'text-neutral-200 fill-none'
                                    }`}
                                  />
                                );
                              })}
                            </div>
                            <span className="text-[11px] sm:text-xs font-bold text-[#1E1217]">
                              {product.ratingDisplay || (Number(product.rating || 5) % 1 === 0 ? String(product.rating || 5) : Number(product.rating || 5).toFixed(1))}
                            </span>
                            {product.reviews > 0 && (
                              <span className="text-[10px] sm:text-[11px] text-neutral-400">
                                ({product.reviews})
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price Details with Strikethrough & Savings */}
                        <div className="pt-1">
                          <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className="text-sm sm:text-base font-extrabold text-[#821D38]">
                              ₹{Number(product.price || 0).toLocaleString('en-IN')}
                            </span>
                            {product.originalPrice > product.price && (
                              <span className="text-xs text-neutral-400 line-through">
                                ₹{Number(product.originalPrice || 0).toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>

                          {product.savingsAmount > 0 && (
                            <p className="text-[10px] sm:text-[11px] text-emerald-700 font-semibold mt-0.5">
                              Save ₹{Number(product.savingsAmount).toLocaleString('en-IN')}
                            </p>
                          )}

                          {/* Quick Add To Cart Button */}
                          <button
                            type="button"
                            onClick={(e) => handleAddToCart(e, product)}
                            className={`w-full mt-2.5 py-1.5 sm:py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${isAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#FFF9F5] hover:bg-[#821D38] text-[#821D38] hover:text-white border border-[#821D38]/30 shadow-2xs active:scale-95'
                              }`}
                          >
                            {isAdded ? (
                              <>
                                <Check size={13} />
                                <span>Added!</span>
                              </>
                            ) : (
                              <>
                                <ShoppingCart size={13} />
                                <span>Claim Offer</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl border border-[#ECE7EC] p-8 sm:p-12 text-center max-w-xl mx-auto shadow-2xs space-y-4">
              <div className="w-16 h-16 bg-[#FDF2F4] text-[#821D38] rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                <Gift className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1217]">
                New Special Offers Coming Soon!
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Our team is curating exciting festive discounts and seasonal deals. Meanwhile, explore our full gifting collection!
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-6 py-2.5 rounded-xl bg-[#821D38] hover:bg-[#6E162E] text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer transition-colors"
                >
                  Explore All Gifts
                </button>
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default OffersPage;

