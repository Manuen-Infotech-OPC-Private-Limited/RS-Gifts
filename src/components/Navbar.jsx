import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { fetchLiveCategories, fetchLiveProducts } from '../services/productService';
import api from '../services/api';
import { Search, User, Heart, ShoppingCart, ChevronDown, LogOut, Package, Menu, X, ChevronRight, Loader2 } from 'lucide-react';

export const Navbar = ({ onSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, openAuthModal, logout } = useAuth();
  const { cartCount, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const [query, setQuery] = useState('');
  const [liveResults, setLiveResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setLiveResults([]);
      setIsSearching(false);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const items = await fetchLiveProducts({ search: trimmed, limit: 6 });
        setLiveResults(items.slice(0, 5));
        setShowDropdown(true);
      } catch (err) {
        console.error('Navbar search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchRef.current && !searchRef.current.contains(e.target) &&
        (!mobileSearchRef.current || !mobileSearchRef.current.contains(e.target))
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const [activeTab, setActiveTab] = useState('Home');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [giftsDropdownOpen, setGiftsDropdownOpen] = useState(false);
  const [mobileGiftsOpen, setMobileGiftsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 6);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const [storeLogo, setStoreLogo] = useState(() => {
    try {
      return localStorage.getItem('rs_gifts_store_logo') || '';
    } catch (e) {
      return '';
    }
  });

  useEffect(() => {
    let isMounted = true;
    api.get('/customer/content/settings')
      .then(res => {
        if (!isMounted) return;
        const s = res?.settings || res?.data?.settings;
        if (s?.storeLogo !== undefined) {
          setStoreLogo(s.storeLogo || '');
          try {
            localStorage.setItem('rs_gifts_store_logo', s.storeLogo || '');
          } catch (e) {}
        }
      })
      .catch(() => {});

    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('rs_gifts_store_logo');
        if (saved !== null) {
          setStoreLogo(saved);
        }
      } catch (e) {}
    };

    const handleSettingsUpdate = (e) => {
      if (e?.detail?.storeLogo !== undefined) {
        setStoreLogo(e.detail.storeLogo || '');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('rs_gifts_settings_updated', handleSettingsUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('rs_gifts_settings_updated', handleSettingsUpdate);
    };
  }, []);

  const defaultGiftCategories = [
    { label: 'Accessories', path: '/category/accessories' },
    { label: 'Anniversary Gifts', path: '/category/anniversary-gifts' },
    { label: 'Birthday Gifts', path: '/category/birthday-gifts' },
    { label: 'Corporate Gifts', path: '/category/corporate-gifts' },
    { label: 'Festival Gifts', path: '/category/festival-gifts' },
    { label: 'Flowers and Hampers', path: '/category/flowers-and-hampers' },
    { label: 'Gifts', path: '/category/gifts' },
    { label: 'Personalized Gifts', path: '/category/personalized-gifts' },
    { label: 'Toys and Kids', path: '/category/toys-and-kids' }
  ];

  const [giftCategories, setGiftCategories] = useState(defaultGiftCategories);

  useEffect(() => {
    let isMounted = true;
    fetchLiveCategories()
      .then((cats) => {
        if (isMounted && Array.isArray(cats) && cats.length > 0) {
          const activeCats = cats
            .filter((c) => c && c.active !== false && !['home-decor', 'home-and-decor'].includes((c.slug || '').toLowerCase()))
            .map((c) => {
              const s = (c.slug || '').toLowerCase();
              const n = (c.name || '').toLowerCase();
              let path = `/category/${c.slug}`;
              if (s.includes('birthday') || n.includes('birthday')) path = '/birthday-gifts';
              else if (s.includes('anniversary') || n.includes('anniversary')) path = '/anniversary-gifts';
              else if (s.includes('personalized') || n.includes('personalized')) path = '/personalized-gifts';
              else if (s.includes('festival') || s.includes('festive') || n.includes('festival')) path = '/festival-gifts';
              else if (s.includes('corporate') || n.includes('corporate')) path = '/category/corporate-gifts';
              else if (s.includes('flower') || n.includes('flower') || s.includes('hamper') || n.includes('hamper')) path = '/category/flowers-hampers';
              else if (s.includes('accessori') || n.includes('accessori')) path = '/category/accessories';
              else if (s.includes('toy') || n.includes('toy') || s.includes('kid') || n.includes('kid')) path = '/category/toys-kids';
              return { label: c.name, path };
            });

          if (activeCats.length > 0) {
            const hasToys = activeCats.some(c => c.path === '/category/toys-kids' || (c.label || '').toLowerCase().includes('toy'));
            if (!hasToys) {
              activeCats.unshift({ label: 'Toys and Kids', path: '/category/toys-kids' });
            }
            setGiftCategories(activeCats);
          }
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const isGiftsActive = giftCategories.some((cat) => location.pathname === cat.path) || location.pathname.startsWith('/category/') || location.pathname.includes('-gifts');

  const handleSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setShowDropdown(false);
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    if (onSearch) onSearch(trimmed);
  };

  const handleSelectProduct = (product) => {
    setShowDropdown(false);
    setQuery('');
    navigate(`/product/${product.slug || product.id}`);
  };

  return (
    <header
      style={{ position: 'sticky', top: 0, zIndex: 40 }}
      className={`w-full bg-white border-b border-[#ECE7EC] sticky top-0 z-40 font-sans transition-shadow duration-200 ${
        isScrolled ? 'shadow-md bg-white/98 backdrop-blur-xs' : 'shadow-none'
      }`}
    >
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
          {storeLogo ? (
            <img
              src={storeLogo}
              alt="RS Gifts"
              onError={() => setStoreLogo('')}
              className="h-8 max-w-[130px] object-contain"
            />
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Right Account & Cart */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (user) {
                navigate('/account');
              } else {
                openAuthModal('login');
              }
            }}
            className="p-1 text-[#1E1217] hover:text-[#821D38] relative cursor-pointer flex items-center justify-center"
            aria-label={user ? 'My Account' : 'Login / Register'}
            title={user ? 'My Account' : 'Login / Register'}
          >
            {user?.avatar || user?.image ? (
              <img
                src={user.avatar || user.image}
                alt="Profile"
                className="w-6 h-6 rounded-full object-cover border border-[#821D38]"
              />
            ) : (
              <User size={21} strokeWidth={1.8} className="text-[#C9A45C]" />
            )}
          </button>

          <button
            onClick={openCartDrawer}
            className="p-1 text-[#1E1217] hover:text-[#821D38] relative cursor-pointer"
            aria-label="Shopping Cart"
          >
            <ShoppingCart size={21} strokeWidth={1.8} className="text-[#C9A45C]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-[#E11D48] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Row */}
      <div ref={mobileSearchRef} className="relative px-4 pb-2.5 md:hidden bg-white">
        <form
          onSubmit={handleSearch}
          className="flex items-center h-10 px-4 bg-[#FAF6F4] border border-[#E8DFE3] rounded-full focus-within:border-[#821D38] focus-within:bg-white shadow-2xs transition-all"
        >
          <input
            type="text"
            placeholder="Search for gifts, occasions..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => {
              if (query.trim().length >= 2) setShowDropdown(true);
            }}
            className="flex-1 text-xs text-[#1E1217] placeholder-[#8C7D85] bg-transparent outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setLiveResults([]);
                setShowDropdown(false);
              }}
              className="text-[#705E67] px-1 cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
          <button type="submit" className="text-[#705E67] hover:text-[#821D38] pl-2 cursor-pointer">
            {isSearching ? (
              <Loader2 size={16} className="animate-spin text-[#821D38]" />
            ) : (
              <Search size={16} strokeWidth={2} />
            )}
          </button>
        </form>

        {/* Mobile Live Dropdown */}
        {showDropdown && query.trim().length >= 2 && (
          <div className="absolute top-full left-4 right-4 mt-1 bg-white rounded-2xl shadow-2xl border border-[#ECE7EC] overflow-hidden z-50">
            {isSearching && liveResults.length === 0 ? (
              <div className="p-3 text-center text-xs text-[#705E67] flex items-center justify-center gap-2">
                <Loader2 size={14} className="animate-spin text-[#821D38]" />
                <span>Searching gifts...</span>
              </div>
            ) : liveResults.length > 0 ? (
              <div className="divide-y divide-[#F5EFF2]">
                {liveResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectProduct(item)}
                    className="px-3 py-2 flex items-center gap-2.5 active:bg-[#FAF6F4] cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-md bg-[#FAF6F4] border border-[#ECE7EC] flex items-center justify-center shrink-0 overflow-hidden p-0.5">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      ) : (
                        <Package size={16} className="text-[#A89CA2]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#1E1217] truncate">
                        {item.title || item.name}
                      </p>
                      <p className="text-[10px] text-[#705E67] truncate">
                        {item.category || 'Gifts'}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#821D38] shrink-0">
                      ₹{Number(item.price || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
                <div
                  onClick={handleSearch}
                  className="px-3 py-2.5 bg-[#FAF6F4] text-xs font-bold text-[#821D38] flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>View all results for "{query.trim()}"</span>
                  <ChevronRight size={13} />
                </div>
              </div>
            ) : (
              <div className="p-3 text-center">
                <p className="text-xs font-semibold text-[#1E1217]">No direct matches</p>
                <p className="text-[10px] text-[#705E67] mt-0.5">Press search to see recommendations</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Desktop Main Row */}
      <div className="hidden md:flex max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 items-center justify-between gap-6">
        {/* Brand Logo matching reference */}
        <div
          onClick={() => { setActiveTab('Home'); navigate('/'); }}
          className="flex items-center gap-3 cursor-pointer select-none shrink-0"
        >
          {storeLogo ? (
            <img
              src={storeLogo}
              alt="RS Gifts"
              onError={() => setStoreLogo('')}
              className="h-11 max-w-[180px] object-contain"
            />
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Center Search Bar Container */}
        <div ref={searchRef} className="relative flex-1 max-w-[520px] mx-4">
          <form onSubmit={handleSearch} className="flex items-center h-11 border border-neutral-300 rounded-lg overflow-hidden focus-within:border-[#821D38] bg-white transition-colors">
            <input
              type="text"
              placeholder="Search for gifts, personalized items, hampers..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => {
                if (query.trim().length >= 2) setShowDropdown(true);
              }}
              className="flex-1 h-full px-4 text-[13.5px] text-neutral-800 placeholder-neutral-400 outline-none bg-transparent"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setLiveResults([]);
                  setShowDropdown(false);
                }}
                className="text-neutral-400 hover:text-neutral-600 px-2 cursor-pointer"
                title="Clear"
              >
                <X size={15} />
              </button>
            )}
            <button type="submit" className="w-14 h-full bg-[#821D38] hover:bg-[#6E162E] text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer">
              {isSearching ? (
                <Loader2 size={17} className="animate-spin text-white" />
              ) : (
                <Search size={17} strokeWidth={2.2} />
              )}
            </button>
          </form>

          {/* Live Search Floating Dropdown */}
          {showDropdown && query.trim().length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-2xl border border-[#ECE7EC] overflow-hidden z-50 animate-in fade-in duration-150">
              {isSearching && liveResults.length === 0 ? (
                <div className="p-4 flex items-center justify-center gap-2 text-xs text-[#705E67]">
                  <Loader2 size={15} className="animate-spin text-[#821D38]" />
                  <span>Searching gifts in store...</span>
                </div>
              ) : liveResults.length > 0 ? (
                <div className="divide-y divide-[#F5EFF2]">
                  <div className="px-3.5 py-2 bg-[#FFF9F5] text-[11px] font-bold text-[#821D38] uppercase tracking-wider flex items-center justify-between">
                    <span>Matching Products</span>
                    <span className="text-[10px] text-[#705E67] font-normal">Press Enter to view all</span>
                  </div>
                  {liveResults.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectProduct(item)}
                      className="px-3.5 py-2.5 flex items-center gap-3 hover:bg-[#FAF6F4] transition-colors cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#FAF6F4] border border-[#ECE7EC] flex items-center justify-center shrink-0 overflow-hidden p-1">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        ) : (
                          <Package size={18} className="text-[#A89CA2]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#1E1217] truncate group-hover:text-[#821D38] transition-colors">
                          {item.title || item.name}
                        </p>
                        <p className="text-[10px] text-[#705E67] truncate">
                          {item.category || 'Gifts'}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-[#821D38] shrink-0">
                        ₹{Number(item.price || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                  <div
                    onClick={handleSearch}
                    className="px-3.5 py-2.5 bg-[#FAF6F4] hover:bg-[#F3ECEF] text-xs font-bold text-[#821D38] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>View all matching results for "{query.trim()}"</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-xs font-semibold text-[#1E1217]">No direct matches for "{query.trim()}"</p>
                  <p className="text-[11px] text-[#705E67] mt-0.5">Press Enter to explore related gifts & recommendations</p>
                </div>
              )}
            </div>
          )}
        </div>

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
                    navigate('/account');
                  }}
                  className="flex items-center gap-2 text-sm font-semibold text-neutral-800 hover:text-[#821D38] transition-colors cursor-pointer py-1"
                  title="View Account"
                >
                  {user?.avatar || user?.image ? (
                    <img
                      src={user.avatar || user.image}
                      alt="Profile"
                      className="w-7 h-7 rounded-full object-cover border border-[#821D38]"
                    />
                  ) : null}
                  <span>{user.firstName || user.name?.split(' ')[0] || 'My Account'}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute top-full right-0 bg-white min-w-[230px] rounded-2xl shadow-xl border border-neutral-100 py-2 z-50 animate-in fade-in duration-150">
                    <div className="px-4 py-2.5 border-b border-neutral-100">
                      <p className="text-xs font-semibold text-neutral-900 truncate">{user.email}</p>
                    </div>

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
              <User size={19} strokeWidth={1.8} className="text-[#C9A45C]" />
              <span>Login / Register</span>
            </button>
          )}

          <button
            onClick={() => navigate('/wishlist')}
            className="flex items-center gap-2 text-sm font-medium text-neutral-800 hover:text-[#821D38] transition-colors cursor-pointer relative py-1"
          >
            <div className="relative">
              <Heart size={20} strokeWidth={1.8} className="text-[#C9A45C]" />
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
              <ShoppingCart size={20} strokeWidth={1.8} className="text-[#C9A45C]" />
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
          {/* Home */}
          <li
            onClick={() => {
              setActiveTab('Home');
              navigate('/');
            }}
            className={`relative py-2 cursor-pointer flex items-center gap-1 hover:text-[#821D38] transition-colors ${
              location.pathname === '/'
                ? 'font-semibold text-neutral-900 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2.5px] after:bg-[#821D38] after:rounded-t'
                : ''
            }`}
          >
            <span>Home</span>
          </li>

          {/* Gifts with Dropdown on Hover or Click */}
          <li
            className="relative py-2"
            onMouseEnter={() => setGiftsDropdownOpen(true)}
            onMouseLeave={() => setGiftsDropdownOpen(false)}
          >
            <button
              type="button"
              onClick={() => setGiftsDropdownOpen((prev) => !prev)}
              className={`cursor-pointer flex items-center hover:text-[#821D38] transition-colors py-0.5 select-none ${
                isGiftsActive
                  ? 'font-semibold text-neutral-900 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2.5px] after:bg-[#821D38] after:rounded-t'
                  : ''
              }`}
            >
              <span>Gifts</span>
            </button>

            {/* Dropdown Menu */}
            {giftsDropdownOpen && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 pt-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
              >
                <div className="bg-white min-w-[210px] rounded-2xl shadow-xl border border-neutral-100 p-1.5">
                  <div className="space-y-0.5">
                    {giftCategories.map((cat) => {
                      const isCatActive = location.pathname === cat.path;
                      return (
                        <div
                          key={cat.label}
                          onClick={() => {
                            setGiftsDropdownOpen(false);
                            setActiveTab('Gifts');
                            navigate(cat.path);
                          }}
                          className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center cursor-pointer transition-colors group ${
                            isCatActive
                              ? 'bg-[#FDF2F4] text-[#821D38]'
                              : 'text-neutral-800 hover:text-[#821D38] hover:bg-[#FFF9F5]'
                          }`}
                        >
                          <span>{cat.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </li>

          {/* Offers */}
          <li
            onClick={() => {
              setActiveTab('Offers');
              navigate('/offers');
            }}
            className={`relative py-2 cursor-pointer flex items-center gap-1 hover:text-[#821D38] transition-colors ${
              location.pathname === '/offers' || location.pathname === '/special-offers'
                ? 'font-semibold text-neutral-900 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2.5px] after:bg-[#821D38] after:rounded-t'
                : ''
            }`}
          >
            <span>Offers</span>
          </li>

          {/* About Us */}
          <li
            onClick={() => {
              setActiveTab('About Us');
              navigate('/about');
            }}
            className={`relative py-2 cursor-pointer flex items-center gap-1 hover:text-[#821D38] transition-colors ${
              location.pathname === '/about' || location.pathname === '/about-us'
                ? 'font-semibold text-neutral-900 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2.5px] after:bg-[#821D38] after:rounded-t'
                : ''
            }`}
          >
            <span>About Us</span>
          </li>

          {/* Contact Us */}
          <li
            onClick={() => {
              setActiveTab('Contact Us');
              navigate('/contact');
            }}
            className={`relative py-2 cursor-pointer flex items-center gap-1 hover:text-[#821D38] transition-colors ${
              location.pathname === '/contact' || location.pathname === '/contact-us'
                ? 'font-semibold text-neutral-900 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2.5px] after:bg-[#821D38] after:rounded-t'
                : ''
            }`}
          >
            <span>Contact Us</span>
          </li>
        </ul>
      </nav>

      {/* Mobile Slide-Over Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          style={{ zIndex: 9999 }}
          className="fixed inset-0 z-[9999] md:hidden flex"
        >
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
              {/* Home */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/');
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                  location.pathname === '/'
                    ? 'bg-[#FDF2F4] text-[#821D38] font-bold'
                    : 'text-[#1E1217] hover:bg-[#FDF2F4] hover:text-[#821D38]'
                }`}
              >
                <span>Home</span>
                <ChevronRight size={14} className={location.pathname === '/' ? 'text-[#821D38]' : 'text-[#A89CA2]'} />
              </button>

              {/* Gifts Accordion */}
              <div>
                <button
                  onClick={() => setMobileGiftsOpen((prev) => !prev)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    isGiftsActive
                      ? 'bg-[#FDF2F4] text-[#821D38] font-bold'
                      : 'text-[#1E1217] hover:bg-[#FDF2F4] hover:text-[#821D38]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">Gifts</span>
                </button>

                {mobileGiftsOpen && (
                  <div className="pl-3 pr-1 py-1 space-y-1 bg-[#FAF6F4]/60 rounded-xl mt-1">
                    {giftCategories.map((cat) => {
                      const isCatActive = location.pathname === cat.path;
                      return (
                        <button
                          key={cat.label}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            navigate(cat.path);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center transition-colors cursor-pointer ${
                            isCatActive
                              ? 'text-[#821D38] font-bold bg-[#FDF2F4]'
                              : 'text-neutral-700 hover:text-[#821D38]'
                          }`}
                        >
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Offers */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/offers');
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                  location.pathname === '/offers' || location.pathname === '/special-offers'
                    ? 'bg-[#FDF2F4] text-[#821D38] font-bold'
                    : 'text-[#1E1217] hover:bg-[#FDF2F4] hover:text-[#821D38]'
                }`}
              >
                <span>Offers</span>
                <ChevronRight size={14} className={location.pathname === '/offers' ? 'text-[#821D38]' : 'text-[#A89CA2]'} />
              </button>

              {/* About Us */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/about');
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                  location.pathname === '/about' || location.pathname === '/about-us'
                    ? 'bg-[#FDF2F4] text-[#821D38] font-bold'
                    : 'text-[#1E1217] hover:bg-[#FDF2F4] hover:text-[#821D38]'
                }`}
              >
                <span>About Us</span>
                <ChevronRight size={14} className={location.pathname === '/about' ? 'text-[#821D38]' : 'text-[#A89CA2]'} />
              </button>

              {/* Contact Us */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/contact');
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                  location.pathname === '/contact' || location.pathname === '/contact-us'
                    ? 'bg-[#FDF2F4] text-[#821D38] font-bold'
                    : 'text-[#1E1217] hover:bg-[#FDF2F4] hover:text-[#821D38]'
                }`}
              >
                <span>Contact Us</span>
                <ChevronRight size={14} className={location.pathname === '/contact' ? 'text-[#821D38]' : 'text-[#A89CA2]'} />
              </button>

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
