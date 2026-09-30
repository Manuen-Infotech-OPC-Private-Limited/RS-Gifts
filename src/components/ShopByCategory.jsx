import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    id: 'gifts',
    name: 'Gifts',
    slug: 'gifts',
    image: '/images/categories/gifts.png',
    path: '/category/gifts'
  },
  {
    id: 'personalized-gifts',
    name: 'Personalized Gifts',
    slug: 'personalized-gifts',
    image: '/images/categories/personalized-gifts.png',
    path: '/personalized-gifts'
  },
  {
    id: 'home-decor',
    name: 'Home & Decor',
    slug: 'home-decor',
    image: '/images/categories/home-decor.png',
    path: '/category/home-decor'
  },
  {
    id: 'toys-kids',
    name: 'Toys & Kids',
    slug: 'toys-kids',
    image: '/images/categories/toys-kids.png',
    path: '/category/toys-kids'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    slug: 'accessories',
    image: '/images/categories/accessories.png',
    path: '/category/accessories'
  },
  {
    id: 'flowers-hampers',
    name: 'Flowers & Hampers',
    slug: 'flowers-hampers',
    image: '/images/categories/flowers-hampers.png',
    path: '/category/flowers-hampers'
  },
  {
    id: 'birthday-gifts',
    name: 'Birthday Gifts',
    slug: 'birthday-gifts',
    image: '/images/categories/birthday-gifts.png',
    path: '/birthday-gifts'
  },
  {
    id: 'anniversary-gifts',
    name: 'Anniversary Gifts',
    slug: 'anniversary-gifts',
    image: '/images/categories/anniversary-gifts.png',
    path: '/anniversary-gifts'
  },
  {
    id: 'festival-gifts',
    name: 'Festival Gifts',
    slug: 'festival-gifts',
    image: '/images/categories/festival-gifts.png',
    path: '/festival-gifts'
  },
  {
    id: 'corporate-gifts',
    name: 'Corporate Gifts',
    slug: 'corporate-gifts',
    image: '/images/categories/corporate-gifts.png',
    path: '/category/corporate-gifts'
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
    <section className="w-full bg-[#FFFFFF] py-5 sm:py-6 border-b border-[#F2EAEF] relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-[26px] font-bold text-[#1E1217] tracking-tight">
            Shop by Category
          </h2>

          <button
            onClick={() => navigate ? navigate('/categories') : null}
            className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-[#821D38] hover:bg-[#FDF2F4] transition-all cursor-pointer"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Categories Grid: All 10 categories fit evenly without cutting off */}
        <div className="w-full">
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2.5 sm:gap-3.5 lg:gap-4 xl:gap-4.5">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="group flex flex-col items-center cursor-pointer select-none"
              >
                {/* Single-Background Rounded Card */}
                <div 
                  className="w-full aspect-square rounded-[20px] overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-md"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Category Label */}
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
