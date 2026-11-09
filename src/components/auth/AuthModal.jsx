import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { X, Lock, Mail, Phone, User, CheckCircle2, Camera, Trash2, Loader2 } from 'lucide-react';

export const AuthModal = () => {
  const { authModalOpen, authModalTab, closeAuthModal, setAuthModalTab, login, register } = useAuth();
  const navigate = useNavigate();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerAddress, setRegisterAddress] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!authModalOpen) return null;

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB.');
      return;
    }

    setUploadingAvatar(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res && res.url) {
        setAvatar(res.url);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => setAvatar(reader.result);
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result);
      reader.readAsDataURL(file);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleLoginSubmit = async (e) => {
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

    const res = await login(emailOrPhone, password);
    if (!res.success) {
      setError(res.error || 'Login failed. Please check your credentials.');
      return;
    }

    setSuccessMsg('Logged in successfully! Redirecting to your account...');
    setTimeout(() => {
      setSuccessMsg('');
      closeAuthModal();
      navigate('/account');
    }, 600);
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
      avatar,
      address: registerAddress,
    });

    if (!res.success) {
      setError(res.error || 'Failed to create account.');
      return;
    }

    setSuccessMsg('Account created successfully! Welcome to RS Gifts.');
    setTimeout(() => {
      setSuccessMsg('');
      closeAuthModal();
      navigate('/account');
    }, 600);
  };

  return (
    <div
      style={{ zIndex: 9999 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[440px] max-h-[92vh] overflow-y-auto no-scrollbar scrollbar-none bg-white rounded-3xl shadow-2xl border border-neutral-100 font-sans"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Top Header with Gift Accent */}
        <div className="bg-[#FFF9F5] px-5 sm:px-6 pt-4 pb-3 border-b border-[#ECE5DE] relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-3.5 right-4 p-1.5 rounded-full text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/60 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-serif text-[21px] sm:text-[22px] font-bold tracking-tight text-[#111827]">
              RS <span className="text-[#821D38]">GIFTS</span>
            </span>
          </div>
          <p className="text-[11px] text-neutral-600">
            Thoughtful gifts, personalized keepsakes & memorable moments
          </p>

          {/* Toggle Tabs */}
          <div className="flex bg-[#EFE9E4] p-1 rounded-xl mt-2.5">
            <button
              onClick={() => { setAuthModalTab('login'); setError(''); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${authModalTab === 'login'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthModalTab('register'); setError(''); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${authModalTab === 'register'
                ? 'bg-white text-[#821D38] shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
                }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Modal Form Content */}
        <div className="p-4 sm:p-5">
          {error && (
            <div className="mb-2.5 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 animate-in fade-in">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-2.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {authModalTab === 'login' ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-0.5">
                  Email Address or Mobile Number
                </label>
                <div className="relative flex items-center">
                  <User size={15} className="absolute left-3 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Enter email or mobile"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#821D38]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-0.5">Password</label>
                <div className="relative flex items-center">
                  <Lock size={15} className="absolute left-3 text-neutral-400" />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#821D38]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 mt-1 rounded-xl bg-[#821D38] hover:bg-[#6E162E] text-white text-xs font-semibold transition-colors flex items-center justify-center cursor-pointer shadow-sm"
              >
                Sign In
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-2 sm:space-y-2.5">
              {/* Optional Profile Photo Upload */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-0.5">
                  Profile Photo <span className="text-neutral-400 font-normal">(Optional)</span>
                </label>

                {avatar ? (
                  <div className="flex items-center gap-2.5 px-3 py-1.5 bg-[#FFF9F5] border border-[#ECE5DE] rounded-xl">
                    <img
                      src={avatar}
                      alt="Profile preview"
                      className="w-8 h-8 rounded-full object-cover border-2 border-[#821D38] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-neutral-800 truncate">Photo selected</p>
                      <p className="text-[10.5px] text-neutral-500">Will be set as your account photo</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAvatar('')}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-white transition-colors cursor-pointer"
                      title="Remove photo"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 px-3 py-1.5 border border-dashed border-neutral-300 rounded-xl hover:border-[#821D38] hover:bg-[#FFF9F5]/50 transition-colors cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      disabled={uploadingAvatar}
                      className="hidden"
                    />
                    <div className="w-7 h-7 rounded-full bg-neutral-100 group-hover:bg-[#FDF2F4] flex items-center justify-center text-neutral-500 group-hover:text-[#821D38] transition-colors shrink-0">
                      <Camera size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium text-neutral-700 group-hover:text-[#821D38] transition-colors">
                        {uploadingAvatar ? 'Uploading photo...' : 'Upload your photo'}
                      </span>
                      <p className="text-[10px] text-neutral-400">JPG, PNG or WebP up to 5MB</p>
                    </div>
                  </label>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-0.5">First Name</label>
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-[#821D38]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-0.5">Last Name</label>
                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-[#821D38]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-0.5">Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-[#821D38]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-0.5">Mobile Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={registerPhone}
                  onChange={(e) => setRegisterPhone(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-[#821D38]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-0.5">
                  Address <span className="text-neutral-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Flat / house no., street, city"
                  value={registerAddress}
                  onChange={(e) => setRegisterAddress(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-[#821D38]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-0.5">Password</label>
                <input
                  type="password"
                  placeholder="Create a strong password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-[#821D38]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 mt-1.5 rounded-xl bg-[#821D38] hover:bg-[#6E162E] text-white text-xs font-semibold transition-colors flex items-center justify-center cursor-pointer shadow-sm"
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
