import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount, openCartDrawer } = useCart();
  const { user, openAuthModal } = useAuth();

  const currentPath = location.pathname;

  const isHome = currentPath === '/';
  const isCart = currentPath === '/cart';
  const isAccount = currentPath === '/account';

  const handleAccountClick = () => {
    if (user) {
      navigate('/account');
    } else {
      openAuthModal('login');
    }
  };

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#ECE7EC] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home Tab */}
        <button
          onClick={() => {
            navigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            isHome ? 'text-[#821D38] font-bold' : 'text-[#705E67] hover:text-[#1E1217]'
          }`}
        >
          <Home className={`w-5 h-5 transition-transform ${isHome ? 'stroke-[2.5] scale-105' : 'stroke-[1.8]'}`} />
          <span className="text-[11px] mt-0.5 tracking-tight">Home</span>
        </button>

        {/* Cart Tab */}
        <button
          onClick={openCartDrawer}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer relative ${
            isCart ? 'text-[#821D38] font-bold' : 'text-[#705E67] hover:text-[#1E1217]'
          }`}
        >
          <div className="relative">
            <ShoppingCart className={`w-5 h-5 transition-transform ${isCart ? 'stroke-[2.5] scale-105' : 'stroke-[1.8]'}`} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#E11D48] text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight">Cart</span>
        </button>

        {/* Account Tab */}
        <button
          onClick={handleAccountClick}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            isAccount ? 'text-[#821D38] font-bold' : 'text-[#705E67] hover:text-[#1E1217]'
          }`}
        >
          <User className={`w-5 h-5 transition-transform ${isAccount ? 'stroke-[2.5] scale-105' : 'stroke-[1.8]'}`} />
          <span className="text-[11px] mt-0.5 tracking-tight">
            {user ? (user.firstName || 'Account') : 'Account'}
          </span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
