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
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { Contactus } from './pages/Contactus';
import { AboutUsPage } from './pages/AboutUsPage';
import { CartDrawer } from './components/cart/CartDrawer';
import { BottomNav } from './components/BottomNav';
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

  const handleSearch = (query) => {
    console.log('Search:', query);
  };

  const handleNavigate = (page) => {
    if (page) navigate(page);
  };

  const handleAddToCart = (product) => {
    console.log('Add to cart:', product);
  };

  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <ScrollToTop />
          <div className="app-root flex flex-col min-h-screen bg-[#FFF9F5]">
            <Navbar onSearch={handleSearch} onNavigate={handleNavigate} />

            <main className="flex-1 bg-[#FFF9F5] pb-16 md:pb-0">
              <Routes>
                {/* Home Storefront */}
                <Route
                  path="/"
                  element={
                    <>
                      <HeroSection onShopNow={handleNavigate} />
                      <ShopByCategory onSelectCategory={(cat) => handleNavigate(cat.path)} />
                      <FeaturedProducts onAddToCart={handleAddToCart} />
                    </>
                  }
                />

                {/* Birthday Gifts Page */}
                <Route path="/birthday-gifts" element={<BirthdayGiftsPage />} />
                <Route path="/category/birthday-gifts" element={<BirthdayGiftsPage />} />

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
            <BottomNav />
          </div>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
