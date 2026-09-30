import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Search, User, Heart, ShoppingCart, ChevronDown, LogOut } from 'lucide-react';

export const Navbar = ({ onSearch }) => {
  const navigate = useNavigate();
  const { user, openAuthModal, logout } = useAuth();
  const { cartCount, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Home');
  const [openCats, setOpenCats] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const categories = [
    'Gifts', 'Personalized Gifts', 'Home & Decor', 'Toys & Kids',
    'Accessories', 'Flowers & Hampers', 'Birthday Gifts', 'Anniversary Gifts',
    'Festival Gifts', 'Corporate Gifts'
  ];

  const subnavItems = [
    { label: 'Home', path: '/' },
    { label: 'Categories', isDropdown: true },
    { label: 'Birthday Gifts', path: '/birthday-gifts' },
    { label: 'Anniversary Gifts', path: '/anniversary-gifts' },
    { label: 'Personalized Gifts', path: '/personalized-gifts' },
    { label: 'Festival Gifts', path: '/festival-gifts' },
    { label: 'Hampers', path: '/hampers' },
    { label: 'New Arrivals', path: '/new-arrivals' },
    { label: 'Offers', path: '/offers' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <header className="w-full bg-white border-b border-[#ECE7EC] sticky top-0 z-50 font-sans">
      {/* Top Main Row */}
      <div className="max-w-[1280px] mx-auto px-6 py-3.5 flex items-center justify-between gap-6">
        {/* Brand Logo matching reference */}
        <div
          onClick={() => { setActiveTab('Home'); navigate('/'); }}
          className="flex items-center gap-3 cursor-pointer select-none shrink-0"
        >
          <svg width="44" height="40" viewBox="6 6 32 29" fill="none" className="shrink-0">
            {/* Left Bow Loop */}
            <path
              d="M22 12.5C18.5 7.2 11 6.5 11 10.5C11 14 18 13.5 22 13.5"
              stroke="#821D38"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Right Bow Loop */}
            <path
              d="M22 12.5C25.5 7.2 33 6.5 33 10.5C33 14 26 13.5 22 13.5"
              stroke="#821D38"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Knot */}
            <circle cx="22" cy="13" r="2" fill="#821D38" />

            {/* Lid */}
            <rect x="7.5" y="13.5" width="29" height="6" rx="1.2" fill="#821D38" />
            <rect x="20.5" y="13.5" width="3" height="6" fill="#FFFFFF" />

            {/* Box Body */}
            <rect x="9.5" y="19.5" width="25" height="14.5" rx="1" fill="#821D38" />
            <rect x="20.5" y="19.5" width="3" height="14.5" fill="#FFFFFF" />
          </svg>
          <div className="flex flex-col justify-center">
            <span className="font-serif text-[32px] font-bold leading-none tracking-[0.04em] select-none">
              <span className="text-[#111827]">RS </span>
              <span className="text-[#821D38]">GIFTS</span>
            </span>
            <span className="text-[7.2px] font-semibold text-[#4B5563] tracking-[0.13em] uppercase mt-1 leading-none select-none">
              GIFTS FOR A BRIGHTER TOMORROW
            </span>
          </div>
        </div>

        {/* Center Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-[520px] mx-4 flex items-center h-11 border border-neutral-300 rounded-lg overflow-hidden focus-within:border-[#821D38]">
          <input
            type="text"
            placeholder="Search for gifts, personalized items, hampers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 h-full px-4 text-[13.5px] text-neutral-800 placeholder-neutral-400 outline-none bg-transparent"
          />
          <button type="submit" className="w-14 h-full bg-[#821D38] hover:bg-[#6E162E] text-white flex items-center justify-center shrink-0 transition-colors">
            <Search size={17} strokeWidth={2.2} />
          </button>
        </form>

        {/* Right Actions: Shifted left with gap on right */}
        <div className="flex items-center gap-7 mr-14 shrink-0">
          {user ? (
            <div 
              className="relative"
              onMouseEnter={() => setUserMenuOpen(true)}
              onMouseLeave={() => setUserMenuOpen(false)}
            >
              <button
                onClick={() => navigate('/account')}
                className="flex items-center gap-2 text-sm font-semibold text-neutral-800 hover:text-[#821D38] transition-colors cursor-pointer py-1"
              >
                <div className="w-7 h-7 rounded-full bg-[#FDF2F4] border border-[#821D38] flex items-center justify-center text-xs font-bold text-[#821D38]">
                  {user.firstName?.charAt(0) || 'U'}
                </div>
                <span>{user.firstName}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute top-full right-0 bg-white min-w-[220px] rounded-2xl shadow-xl border border-neutral-100 py-2 z-50 animate-in fade-in duration-150">
                  <div className="px-4 py-2 border-b border-neutral-100">
                    <p className="text-xs font-bold text-neutral-900 truncate">{user.firstName} {user.lastName}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                  </div>
                  <div className="pt-1">
                    <button
                      onClick={() => { setUserMenuOpen(false); logout(); }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => openAuthModal('login')} 
              className="flex items-center gap-2 text-sm font-medium text-neutral-800 hover:text-[#821D38] transition-colors cursor-pointer"
            >
              <User size={19} strokeWidth={1.8} />
              <span>Login / Register</span>
            </button>
          )}

          <button 
            onClick={() => navigate('/wishlist')} 
            className="flex items-center gap-2 text-sm font-medium text-neutral-800 hover:text-[#821D38] transition-colors cursor-pointer relative py-1"
          >
            <div className="relative">
              <Heart size={20} strokeWidth={1.8} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#821D38] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-2xs">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span>Wishlist</span>
          </button>

          <button 
            onClick={openCartDrawer} 
            className="flex items-center gap-2 text-sm font-medium text-neutral-800 hover:text-[#821D38] transition-colors cursor-pointer relative py-1"
          >
            <div className="relative">
              <ShoppingCart size={20} strokeWidth={1.8} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#821D38] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-2xs">
                  {cartCount}
                </span>
              )}
            </div>
            <span>Cart</span>
          </button>
        </div>
      </div>

      {/* Subnavigation Row: Centered with equal left/right gap, no middle line */}
      <nav className="bg-white pb-1">
        <ul className="flex items-center justify-center gap-8 text-[13.5px] font-medium text-neutral-800 list-none m-0 p-0">
          {subnavItems.map((item) => {
            const isActive = activeTab === item.label;
            return (
              <li
                key={item.label}
                onClick={() => {
                  if (item.isDropdown) {
                    setOpenCats(!openCats);
                  } else {
                    setActiveTab(item.label);
                    setOpenCats(false);
                    if (item.path) navigate(item.path);
                  }
                }}
                onMouseEnter={() => item.isDropdown && setOpenCats(true)}
                onMouseLeave={() => item.isDropdown && setOpenCats(false)}
                className={`relative py-2 cursor-pointer flex items-center gap-1 hover:text-[#821D38] transition-colors ${isActive ? 'font-semibold text-neutral-900 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2.5px] after:bg-[#821D38] after:rounded-t' : ''
                  }`}
              >
                <span>{item.label}</span>
                {item.isDropdown && (
                  <>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${openCats ? 'rotate-180' : ''}`} />
                    {openCats && (
                      <div className="absolute top-full left-0 bg-white min-w-[210px] rounded-lg shadow-xl border border-neutral-100 py-2 z-50">
                        {categories.map((cat) => (
                          <div
                            key={cat}
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenCats(false);
                              navigate(`/category/${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
                            }}
                            className="px-4 py-2 text-[13px] text-neutral-700 hover:bg-[#FDF2F4] hover:text-[#821D38] transition-colors"
                          >
                            {cat}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
