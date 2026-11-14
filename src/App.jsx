import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ShopByCategory } from './components/ShopByCategory';
import { FeaturedProducts } from './components/FeaturedProducts';
import { Footer } from './components/Footer';
import { AuthModal } from './components/auth/AuthModal';
import { AccountPage } from './pages/AccountPage';
import { CartPage } from './pages/CartPage';
import { WishlistPage } from './pages/WishlistPage';
import { BirthdayGiftsPage } from './pages/BirthdayGiftsPage';
import { CategoryPage } from './pages/CategoryPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { Contactus } from './pages/Contactus';
import { AboutUsPage } from './pages/AboutUsPage';
import { OffersPage } from './pages/OffersPage';
import { CartDrawer } from './components/cart/CartDrawer';
import api from './services/api';
import { updateTabFavicon } from './utils/urlHelper';
import SEO from './components/common/SEO';
import './App.css';

// Automatically scroll to top on any route navigation
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const appRoot = document.querySelector('.app-root');
    if (appRoot) appRoot.scrollTop = 0;
  }, [pathname]);

  return null;
}

export function App() {
  const navigate = useNavigate();

  // Dynamic Browser Tab Favicon Sync
  useEffect(() => {
    try {
      const savedLogo = localStorage.getItem('rs_gifts_store_logo');
      if (savedLogo) updateTabFavicon(savedLogo);
    } catch (e) {}

    let isMounted = true;
    api.get(`/customer/content/settings?_t=${Date.now()}`)
      .then((res) => {
        if (!isMounted) return;
        const s = res?.settings || res?.data?.settings;
        if (s?.storeLogo) {
          updateTabFavicon(s.storeLogo);
          try {
            localStorage.setItem('rs_gifts_store_logo', s.storeLogo);
          } catch (e) {}
        }
      })
      .catch(() => {});

    const handleSettingsUpdate = (e) => {
      if (e?.detail?.storeLogo) {
        updateTabFavicon(e.detail.storeLogo);
      }
    };
    const handleStorage = (e) => {
      if (e.key === 'rs_gifts_store_logo' && e.newValue) {
        updateTabFavicon(e.newValue);
      }
    };

    window.addEventListener('store-settings-updated', handleSettingsUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      isMounted = false;
      window.removeEventListener('store-settings-updated', handleSettingsUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const handleSearch = (query) => {
    if (query && String(query).trim()) {
      navigate('/search?q=' + encodeURIComponent(String(query).trim()));
    }
  };

  const handleNavigate = (page) => {
    if (page) navigate(page);
  };

  const handleAddToCart = (product) => {
    console.log('Add to cart:', product);
  };

  return (
    <>
      <ScrollToTop />
      <div className="app-root flex flex-col min-h-screen bg-[#FFF9F5]">
        <Navbar onSearch={handleSearch} onNavigate={handleNavigate} />

            <main className="flex-1 bg-[#FFF9F5]">
              <Routes>
                {/* Home Storefront */}
                <Route
                  path="/"
                  element={
                    <>
                      <SEO
                        title="RS Gifts | Thoughtful, Personalized & Luxury Gifting Platform"
                        description="Discover exquisite gifts, curated hampers, personalized keepsakes, flowers, and surprise gifts for birthdays, anniversaries, and corporate celebrations at RS Gifts."
                        canonical="/"
                      />
                      <HeroSection onShopNow={handleNavigate} />
                      <ShopByCategory onSelectCategory={(cat) => handleNavigate(cat.path)} />
                      <FeaturedProducts onAddToCart={handleAddToCart} />
                    </>
                  }
                />

                {/* Birthday Gifts Page */}
                <Route path="/birthday-gifts" element={<CategoryPage />} />
                <Route path="/category/birthday-gifts" element={<CategoryPage />} />

                {/* Category Landing Pages */}
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/category/:categorySlug" element={<CategoryPage />} />
                <Route path="/toys-kids" element={<CategoryPage />} />
                <Route path="/toys-and-kids" element={<CategoryPage />} />
                <Route path="/anniversary-gifts" element={<CategoryPage />} />
                <Route path="/personalized-gifts" element={<CategoryPage />} />
                <Route path="/festival-gifts" element={<CategoryPage />} />
                <Route path="/flowers-hampers" element={<CategoryPage />} />
                <Route path="/corporate-gifts" element={<CategoryPage />} />
                <Route path="/accessories" element={<CategoryPage />} />
                <Route path="/flowers-and-hampers" element={<CategoryPage />} />
                <Route path="/gifts" element={<CategoryPage />} />

                {/* Product Details Page */}
                <Route path="/product/:idOrSlug" element={<ProductDetailsPage />} />
                <Route path="/products/:idOrSlug" element={<ProductDetailsPage />} />

                {/* Wishlist Page */}
                <Route path="/wishlist" element={<WishlistPage />} />

                {/* Cart & Gifting Options Page */}
                <Route path="/cart" element={<CartPage />} />

                {/* User Account & Order Tracking */}
                <Route path="/account" element={<AccountPage />} />
                <Route path="/track-order" element={<AccountPage />} />

                {/* Offers Page */}
                <Route path="/offers" element={<OffersPage />} />
                <Route path="/special-offers" element={<OffersPage />} />
                <Route path="/deals" element={<OffersPage />} />

                {/* About Us Page */}
                <Route path="/about" element={<AboutUsPage />} />
                <Route path="/about-us" element={<AboutUsPage />} />
                <Route path="/aboutus" element={<AboutUsPage />} />

                {/* Contact Us Page */}
                <Route path="/contact" element={<Contactus />} />
                <Route path="/contact-us" element={<Contactus />} />
                <Route path="/contactus" element={<Contactus />} />

                {/* Fallback to Home for other links */}
                <Route
                  path="*"
                  element={
                    <>
                      <HeroSection onShopNow={handleNavigate} />
                      <ShopByCategory onSelectCategory={(cat) => handleNavigate(cat.path)} />
                      <FeaturedProducts onAddToCart={handleAddToCart} />
                    </>
                  }
                />
              </Routes>
            </main>

            <Footer />
            <AuthModal />
            <CartDrawer />
      </div>
    </>
  );
}

export default App;
