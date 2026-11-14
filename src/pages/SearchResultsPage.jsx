import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Star, 
  Check, 
  SlidersHorizontal,
  PackageX,
  Search,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { fetchLiveProducts } from '../services/productService';
import SEO from '../components/common/SEO';

export const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart, closeCartDrawer } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const searchQuery = searchParams.get('q') || '';

  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  const [addedItems, setAddedItems] = useState({});

  const loadSearchResults = useCallback(async () => {
    try {
      setLoading(true);
      const trimmed = searchQuery.trim();
      
      const [matchedItems, allItems] = await Promise.all([
        fetchLiveProducts({ search: trimmed, limit: 60 }).catch(() => []),
        fetchLiveProducts({ limit: 12 }).catch(() => [])
      ]);

      setProducts(matchedItems);
      // Top recommended items for fallback if 0 matches
      setRecommendations(allItems.slice(0, 10));
    } catch (err) {
      console.error('Failed to load search results:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadSearchResults();
    const handleFocus = () => loadSearchResults();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [loadSearchResults]);

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
    return list;
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

  const renderProductCard = (product) => {
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

          {/* Wishlist Heart Button */}
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

        {/* Card Details & Action Buttons */}
        <div className="p-2.5 sm:p-3 flex flex-col justify-between flex-1">
          <div>
            {/* Title */}
            <h3
              onClick={() => navigate(`/product/${product.slug || product.id}`)}
              className="text-xs sm:text-[13px] font-semibold text-[#271B21] line-clamp-1 mb-1 group-hover:text-[#821D38] transition-colors cursor-pointer"
            >
              {product.title || product.name}
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

            {/* Price */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-1.5">
              <span className="text-sm sm:text-[15px] font-bold text-[#1E1217]">
                ₹{Number(product.price || 0).toLocaleString('en-IN')}
              </span>
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
  };

  return (
    <div className="w-full bg-[#FFF9F5] min-h-screen pb-16">
      <SEO
        title={searchQuery ? `Search: "${searchQuery}" | RS Gifts` : 'Search Gifts | RS Gifts'}
        description={`Find curated gifts, personalized hampers, and celebration presents for "${searchQuery || 'all gifts'}" at RS Gifts.`}
        canonical={`/search${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`}
      />
      {/* Search Header Banner */}
      <div className="w-full bg-white border-b border-[#ECE7EC]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#821D38] mb-1">
              <Search size={14} />
              <span>Search Results</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1E1217]">
              {searchQuery ? `Results for "${searchQuery}"` : 'All Gifts'}
            </h1>
            <p className="text-xs text-[#705E67] mt-0.5">
              {loading ? 'Searching catalog...' : `${sortedProducts.length} ${sortedProducts.length === 1 ? 'gift' : 'gifts'} found matching your search`}
            </p>
          </div>

          {sortedProducts.length > 0 && (
            <div className="flex items-center gap-2.5 self-start sm:self-center">
              <span className="text-xs font-medium text-[#705E67]">Sort by:</span>
              <div className="flex items-center gap-1.5 bg-[#FAF6F4] px-3 py-1.5 rounded-xl border border-[#ECE7EC]">
                <SlidersHorizontal size={13} className="text-[#821D38]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs font-semibold text-[#1E1217] bg-transparent outline-none cursor-pointer"
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid Content */}
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

        {/* Found matching products */}
        {!loading && sortedProducts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-4.5">
            {sortedProducts.map(renderProductCard)}
          </div>
        )}

        {/* Zero results: Friendly fallback with recommendations */}
        {!loading && sortedProducts.length === 0 && (
          <div className="space-y-10">
            <div className="bg-white rounded-3xl border border-[#ECE7EC] p-8 sm:p-12 text-center max-w-lg mx-auto shadow-2xs">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF9F5] text-[#821D38] flex items-center justify-center mx-auto mb-3.5 border border-[#821D38]/20">
                <PackageX size={28} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#1E1217] mb-1">
                No direct matches for "{searchQuery}"
              </h3>
              <p className="text-xs text-[#705E67] mb-5 leading-relaxed">
                We couldn't find an exact gift matching this keyword. Try checking your spelling or explore our trending gift suggestions below.
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-5 py-2.5 rounded-xl bg-[#821D38] text-white text-xs font-bold hover:bg-[#6E162E] transition-colors cursor-pointer inline-flex items-center gap-2 shadow-sm"
              >
                <span>Browse All Gifts</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Popular & Recommended Gifts */}
            {recommendations.length > 0 && (
              <div className="pt-4 border-t border-[#ECE7EC]">
                <div className="flex items-center gap-2 mb-5">
                  <Sparkles size={18} className="text-[#C9A45C]" />
                  <h2 className="text-lg sm:text-xl font-bold text-[#1E1217]">
                    Popular Gifts You Might Love
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-4.5">
                  {recommendations.map(renderProductCard)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;

