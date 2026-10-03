import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Truck, 
  ShieldCheck, 
  Gift, 
  ArrowRight, 
  Heart, 
  Star, 
  Check, 
  Cake 
} from 'lucide-react';
import birthdayHeroImg from '../assets/birthday-hero.png';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { fetchLiveProducts, fetchActiveCoupon } from '../services/productService';

export const BirthdayGiftsPage = () => {
  const navigate = useNavigate();
  const { addToCart, closeCartDrawer } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Strictly matches products that belong to the Birthday Gifts page or category
  const isBirthdayMatch = (p) => {
    if (!p) return false;
    const cat = String(p.category || '').toLowerCase().replace(/[-_]/g, ' ').trim();
    const tPage = String(p.targetPage || '').toLowerCase().replace(/[-_]/g, ' ').trim();
    const tPages = Array.isArray(p.targetPages)
      ? p.targetPages.map((pg) => String(pg).toLowerCase().replace(/[-_]/g, ' ').trim())
      : [];
    const cats = Array.isArray(p.categories)
      ? p.categories.map((cg) => String(cg).toLowerCase().replace(/[-_]/g, ' ').trim())
      : [];

    return (
      tPage === 'birthday gifts' ||
      tPage === 'birthday' ||
      tPages.includes('birthday gifts') ||
      tPages.includes('birthday') ||
      cat === 'birthday gifts' ||
      cat === 'birthday' ||
      cats.includes('birthday gifts')
    );
  };

  const getInitialBirthdayProducts = () => {
    try {
      const cached = sessionStorage.getItem('rs_gifts_birthday_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      const savedAdmin = localStorage.getItem('rs_gifts_admin_clean_frame_v3');
      if (savedAdmin) {
        const parsed = JSON.parse(savedAdmin);
        const adminProds = parsed.products || [];
        const matched = adminProds
          .filter((p) => p.active !== false && isBirthdayMatch(p))
          .map((p) => ({
            id: p._id || p.id,
            name: p.title || p.name || 'Untitled Gift',
            price: Number(p.salePrice || p.price || 0),
            originalPrice: Number(p.price || p.salePrice || 0),
            discount: '₹200 OFF',
            rating: p.ratings?.average || 5.0,
            reviews: p.ratings?.count || 0,
            image: p.image || '',
            category: p.category || 'Birthday Gifts',
            targetPage: p.targetPage || 'Birthday Gifts',
            stock: p.stock ?? 10,
            featured: !!p.featured
          }));
        if (matched.length > 0) return matched;
      }
    } catch {
      // ignore
    }
    return [];
  };

  const birthdayData = {
    tagline: 'CELEBRATE THEIR SPECIAL DAY',
    titleLine1: 'Make Every Birthday,',
    titleLine2: 'Truly Unforgettable',
    hasHeart: true,
    description: 'Thoughtful gifts, sweet surprises, and memorable hampers.\nBecause every birthday deserves something magical.',
    buttonText: 'Shop Birthday Gifts',
    image: birthdayHeroImg || '/images/birthday-hero.png',
    badges: [
      { id: 'b1', icon: Truck, label: 'Fast & Reliable Delivery' },
      { id: 'b2', icon: ShieldCheck, label: 'Secure Payments' },
      { id: 'b3', icon: Gift, label: 'Easy Returns' },
    ]
  };

  const [products, setProducts] = useState(getInitialBirthdayProducts);
  const [addedItems, setAddedItems] = useState({});
  const [activeCoupon, setActiveCoupon] = useState(null);

  const loadBirthdayProducts = useCallback(async () => {
    try {
      fetchActiveCoupon()
        .then((cpn) => {
          if (cpn) setActiveCoupon(cpn);
        })
        .catch(() => {});

      let liveItems = [];
      try {
        liveItems = await fetchLiveProducts({ targetPage: 'Birthday Gifts' });
      } catch {
        liveItems = await fetchLiveProducts();
      }

      let matched = (liveItems || []).filter(isBirthdayMatch);

      // Also check localStorage in case the admin just added a product in another tab
      try {
        const savedAdmin = localStorage.getItem('rs_gifts_admin_clean_frame_v3');
        if (savedAdmin) {
          const parsed = JSON.parse(savedAdmin);
          const adminProds = parsed.products || [];
          const adminBirthday = adminProds
            .filter((p) => p.active !== false && isBirthdayMatch(p))
            .map((p) => ({
              id: p._id || p.id,
              name: p.title || p.name || 'Untitled Gift',
              price: Number(p.salePrice || p.price || 0),
              originalPrice: Number(p.price || p.salePrice || 0),
              discount: '₹200 OFF',
              rating: p.ratings?.average || 5.0,
              reviews: p.ratings?.count || 0,
              image: p.image || '',
              category: p.category || 'Birthday Gifts',
              targetPage: p.targetPage || 'Birthday Gifts',
              stock: p.stock ?? 10,
              featured: !!p.featured
            }));

          const seen = new Set(matched.map((m) => m.id || m.name));
          adminBirthday.forEach((ap) => {
            if (!seen.has(ap.id) && !seen.has(ap.name)) {
              matched.unshift(ap);
              seen.add(ap.id);
            }
          });
        }
      } catch (e) {
        console.warn('LocalStorage admin sync warning:', e);
      }

      setProducts(matched);
      try {
        sessionStorage.setItem('rs_gifts_birthday_cache', JSON.stringify(matched));
      } catch {}
    } catch (err) {
      console.error('Failed to load birthday products:', err);
    }
  }, []);

  useEffect(() => {
    loadBirthdayProducts();

    const handleFocus = () => loadBirthdayProducts();
    const handleStorage = (e) => {
      if (e.key === 'rs_gifts_admin_clean_frame_v3' || !e.key) {
        loadBirthdayProducts();
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorage);
    };
  }, [loadBirthdayProducts]);

  const handleAddToCartClick = (product) => {
    addToCart(product, 1);
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const handleBuyClick = (product) => {
    addToCart(product, 1);
    closeCartDrawer();
    navigate('/cart');
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('birthday-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-[#FFF9F5] min-h-screen pb-16">
      {/* Hero Section matching Home Page structure exactly */}
      <section 
        className="relative w-full overflow-hidden bg-[#FFF9F5] select-none"
        aria-label="Birthday Gifts Hero"
      >
        <div className="w-full shrink-0 relative min-h-[270px] sm:min-h-[295px] lg:min-h-[320px] flex items-center">
          {/* Background Image */}
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center lg:bg-right transition-opacity duration-500"
            style={{ 
              backgroundImage: `url("${birthdayData.image}")`,
              backgroundColor: '#FDF7F4'
            }}
          />

          {/* Soft Ambient Gradient Overlay: ensures text readability on the left while keeping the luxury gifts crisp on the right */}
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{
              background: 'linear-gradient(to right, rgba(255, 255, 255, 0.96) 0%, rgba(255, 255, 255, 0.90) 32%, rgba(255, 255, 255, 0.65) 55%, rgba(255, 255, 255, 0.15) 80%, rgba(255, 255, 255, 0) 100%)'
            }}
          />

          {/* Inner Content Area */}
          <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-12 py-3.5 sm:py-5 lg:py-6 flex flex-col justify-center">
            <div className="max-w-[500px]">
              {/* Tagline / Subtitle */}
              <p 
                className="text-[10px] sm:text-[11px] font-semibold tracking-[0.16em] text-[#821D38] uppercase mb-1 flex items-center gap-1.5"
              >
                {birthdayData.tagline}
              </p>

              {/* Main Heading */}
              <h1 
                className="text-xl sm:text-2xl md:text-[30px] lg:text-[34px] font-serif font-bold text-[#561023] leading-[1.12] tracking-tight mb-1.5 sm:mb-2"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                <span>{birthdayData.titleLine1}</span>
                {birthdayData.titleLine2 && (
                  <>
                    <br />
                    <span className="inline-flex items-center gap-1.5">
                      {birthdayData.titleLine2}
                      {birthdayData.hasHeart && (
                        <Heart 
                          className="w-5 h-5 sm:w-6 sm:h-6 text-[#821D38] stroke-[2] fill-transparent inline-block -mt-1 transform hover:scale-110 transition-transform" 
                        />
                      )}
                    </span>
                  </>
                )}
              </h1>

              {/* Description */}
              <p 
                className="text-xs sm:text-[13px] text-[#52454B] leading-snug mb-3 sm:mb-3.5 whitespace-pre-line font-normal"
              >
                {birthdayData.description}
              </p>

              {/* Call to Action Button */}
              <div className="mb-3 sm:mb-4 relative z-30">
                <button
                  type="button"
                  onClick={scrollToCatalog}
                  className="group inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-[#821D38] hover:bg-[#6E162E] text-white text-xs sm:text-[13px] font-medium shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <span>{birthdayData.buttonText}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>

              {/* Trust Badges matching reference */}
              <div className="flex flex-wrap items-center gap-3.5 sm:gap-5 text-[10.5px] sm:text-[11.5px] font-medium text-[#483B42]">
                {birthdayData.badges.map((badge) => {
                  const IconComponent = badge.icon || Gift;
                  return (
                    <div key={badge.id} className="flex items-center gap-1.5">
                      <IconComponent className="w-3.5 h-3.5 text-[#821D38] stroke-[2] shrink-0" />
                      <span>{badge.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Birthday Gifts Catalog Section */}
      <section id="birthday-catalog" className="w-full bg-[#FFF9F5] py-8 sm:py-10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-[#1E1217] tracking-tight">
                  Birthday Gifts Collection
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#705E67] mt-1">
                Explore handpicked presents, delicious surprises, and bespoke birthday hampers.
              </p>
            </div>
          </div>

          {products.length === 0 ? (
            /* Empty State - Waiting for user to add products */
            <div className="py-14 px-6 text-center bg-white rounded-2xl border border-dashed border-[#DFC8D0] shadow-2xs max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-full bg-[#FDF2F5] text-[#821D38] flex items-center justify-center mx-auto mb-3">
                <Cake size={24} />
              </div>
              <h3 className="text-base font-bold text-[#561023] mb-1">
                No Birthday Gifts Added Yet
              </h3>
              <p className="text-xs sm:text-sm text-[#705E67] max-w-md mx-auto leading-relaxed">
                When you add products and select <span className="font-semibold text-[#821D38]">"Birthday Gifts"</span> in the Admin panel, they will appear here automatically with your image, price, and name.
              </p>
            </div>
          ) : (
            /* Products Grid displaying products added by the user */
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-4.5">
              {products.map((product) => {
                const isWishlisted = isInWishlist(product.id);
                const isAdded = !!addedItems[product.id];
                const displayDiscount = activeCoupon
                  ? (activeCoupon.discountType === 'flat' || activeCoupon.discountType === 'fixed'
                      ? `₹${activeCoupon.discountValue} OFF`
                      : `${activeCoupon.discountValue}% OFF`)
                  : product.discount || null;

                return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl border border-[#EFEBEF] hover:border-[#DFC8D0] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5 select-none"
                  >
                    {/* Product Image */}
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
                        <div className="w-full h-full flex items-center justify-center text-[#821D38]/30">
                          <Gift size={36} />
                        </div>
                      )}

                      {/* Wishlist Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        aria-label="Add to Wishlist"
                        className="absolute top-2.5 right-2.5 w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-white/95 hover:bg-white shadow-sm flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            isWishlisted
                              ? 'text-[#E11D48] fill-[#E11D48]'
                              : 'text-[#821D38] stroke-[2]'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Product Details */}
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
                            ₹{Number(product.price).toLocaleString('en-IN')}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-[11px] sm:text-xs text-gray-400 line-through">
                              ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                            </span>
                          )}
                          {displayDiscount && (
                            <span className="text-[10px] sm:text-[11px] font-semibold text-[#18794E] bg-[#E8F5E9] px-1.5 py-0.5 rounded">
                              {displayDiscount}
                            </span>
                          )}
                        </div>

                        {/* Rating */}
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
                            ({product.reviews || 0})
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons: Add to Cart & Buy */}
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
      </section>
    </div>
  );
};

export default BirthdayGiftsPage;
