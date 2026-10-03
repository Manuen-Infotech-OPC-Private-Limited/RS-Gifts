import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift } from 'lucide-react';

const categories = [
  {
    id: 'birthday-gifts',
    name: 'Birthday',
    slug: 'birthday-gifts',
    image: '/images/categories/birthday-gifts.png',
    path: '/birthday-gifts'
  },
  {
    id: 'anniversary-gifts',
    name: 'Anniversary',
    slug: 'anniversary-gifts',
    image: '/images/categories/anniversary-gifts.png',
    path: '/anniversary-gifts'
  },
  {
    id: 'wedding-gifts',
    name: 'Wedding',
    slug: 'wedding-gifts',
    image: '/images/categories/gifts.png',
    path: '/category/gifts'
  },
  {
    id: 'corporate-gifts',
    name: 'Corporate',
    slug: 'corporate-gifts',
    image: '/images/categories/corporate-gifts.png',
    path: '/category/corporate-gifts'
  },
  {
    id: 'flowers-hampers',
    name: 'Flowers',
    slug: 'flowers-hampers',
    image: '/images/categories/flowers-hampers.png',
    path: '/category/flowers-hampers'
  },
  {
    id: 'toys-kids',
    name: 'Teddy',
    slug: 'toys-kids',
    image: '/images/categories/toys-kids.png',
    path: '/category/toys-kids'
  },
  {
    id: 'personalized-gifts',
    name: 'Personalized',
    slug: 'personalized-gifts',
    image: '/images/categories/personalized-gifts.png',
    path: '/personalized-gifts'
  },
  {
    id: 'home-decor',
    name: 'Home Decor',
    slug: 'home-decor',
    image: '/images/categories/home-decor.png',
    path: '/category/home-decor'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    slug: 'accessories',
    image: '/images/categories/accessories.png',
    path: '/category/accessories'
  },
  {
    id: 'festival-gifts',
    name: 'Festive',
    slug: 'festival-gifts',
    image: '/images/categories/festival-gifts.png',
    path: '/festival-gifts'
  }
];

export const ShopByCategory = ({ onSelectCategory }) => {
  const navigate = useNavigate();

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

          <button
            onClick={() => navigate ? navigate('/birthday-gifts') : null}
            className="inline-flex items-center justify-center px-3.5 py-1 rounded-full text-xs font-semibold border border-[#821D38] text-[#821D38] hover:bg-[#821D38] hover:text-white transition-all cursor-pointer shadow-2xs"
          >
            <span>View All</span>
          </button>
        </div>

        {/* Mobile Horizontal Scrolling Circular Row (Pure Scroll Without Arrows) */}
        <div className="md:hidden w-full">
          <div
            className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1 scroll-smooth w-full px-0.5"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="flex flex-col items-center shrink-0 cursor-pointer group active:scale-95 transition-transform"
                style={{ width: '60px' }}
              >
                {/* Circular Icon Avatar on Soft Pink Background */}
                <div className="w-[52px] h-[52px] rounded-full bg-[#FDF2F5] border border-[#F3E1E7] flex items-center justify-center shadow-2xs group-hover:border-[#821D38] transition-colors overflow-hidden p-2">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <span className="mt-1.5 text-[11px] font-medium text-[#271B21] group-hover:text-[#821D38] text-center truncate w-full">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Categories Grid (10 columns) */}
        <div className="hidden md:block w-full">
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2.5 sm:gap-3.5 lg:gap-4 xl:gap-4.5">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="group flex flex-col items-center cursor-pointer select-none"
              >
                <div 
                  className="w-full aspect-square rounded-[20px] overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-md bg-white border border-[#F0E8EC]"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
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
