import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Search, User, Heart, ShoppingCart, ChevronDown, LogOut, Package, Menu, X, ChevronRight } from 'lucide-react';

export const Navbar = ({ onSearch }) => {
  const navigate = useNavigate();
  const { user, openAuthModal, logout } = useAuth();
  const { cartCount, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Home');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const subnavItems = [
    { label: 'Home', path: '/' },
    { label: 'Birthday Gifts', path: '/birthday-gifts' },
    { label: 'Anniversary Gifts', path: '/anniversary-gifts' },
    { label: 'Personalized Gifts', path: '/personalized-gifts' },
    { label: 'Festival Gifts', path: '/festival-gifts' },
    { label: 'Hampers', path: '/hampers' },
    { label: 'New Arrivals', path: '/new-arrivals' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <header className="w-full bg-white border-b border-[#ECE7EC] sticky top-0 z-50 font-sans">
      {/* Mobile Top Row: Hamburger | Centered Logo | Wishlist & Cart */}
      <div className="flex md:hidden items-center justify-between px-4 py-2.5 bg-white">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-1 -ml-1 text-[#1E1217] hover:text-[#821D38] cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <Menu size={23} />
        </button>

        {/* Centered Brand Logo */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 cursor-pointer select-none"
        >
          <svg width="26" height="26" viewBox="6 6 32 29" fill="none" className="shrink-0">
            <path
              d="M22 12.5C18.5 7.2 11 6.5 11 10.5C11 14 18 13.5 22 13.5"
              stroke="#821D38"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 12.5C25.5 7.2 33 6.5 33 10.5C33 14 26 13.5 22 13.5"
              stroke="#821D38"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="22" cy="13" r="2" fill="#821D38" />
            <rect x="7.5" y="13.5" width="29" height="6" rx="1.2" fill="#821D38" />
            <rect x="20.5" y="13.5" width="3" height="6" fill="#FFFFFF" />
            <rect x="9.5" y="19.5" width="25" height="14.5" rx="1" fill="#821D38" />
            <rect x="20.5" y="19.5" width="3" height="14.5" fill="#FFFFFF" />
          </svg>
          <span 
            className="text-[22px] font-bold tracking-tight text-[#821D38]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            <span className="text-[#1E1217]">RS </span>
            <span className="italic text-[#821D38]">Gifts</span>
          </span>
        </div>

        {/* Right Account & Cart */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (user) {
                if (user.role === 'admin') {
                  const token = localStorage.getItem('rs_admin_token') || localStorage.getItem('rs_gifts_token') || '';
                  window.location.href = `http://localhost:3000?token=${encodeURIComponent(token)}`;
                } else {
                  navigate('/account');
                }
              } else {
                openAuthModal('login');
              }
            }}
            className="p-1 text-[#1E1217] hover:text-[#821D38] relative cursor-pointer flex items-center justify-center"
            aria-label={user ? 'My Account' : 'Login / Register'}
            title={user ? (user.role === 'admin' ? 'Admin Portal' : 'My Account') : 'Login / Register'}
          >
            {user ? (
              <div className="w-6 h-6 rounded-full bg-[#FDF2F4] border border-[#821D38] flex items-center justify-center text-[10.5px] font-bold text-[#821D38]">
                {user.role === 'admin' ? 'RS' : (user.firstName?.charAt(0) || user.name?.charAt(0) || 'U')}
              </div>
            ) : (
              <User size={21} strokeWidth={1.8} />
            )}
          </button>

          <button
            onClick={openCartDrawer}
            className="p-1 text-[#1E1217] hover:text-[#821D38] relative cursor-pointer"
            aria-label="Shopping Cart"
          >
            <ShoppingCart size={21} strokeWidth={1.8} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-[#E11D48] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Row (Matching Reference Screenshot) */}
      <div className="px-4 pb-2.5 md:hidden bg-white">
        <form
          onSubmit={handleSearch}
          className="flex items-center h-10 px-4 bg-[#FAF6F4] border border-[#E8DFE3] rounded-full focus-within:border-[#821D38] focus-within:bg-white shadow-2xs transition-all"
        >
          <input
            type="text"
            placeholder="Search for gifts, occasions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-xs text-[#1E1217] placeholder-[#8C7D85] bg-transparent outline-none"
          />
          <button type="submit" className="text-[#705E67] hover:text-[#821D38] pl-2 cursor-pointer">
            <Search size={16} strokeWidth={2} />
          </button>
        </form>
      </div>

      {/* Desktop Main Row */}
      <div className="hidden md:flex max-w-[1280px] mx-auto px-6 py-3.5 items-center justify-between gap-6">
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
            <div className="flex items-center gap-3">
              <div 
                className="relative"
                onMouseEnter={() => setUserMenuOpen(true)}
                onMouseLeave={() => setUserMenuOpen(false)}
              >
                <button
                  onClick={() => {
                    if (user.role === 'admin') {
                      const token = localStorage.getItem('rs_admin_token') || localStorage.getItem('rs_gifts_token') || '';
                      window.location.href = `http://localhost:3000?token=${encodeURIComponent(token)}`;
                    } else {
                      navigate('/account');
                    }
                  }}
                  className="flex items-center gap-2 text-sm font-semibold text-neutral-800 hover:text-[#821D38] transition-colors cursor-pointer py-1"
                  title={user.role === 'admin' ? 'Go to Admin Dashboard' : 'View Account'}
                >
                  <div className="w-7 h-7 rounded-full bg-[#FDF2F4] border border-[#821D38] flex items-center justify-center text-xs font-bold text-[#821D38]">
                    {user.role === 'admin' ? 'RS' : (user.firstName?.charAt(0) || 'U')}
                  </div>
                  <span>{user.role === 'admin' ? 'RS Gifts' : user.firstName}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute top-full right-0 bg-white min-w-[230px] rounded-2xl shadow-xl border border-neutral-100 py-2 z-50 animate-in fade-in duration-150">
                    <div className="px-4 py-2.5 border-b border-neutral-100">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-neutral-900 truncate">
                          {user.role === 'admin' ? 'RS Gifts' : (user.name || `${user.firstName || ''} ${user.lastName || ''}`).replace(/Super Admin|Admin/gi, '').trim() || 'RS Gifts'}
                        </p>
                        {user.role === 'admin' ? (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#821D38] text-white font-bold uppercase tracking-wider shrink-0">Admin</span>
                        ) : (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase tracking-wider shrink-0">Customer</span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-500 truncate mt-0.5">{user.email}</p>
                    </div>

                    {user.role !== 'admin' && (
                      <div className="py-1 border-b border-neutral-100 text-xs">
                        <button
                          onClick={() => { setUserMenuOpen(false); navigate('/account'); }}
                          className="w-full text-left px-4 py-2 text-neutral-700 hover:bg-[#FDF2F4] hover:text-[#821D38] font-medium flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          <User size={13} />
                          <span>My Account Profile</span>
                        </button>
                        <button
                          onClick={() => { setUserMenuOpen(false); navigate('/account?tab=orders'); }}
                          className="w-full text-left px-4 py-2 text-neutral-700 hover:bg-[#FDF2F4] hover:text-[#821D38] font-medium flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          <Package size={13} />
                          <span>My Orders & Tracking</span>
                        </button>
                      </div>
                    )}

                    <div className="pt-1">
                      <button
                        onClick={() => { setUserMenuOpen(false); logout(); }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
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

      {/* Subnavigation Row: Centered with equal left/right gap, hidden on mobile */}
      <nav className="hidden md:block bg-white pb-1">
        <ul className="flex items-center justify-center gap-8 text-[13.5px] font-medium text-neutral-800 list-none m-0 p-0">
          {subnavItems.map((item) => {
            const isActive = activeTab === item.label;
            return (
              <li
                key={item.label}
                onClick={() => {
                  setActiveTab(item.label);
                  if (item.path) navigate(item.path);
                }}
                className={`relative py-2 cursor-pointer flex items-center gap-1 hover:text-[#821D38] transition-colors ${
                  isActive ? 'font-semibold text-neutral-900 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2.5px] after:bg-[#821D38] after:rounded-t' : ''
                }`}
              >
                <span>{item.label}</span>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile Slide-Over Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-hidden animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="p-4 border-b border-[#ECE7EC] flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <span 
                  className="font-serif text-xl font-bold text-[#821D38]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  <span className="text-[#1E1217]">RS </span>
                  <span className="italic">Gifts</span>
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#705E67] hover:text-[#1E1217] hover:bg-neutral-100 cursor-pointer"
              >
                <X size={19} />
              </button>
            </div>

            {/* Links List - matches normal navbar */}
            <div className="p-3 space-y-1 overflow-y-auto flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8C7D85] px-3 py-1.5">
                Navigation
              </p>
              {subnavItems.map((item) => {
                const isActive = activeTab === item.label;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setActiveTab(item.label);
                      if (item.path) navigate(item.path);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#FDF2F4] text-[#821D38] font-bold'
                        : 'text-[#1E1217] hover:bg-[#FDF2F4] hover:text-[#821D38]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight size={14} className={isActive ? 'text-[#821D38]' : 'text-[#A89CA2]'} />
                  </button>
                );
              })}

              <div className="pt-2 border-t border-[#ECE7EC] mt-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#8C7D85] px-3 py-1.5">
                  Quick Links
                </p>
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/wishlist'); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#1E1217] hover:bg-[#FDF2F4] hover:text-[#821D38] flex items-center gap-2"
                >
                  <Heart size={14} className="text-[#821D38]" />
                  <span>My Wishlist ({wishlistCount})</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/account'); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#1E1217] hover:bg-[#FDF2F4] hover:text-[#821D38] flex items-center gap-2"
                >
                  <User size={14} className="text-[#821D38]" />
                  <span>My Account</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/account?tab=orders'); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#1E1217] hover:bg-[#FDF2F4] hover:text-[#821D38] flex items-center gap-2"
                >
                  <Package size={14} className="text-[#821D38]" />
                  <span>Track Orders</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#ECE7EC] bg-[#FAF6F4]">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="truncate pr-2">
                    <p className="text-xs font-bold text-[#1E1217] truncate">{user.name || user.firstName}</p>
                    <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => { setMobileMenuOpen(false); logout(); }}
                    className="text-xs text-rose-600 font-bold shrink-0 hover:underline cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setMobileMenuOpen(false); openAuthModal('login'); }}
                  className="w-full py-2.5 rounded-xl bg-[#821D38] text-white text-xs font-bold text-center cursor-pointer shadow-xs"
                >
                  Login / Register
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
