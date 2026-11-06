import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLiveCategories } from '../services/productService';

const getCategorySlug = (cat) => {
  const s = (cat.slug || '').toLowerCase();
  const n = (cat.name || '').toLowerCase();
  if (s.includes('toy') || n.includes('toy') || s.includes('kid') || n.includes('kid')) return 'toys-and-kids';
  if (s.includes('birthday') || n.includes('birthday')) return 'birthday-gifts';
  if (s.includes('anniversary') || n.includes('anniversary')) return 'anniversary-gifts';
  if (s.includes('personalized') || n.includes('personalized')) return 'personalized-gifts';
  if (s.includes('corporate') || n.includes('corporate')) return 'corporate-gifts';
  if (s.includes('flower') || n.includes('flower') || s.includes('hamper') || n.includes('hamper')) return 'flowers-and-hampers';
  if (s.includes('festival') || n.includes('festival') || s.includes('festive')) return 'festival-gifts';
  if (s.includes('accessori') || n.includes('accessori')) return 'accessories';
  if (s.includes('gift') || n.includes('gift')) return 'gifts';
  return cat.slug || 'gifts';
};

const getDefaultFallbackImage = (slugOrName) => {
  const s = String(slugOrName || '').toLowerCase();
  if (s.includes('accessori')) return '/images/categories/accessories.png';
  if (s.includes('anniversary')) return '/images/categories/anniversary-gifts.png';
  if (s.includes('birthday')) return '/images/categories/birthday-gifts.png';
  if (s.includes('corporate')) return '/images/categories/corporate-gifts.png';
  if (s.includes('festival') || s.includes('festive')) return '/images/categories/festival-gifts.png';
  if (s.includes('flower') || s.includes('hamper')) return '/images/categories/flowers-hampers.png';
  if (s.includes('toy') || s.includes('kid')) return '/images/categories/toys-kids.png';
  if (s.includes('personalized')) return '/images/categories/personalized-gifts.png';
  return '/images/categories/gifts.png';
};

// Exactly 9 categories matching admin dropdown & reference image
const ALL_CATEGORIES = [
  { id: 'cat-accessories', name: 'Accessories', slug: 'accessories', path: '/category/accessories', image: '/images/categories/accessories.png' },
  { id: 'cat-anniversary', name: 'Anniversary Gifts', slug: 'anniversary-gifts', path: '/category/anniversary-gifts', image: '/images/categories/anniversary-gifts.png' },
  { id: 'cat-birthday', name: 'Birthday Gifts', slug: 'birthday-gifts', path: '/category/birthday-gifts', image: '/images/categories/birthday-gifts.png' },
  { id: 'cat-corporate', name: 'Corporate Gifts', slug: 'corporate-gifts', path: '/category/corporate-gifts', image: '/images/categories/corporate-gifts.png' },
  { id: 'cat-festival', name: 'Festival Gifts', slug: 'festival-gifts', path: '/category/festival-gifts', image: '/images/categories/festival-gifts.png' },
  { id: 'cat-flowers', name: 'Flowers and Hampers', slug: 'flowers-and-hampers', path: '/category/flowers-and-hampers', image: '/images/categories/flowers-hampers.png' },
  { id: 'cat-gifts', name: 'Gifts', slug: 'gifts', path: '/category/gifts', image: '/images/categories/gifts.png' },
  { id: 'cat-personalized', name: 'Personalized Gifts', slug: 'personalized-gifts', path: '/category/personalized-gifts', image: '/images/categories/personalized-gifts.png' },
  { id: 'cat-toys', name: 'Toys and Kids', slug: 'toys-and-kids', path: '/category/toys-and-kids', image: '/images/categories/toys-kids.png' }
];

export const ShopByCategory = ({ onSelectCategory }) => {
  const navigate = useNavigate();
  const [categoriesList, setCategoriesList] = useState(ALL_CATEGORIES);

  useEffect(() => {
    let isMounted = true;
    fetchLiveCategories()
      .then((live) => {
        if (isMounted && Array.isArray(live) && live.length > 0) {
          const map = new Map();
          ALL_CATEGORIES.forEach(c => map.set(c.slug, { ...c }));
          live.forEach(c => {
            if (!c || c.active === false) return;
            const slug = getCategorySlug(c);
            const existing = map.get(slug);
            map.set(slug, {
              id: c._id || c.id || slug,
              name: c.name || existing?.name || slug,
              slug,
              path: '/category/' + slug,
              image: (c.image && c.image.trim()) ? c.image.trim() : (existing?.image || getDefaultFallbackImage(slug))
            });
          });
          setCategoriesList(Array.from(map.values()));
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const handleCategoryClick = (category) => {
    if (onSelectCategory) {
      onSelectCategory(category);
    } else {
      navigate(category.path);
    }
  };

  return (
    <section className="w-full bg-[#FFF9F5] py-4 sm:py-6 relative select-none">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3.5 sm:mb-6">
          <h2 className="text-lg sm:text-2xl md:text-[26px] font-bold text-[#1E1217] tracking-tight">
            Shop by Category
          </h2>
        </div>

        {/* Mobile Horizontal Scrolling Row */}
        <div className="md:hidden w-full">
          <div
            className="flex items-start gap-3.5 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth snap-x"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {categoriesList.map((category) => (
              <div
                key={category.slug || category.id}
                onClick={() => handleCategoryClick(category)}
                className="flex flex-col items-center shrink-0 cursor-pointer group snap-start active:scale-95 transition-transform"
                style={{ width: '74px' }}
              >
                <div className="w-[62px] h-[62px] rounded-2xl bg-white border border-[#ECE7EC] shadow-2xs flex items-center justify-center p-2 group-hover:border-[#821D38]/40 group-hover:shadow-xs transition-all shrink-0">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-contain mix-blend-multiply transition-transform duration-200 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = getDefaultFallbackImage(category.slug);
                    }}
                  />
                </div>
                <span className="mt-1.5 text-[11px] font-semibold text-[#1E1217] group-hover:text-[#821D38] text-center leading-tight line-clamp-2 w-full h-[28px] flex items-start justify-center transition-colors">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden md:block w-full">
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2.5 sm:gap-3.5 lg:gap-4 xl:gap-4.5 items-start">
            {categoriesList.map((category) => (
              <div
                key={category.slug || category.id}
                onClick={() => handleCategoryClick(category)}
                className="group flex flex-col items-center cursor-pointer select-none w-full h-full justify-start text-center"
              >
                <div className="w-full h-20 sm:h-24 md:h-20 lg:h-24 max-w-[96px] mx-auto flex items-center justify-center p-1 sm:p-1.5 transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:scale-110 shrink-0">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-300 mix-blend-multiply"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = getDefaultFallbackImage(category.slug);
                    }}
                  />
                </div>
                <span className="mt-2 text-xs sm:text-[13px] lg:text-[13.5px] font-semibold text-[#271B21] group-hover:text-[#821D38] text-center leading-tight transition-colors line-clamp-2 px-0.5">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
