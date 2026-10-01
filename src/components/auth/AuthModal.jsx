import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { X, Lock, Mail, Phone, User, CheckCircle2, Sparkles } from 'lucide-react';

export const AuthModal = () => {
  const { authModalOpen, authModalTab, closeAuthModal, setAuthModalTab, login, register } = useAuth();
  const navigate = useNavigate();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [adminToken, setAdminToken] = useState(null);

  if (!authModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAdminToken(null);
    if (!emailOrPhone.trim()) {
      setError('Please enter your email or mobile number.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    const res = await login(emailOrPhone, password);
    if (!res.success) {
      setError(res.error || 'Login failed. Please check your credentials.');
      return;
    }

    if (res.user?.role === 'admin') {
      setSuccessMsg('Welcome Administrator! Redirecting to Admin Dashboard...');
      setAdminToken(res.token);
      setTimeout(() => {
        closeAuthModal();
        const token = res.token || localStorage.getItem('rs_admin_token') || localStorage.getItem('rs_gifts_token') || '';
        window.location.href = `http://localhost:3000?token=${encodeURIComponent(token)}`;
      }, 700);
    } else {
      setSuccessMsg('Logged in successfully! Redirecting to your account...');
      setTimeout(() => {
        setSuccessMsg('');
        closeAuthModal();
        navigate('/account');
      }, 600);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!firstName.trim() || !registerEmail.trim() || !registerPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    const res = await register({
      firstName,
      lastName,
      email: registerEmail,
      phone: registerPhone,
      password: registerPassword,
    });

    if (!res.success) {
      setError(res.error || 'Failed to create account.');
      return;
    }

    setSuccessMsg('Account created successfully! Redirecting to your account...');
    setTimeout(() => {
      setSuccessMsg('');
      closeAuthModal();
      navigate('/account');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[460px] bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden font-sans"
      >
        {/* Top Header with Gift Accent */}
        <div className="bg-[#FFF9F5] px-6 pt-6 pb-4 border-b border-[#ECE5DE] relative">
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
          <div className="flex items-center bg-[#F3ECE6] p-1 rounded-xl mt-4">
            <button
              onClick={() => { setAuthModalTab('login'); setError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${authModalTab === 'login'
                  ? 'bg-white text-[#821D38] shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthModalTab('register'); setError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${authModalTab === 'register'
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
                className="w-full py-2.5 mt-2 rounded-xl bg-[#821D38] hover:bg-[#6E162E] text-white text-xs font-semibold transition-colors flex items-center justify-center cursor-pointer shadow-sm"
              >
                Sign In
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
                className="w-full py-2.5 mt-2 rounded-xl bg-[#821D38] hover:bg-[#6E162E] text-white text-xs font-semibold transition-colors flex items-center justify-center cursor-pointer shadow-sm"
              >
                Create My Account
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
