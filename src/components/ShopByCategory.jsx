import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLiveCategories } from '../services/productService';

const getCategoryPath = (cat) => {
  const s = (cat.slug || '').toLowerCase();
  const n = (cat.name || '').toLowerCase();
  if (s.includes('birthday') || n.includes('birthday')) return '/birthday-gifts';
  if (s.includes('anniversary') || n.includes('anniversary')) return '/anniversary-gifts';
  if (s.includes('personalized') || n.includes('personalized')) return '/personalized-gifts';
  if (s.includes('festival') || n.includes('festival') || n.includes('festive')) return '/festival-gifts';
  if (s.includes('corporate') || n.includes('corporate')) return '/category/corporate-gifts';
  if (s.includes('flower') || n.includes('flower') || s.includes('hamper') || n.includes('hamper')) return '/category/flowers-hampers';
  if (s.includes('toy') || n.includes('toy') || s.includes('kid') || n.includes('kid') || n.includes('teddy')) return '/category/toys-kids';
  if (s.includes('home') || n.includes('home') || s.includes('decor') || n.includes('decor')) return '/category/home-decor';
  if (s.includes('accessori') || n.includes('accessori')) return '/category/accessories';
  if (s.includes('gift') || n.includes('gift')) return '/category/gifts';
  return `/category/${cat.slug || 'gifts'}`;
};

const getDefaultFallbackImage = (cat) => {
  const s = (cat.slug || '').toLowerCase();
  const n = (cat.name || '').toLowerCase();
  if (s.includes('birthday') || n.includes('birthday')) return '/images/categories/birthday-gifts.png';
  if (s.includes('anniversary') || n.includes('anniversary')) return '/images/categories/anniversary-gifts.png';
  if (s.includes('corporate') || n.includes('corporate')) return '/images/categories/corporate-gifts.png';
  if (s.includes('flower') || n.includes('flower') || s.includes('hamper') || n.includes('hamper')) return '/images/categories/flowers-hampers.png';
  if (s.includes('toy') || n.includes('toy') || s.includes('kid') || n.includes('kid') || n.includes('teddy')) return '/images/categories/toys-kids.png';
  if (s.includes('personalized') || n.includes('personalized')) return '/images/categories/personalized-gifts.png';
  if (s.includes('home') || n.includes('home') || s.includes('decor') || n.includes('decor')) return '/images/categories/home-decor.png';
  if (s.includes('accessori') || n.includes('accessori')) return '/images/categories/accessories.png';
  if (s.includes('festival') || n.includes('festival') || n.includes('festive')) return '/images/categories/festival-gifts.png';
  return '/images/categories/gifts.png';
};

export const ShopByCategory = ({ onSelectCategory }) => {
  const navigate = useNavigate();
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = useCallback(async () => {
    try {
      const live = await fetchLiveCategories();
      if (live && Array.isArray(live) && live.length > 0) {
        const activeCategories = live
          .filter((c) => c && c.active !== false && !['home-decor', 'home-and-decor'].includes((c.slug || '').toLowerCase()))
          .map((c) => ({
            id: c._id || c.id || c.slug,
            name: c.name,
            displayName: c.name,
            slug: c.slug || c.name.toLowerCase().replace(/\s+/g, '-'),
            image: (c.image && c.image.trim()) ? c.image.trim() : getDefaultFallbackImage(c),
            fallbackImage: getDefaultFallbackImage(c),
            path: getCategoryPath(c),
          }));
        setCategoriesList(activeCategories);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Could not load live categories from backend:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadCategories();
    window.addEventListener('focus', loadCategories);
    return () => {
      window.removeEventListener('focus', loadCategories);
    };
  }, [loadCategories]);

  const handleCategoryClick = (category) => {
    if (onSelectCategory) {
      onSelectCategory(category);
    } else if (navigate) {
      navigate(category.path);
    }
  };

  return (
    <section className="w-full bg-[#FFF9F5] py-4 sm:py-6 relative select-none">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-3.5 sm:mb-6">
          <h2 className="text-lg sm:text-2xl md:text-[26px] font-bold text-[#1E1217] tracking-tight">
            Shop by Category
          </h2>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3 animate-pulse">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <div className="w-14 h-14 bg-neutral-200 rounded-full" />
                <div className="w-12 h-3 bg-neutral-200 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Mobile Horizontal Scrolling Row */}
        {!loading && (
          <div className="md:hidden w-full">
            <div
              className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1 scroll-smooth w-full px-0.5"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {categoriesList.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className="flex flex-col items-center shrink-0 cursor-pointer group active:scale-95 transition-transform"
                  style={{ width: '64px' }}
                >
                  <div className="w-[54px] h-[54px] flex items-center justify-center p-1 transition-transform duration-200 group-hover:scale-110 group-active:scale-95 shrink-0">
                    <img
                      src={category.image}
                      alt={category.displayName || category.name}
                      className="max-w-full max-h-full w-auto h-auto object-contain mix-blend-multiply"
                      loading="lazy"
                      onError={(e) => {
                        if (category.fallbackImage && e.target.src !== category.fallbackImage) {
                          e.target.src = category.fallbackImage;
                        }
                      }}
                    />
                  </div>
                  <span className="mt-1.5 text-[11px] font-medium text-[#271B21] group-hover:text-[#821D38] text-center truncate w-full transition-colors">
                    {category.displayName || category.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Desktop Categories Grid - Clean, Borderless Layout */}
        {!loading && (
          <div className="hidden md:block w-full">
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2.5 sm:gap-3.5 lg:gap-4 xl:gap-4.5 items-start">
              {categoriesList.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className="group flex flex-col items-center cursor-pointer select-none w-full h-full justify-start text-center"
                >
                  <div className="w-full h-20 sm:h-24 md:h-20 lg:h-24 max-w-[96px] mx-auto flex items-center justify-center p-1 sm:p-1.5 transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:scale-110 shrink-0">
                    <img
                      src={category.image}
                      alt={category.displayName || category.name}
                      className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-300 mix-blend-multiply"
                      loading="lazy"
                      onError={(e) => {
                        if (category.fallbackImage && e.target.src !== category.fallbackImage) {
                          e.target.src = category.fallbackImage;
                        }
                      }}
                    />
                  </div>
                  <span className="mt-2 text-xs sm:text-[13px] lg:text-[13.5px] font-semibold text-[#271B21] group-hover:text-[#821D38] text-center leading-tight transition-colors line-clamp-2 px-0.5">
                    {category.displayName || category.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopByCategory;
