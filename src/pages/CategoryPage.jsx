import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Star, 
  Check, 
  PackageX,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { fetchLiveProducts, fetchLiveCategories } from '../services/productService';

const KNOWN_CATEGORIES = [
  { 
    name: 'Toys and Kids', 
    slug: 'toys-and-kids', 
    description: 'Creative toys, board games, learning gifts, and fun surprises for kids',
    aliases: ['toys-kids', 'toys-and-kids', 'toys', 'kids'] 
  },
  { 
    name: 'Corporate Gifts', 
    slug: 'corporate-gifts', 
    description: 'Executive stationery, corporate gift sets, and employee appreciation packs',
    aliases: ['corporate-gifts', 'corporate'] 
  },
  { 
    name: 'Festival Gifts', 
    slug: 'festival-gifts', 
    description: 'Festive gift hampers, sweets, lamps, and holiday season specials',
    aliases: ['festival-gifts', 'festival', 'festive'] 
  },
  { 
    name: 'Anniversary Gifts', 
    slug: 'anniversary-gifts', 
    description: 'Romantic tokens, milestone gifts, and couple surprises',
    aliases: ['anniversary-gifts', 'anniversary'] 
  },
  { 
    name: 'Birthday Gifts', 
    slug: 'birthday-gifts', 
    description: 'Memorable birthday surprises and celebratory presents for all ages',
    aliases: ['birthday-gifts', 'birthday'] 
  },
  { 
    name: 'Flowers and Hampers', 
    slug: 'flowers-and-hampers', 
    description: 'Fresh flower arrangements, gourmet chocolate boxes, and luxury hampers',
    aliases: ['flowers-and-hampers', 'flowers-hampers', 'flowers', 'hampers'] 
  },
  { 
    name: 'Accessories', 
    slug: 'accessories', 
    description: 'Wallets, wristwatches, jewelry, keychains, and lifestyle accessories',
    aliases: ['accessories'] 
  },
  { 
    name: 'Personalized Gifts', 
    slug: 'personalized-gifts', 
    description: 'Customized mugs, frames, engraved items, and custom keepsakes',
    aliases: ['personalized-gifts', 'personalized'] 
  },
  { 
    name: 'Gifts', 
    slug: 'gifts', 
    description: 'Special gifts and thoughtful presents for every occasion',
    aliases: ['gifts'] 
  }
];

const cleanForCompare = (str) => {
  return String(str || '')
    .toLowerCase()
    .replace(/&/g, '')
    .replace(/\band\b/g, '')
    .replace(/\bfor\b/g, '')
    .replace(/[^a-z0-9]/g, '');
};

export const CategoryPage = () => {
  const { categorySlug: paramSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart, closeCartDrawer } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [categoriesList, setCategoriesList] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [addedItems, setAddedItems] = useState({});

  const rawSlug = useMemo(() => {
    if (paramSlug) return paramSlug.toLowerCase();
    const cleanPath = location.pathname.replace(/^\//, '').toLowerCase();
    if (cleanPath.startsWith('category/')) {
      return cleanPath.replace('category/', '');
    }
    return cleanPath || 'gifts';
  }, [paramSlug, location.pathname]);

  const currentCategory = useMemo(() => {
    const slugClean = cleanForCompare(rawSlug);

    // 1. Look in live categories from backend/admin
    if (categoriesList && categoriesList.length > 0) {
      const liveFound = categoriesList.find(cat => {
        if (!cat) return false;
        return (
          cleanForCompare(cat.name) === slugClean || 
          cleanForCompare(cat.slug) === slugClean
        );
      });
      if (liveFound) {
        return {
          name: liveFound.name,
          description: liveFound.description || '',
          image: liveFound.image || ''
        };
      }
    }

    // 2. Fallback to KNOWN_CATEGORIES
    for (const cat of KNOWN_CATEGORIES) {
      if (cleanForCompare(cat.name) === slugClean || cleanForCompare(cat.slug) === slugClean) {
        return {
          name: cat.name,
          description: cat.description || '',
          image: cat.image || ''
        };
      }
      if (cat.aliases && cat.aliases.some(a => cleanForCompare(a) === slugClean)) {
        return {
          name: cat.name,
          description: cat.description || '',
          image: cat.image || ''
        };
      }
    }

    // 3. Fallback name from slug
    const fallbackName = rawSlug
      .split(/[-_]/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    return {
      name: fallbackName,
      description: '',
      image: ''
    };
  }, [rawSlug, categoriesList]);

  const categoryName = currentCategory.name;
  const categoryDescription = currentCategory.description;

  const isMatch = useCallback((p) => {
    if (!p) return false;
    const targetKey = cleanForCompare(categoryName);
    const slugKey = cleanForCompare(rawSlug);

    const pCat = cleanForCompare(p.category);
    const pTarget = cleanForCompare(p.targetPage);
    const pTargets = Array.isArray(p.targetPages) ? p.targetPages.map(cleanForCompare) : [];
    const pCats = Array.isArray(p.categories) ? p.categories.map(cleanForCompare) : [];

    const allTags = [pCat, pTarget, ...pTargets, ...pCats].filter(Boolean);

    if (allTags.some(t => t === targetKey || t === slugKey)) {
      return true;
    }
    if (allTags.some(t => (t.length >= 4 && targetKey.includes(t)) || (targetKey.length >= 4 && t.includes(targetKey)))) {
      return true;
    }
    return false;
  }, [categoryName, rawSlug]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [liveCats, liveItems] = await Promise.all([
        fetchLiveCategories().catch(() => []),
        fetchLiveProducts().catch(() => [])
      ]);
      if (Array.isArray(liveCats) && liveCats.length > 0) {
        setCategoriesList(liveCats);
      }
      const matched = (liveItems || []).filter(isMatch);
      setProducts(matched);
    } catch (err) {
      console.error('Failed to load category data:', err);
    } finally {
      setLoading(false);
    }
  }, [isMatch]);

  useEffect(() => {
    loadData();
    const handleFocus = () => loadData();
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [loadData]);

  const sortedProducts = useMemo(() => {
    const list = [...products];
    if (sortBy === 'price_asc') {
      return list.sort((a, b) => (a.price || 0) - (b.price || 0));
    }
    if (sortBy === 'price_desc') {
      return list.sort((a, b) => (b.price || 0) - (a.price || 0));
    }
    if (sortBy === 'rating') {
      return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return list.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [products, sortBy]);

  const handleAddToCartClick = (product) => {
    addToCart(product, 1);
    setAddedItems(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const handleBuyClick = (product) => {
    addToCart(product, 1);
    if (closeCartDrawer) closeCartDrawer();
    navigate('/cart');
  };

  return (
    <div className="w-full bg-[#FFF9F5] min-h-screen pb-16">
      {/* Category Name & Description Header */}
      <div className="w-full bg-white border-b border-[#ECE7EC]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1E1217] tracking-tight">
              {categoryName}
            </h1>
            {categoryDescription && (
              <p className="text-xs sm:text-sm text-[#705E67] mt-1 max-w-2xl leading-relaxed">
                {categoryDescription}
              </p>
            )}
          </div>

          {sortedProducts.length > 0 && (
            <div className="self-start sm:self-center shrink-0">
              <span className="text-xs font-semibold text-[#821D38] bg-[#FFF5F7] border border-[#821D38]/15 px-3 py-1.5 rounded-full">
                {sortedProducts.length} {sortedProducts.length === 1 ? 'Product' : 'Products'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid in the Middle - Matching Home Featured Products Card Exactly */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-4.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-[#ECE7EC] animate-pulse space-y-3">
                <div className="w-full aspect-[314/276] bg-neutral-200 rounded-xl" />
                <div className="h-4 bg-neutral-200 rounded w-3/4" />
                <div className="h-4 bg-neutral-200 rounded w-1/2" />
                <div className="h-9 bg-neutral-200 rounded-xl w-full" />
              </div>
            ))}
          </div>
        )}

        {!loading && sortedProducts.length === 0 && (
          <div className="bg-white rounded-3xl border border-[#ECE7EC] p-12 text-center my-10 max-w-lg mx-auto shadow-2xs">
            <div className="w-16 h-16 rounded-2xl bg-[#FFF9F5] text-[#821D38] flex items-center justify-center mx-auto mb-4 border border-[#821D38]/20">
              <PackageX size={32} />
            </div>
            <h3 className="text-lg font-bold text-[#1E1217] mb-1">
              No products found in {categoryName}
            </h3>
            <p className="text-xs text-[#705E67] mb-6 leading-relaxed">
              New products added under this category will show up here.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 rounded-xl bg-[#821D38] text-white text-xs font-bold hover:bg-[#6E162E] transition-colors cursor-pointer inline-flex items-center gap-2 shadow-sm"
            >
              <span>Explore All Gifts</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Exact same card design as Home Page Featured Products (Moon Lamp Card) */}
        {!loading && sortedProducts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-4.5">
            {sortedProducts.map((product) => {
              const isWishlisted = isInWishlist(product.id);
              const isAdded = !!addedItems[product.id];
              const displayImage = product.image || (product.gallery && product.gallery[0]) || '';

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl border border-[#EFEBEF] hover:border-[#DFC8D0] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5 select-none"
                >
                  {/* Top Image Box */}
                  <div
                    onClick={() => navigate(`/product/${product.slug || product.id}`)}
                    className="relative w-full aspect-[314/276] overflow-hidden bg-[#FAF6F4] flex items-center justify-center p-2.5 cursor-pointer"
                  >
                    {displayImage ? (
                      <img
                        src={displayImage}
                        alt={product.title || product.name}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
                        RS Gifts
                      </div>
                    )}

                    {/* Wishlist Heart Button - Matching Home Moon Lamp */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      aria-label="Add to Wishlist"
                      className="absolute top-2.5 right-2.5 z-10 w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-white/95 hover:bg-white shadow-sm flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isWishlisted ? 'text-[#E11D48] fill-[#E11D48]' : 'text-[#821D38] stroke-[2]'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Card Details & Action Buttons - Matching Home Moon Lamp */}
                  <div className="p-2.5 sm:p-3 flex flex-col justify-between flex-1">
                    <div>
                      {/* Title */}
                      <h3
                        onClick={() => navigate(`/product/${product.slug || product.id}`)}
                        className="text-xs sm:text-[13px] font-semibold text-[#271B21] line-clamp-1 mb-1 group-hover:text-[#821D38] transition-colors cursor-pointer"
                      >
                        {product.title || product.name}
                      </h3>

                      {/* 5-Star Rating Row */}
                      <div
                        className="flex items-center gap-1.5 my-1"
                        title={product.reviews > 0 ? `${product.rating} out of 5 stars (${product.reviews} reviews)` : 'No reviews yet'}
                      >
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((starIndex) => {
                            const isFilled = product.reviews > 0 && starIndex <= Math.round(Number(product.rating || 0));
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
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-1.5">
                        <span className="text-sm sm:text-[15px] font-bold text-[#821D38]">
                          ₹{Number(product.price || 0).toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-neutral-400 line-through">
                            ₹{Number(product.originalPrice || 0).toLocaleString('en-IN')}
                          </span>
                        )}
                        {product.discountPercent > 0 && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {product.discountPercent}% OFF
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons: [Add to Cart] and [Buy] Side by Side */}
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
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
