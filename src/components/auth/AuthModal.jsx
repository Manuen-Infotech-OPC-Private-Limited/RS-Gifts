import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Lock, Mail, Phone, User, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export const AuthModal = () => {
  const { authModalOpen, authModalTab, closeAuthModal, setAuthModalTab, login, register } = useAuth();
  
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!authModalOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!emailOrPhone.trim()) {
      setError('Please enter your email or mobile number.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    login(emailOrPhone, password);
    setSuccessMsg('Logged in successfully!');
    setTimeout(() => {
      setSuccessMsg('');
      closeAuthModal();
    }, 600);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!firstName.trim() || !registerEmail.trim() || !registerPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    register({
      firstName,
      lastName,
      email: registerEmail,
      phone: registerPhone,
      password: registerPassword,
    });
    setSuccessMsg('Account created successfully!');
    setTimeout(() => {
      setSuccessMsg('');
      closeAuthModal();
    }, 600);
  };

  const handleDemoLogin = () => {
    login('abdul.rehaman@example.com', 'password123');
    setSuccessMsg('Logged in as Demo User (Abdul Rehaman)!');
    setTimeout(() => {
      setSuccessMsg('');
      closeAuthModal();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[460px] bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden font-sans"
      >
        {/* Top Header with Gift Accent */}
        <div className="bg-[#FAF6F8] px-6 pt-6 pb-4 border-b border-[#F0E6EC] relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 p-1.5 rounded-full text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/60 transition-colors cursor-pointer"
          >
            <X size={19} />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="font-serif text-[24px] font-bold tracking-tight text-[#111827]">
              RS <span className="text-[#821D38]">GIFTS</span>
            </span>
          </div>
          <p className="text-xs text-neutral-600">
            Thoughtful gifts, personalized keepsakes & memorable moments
          </p>

          {/* Tab Selector */}
          <div className="flex items-center bg-[#EFE8ED] p-1 rounded-xl mt-4">
            <button
              onClick={() => { setAuthModalTab('login'); setError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                authModalTab === 'login'
                  ? 'bg-white text-[#821D38] shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthModalTab('register'); setError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                authModalTab === 'register'
                  ? 'bg-white text-[#821D38] shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick Demo Login Pill */}
          <div className="mb-4">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2 px-3 rounded-xl bg-[#FDF2F4] hover:bg-[#FCE7EB] border border-[#F2D1D8] text-[#821D38] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles size={14} className="text-[#C9A45C]" />
              <span>One-Click Demo Login (Abdul Rehaman)</span>
            </button>
          </div>

          {authModalTab === 'login' ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Email or Mobile Number
                </label>
                <div className="relative flex items-center">
                  <Mail size={16} className="absolute left-3 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Enter email or +91 phone number"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#821D38]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-neutral-700">Password</label>
                  <a href="#forgot" className="text-[11px] text-[#821D38] hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative flex items-center">
                  <Lock size={16} className="absolute left-3 text-neutral-400" />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#821D38]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 mt-2 rounded-xl bg-[#821D38] hover:bg-[#6E162E] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>Sign In to RS Gifts</span>
                <ArrowRight size={14} />
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-[#821D38]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-[#821D38]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-[#821D38]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={registerPhone}
                  onChange={(e) => setRegisterPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-[#821D38]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Password *</label>
                <input
                  type="password"
                  placeholder="Create a strong password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-[#821D38]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 mt-2 rounded-xl bg-[#821D38] hover:bg-[#6E162E] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>Create My Account</span>
                <ArrowRight size={14} />
              </button>
            </form>
          )}

          {/* Social Logins */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="border-t border-neutral-200 w-full"></div>
            <span className="bg-white px-2.5 text-[11px] text-neutral-400 uppercase tracking-wider">or</span>
            <div className="border-t border-neutral-200 w-full"></div>
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {/* Google G logo */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
