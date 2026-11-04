import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Minimal inline SVGs (Zero external icon dependencies)
const GiftIcon = () => (
  <svg className="w-5 h-5 text-[#821D38]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V3.5a2.5 2.5 0 115 0V8h-5zm0 0V3.5a2.5 2.5 0 10-5 0V8h5zm-8 4h16M4 8h16v13H4V8z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-5 h-5 text-[#821D38]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const TruckIcon = () => (
  <svg className="w-5 h-5 text-[#821D38]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-3.5 h-3.5 text-[#821D38]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-3.5 h-3.5 text-[#821D38]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-3.5 h-3.5 text-[#821D38]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const AboutUsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const [storeInfo, setStoreInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('rs_gifts_contact_info');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          phone: parsed.phone || parsed.contactPhone || '',
          email: parsed.email || parsed.contactEmail || '',
          location: parsed.location || parsed.storeAddress || '',
        };
      }
    } catch { }
    return { phone: '', email: '', location: '' };
  });

  useEffect(() => {
    api.get('/customer/content/settings')
      .then(res => {
        const s = res?.data?.settings || res?.settings;
        if (s) {
          setStoreInfo({
            phone: s.contactPhone || '',
            email: s.contactEmail || s.supportEmail || '',
            location: s.storeAddress || '',
          });
        }
      })
      .catch(() => { });
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF9F5] font-sans text-neutral-800 antialiased selection:bg-[#821D38] selection:text-white">
      
      {/* 1. Clean, Minimal Hero (Few elements, concise lines) */}
      <section className="pt-10 pb-12 sm:pt-16 sm:pb-16 text-center max-w-4xl mx-auto px-4 sm:px-6">
        <span className="text-xs font-bold uppercase tracking-wider text-[#821D38] bg-[#FDF2F4] px-3.5 py-1 rounded-full border border-[#821D38]/15">
          About RS Gifts
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E1217] mt-4 tracking-tight">
          Thoughtful Gifts for Life’s <span className="text-[#821D38]">Special Moments</span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          At RS Gifts, we handcraft personalized keepsakes, custom photo creations, and curated hampers to help you celebrate birthdays, anniversaries, and milestones with genuine warmth.
        </p>

        {/* 4 Minimal Metric Badges */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-center">
          <div className="bg-white p-3.5 rounded-xl border border-[#ECE5DE]">
            <div className="font-serif text-lg sm:text-xl font-bold text-[#821D38]">50,000+</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">Delivered</div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-[#ECE5DE]">
            <div className="font-serif text-lg sm:text-xl font-bold text-[#821D38]">100%</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">Handcrafted</div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-[#ECE5DE]">
            <div className="font-serif text-lg sm:text-xl font-bold text-[#821D38]">19,000+</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">Pin Codes</div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-[#ECE5DE]">
            <div className="font-serif text-lg sm:text-xl font-bold text-[#821D38]">4.9 ★</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">Rating</div>
          </div>
        </div>
      </section>

      {/* 2. Three Core Pillars (Clean 3-card grid without tabs) */}
      <section className="pb-14 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-[#ECE5DE] text-left">
            <div className="w-10 h-10 rounded-xl bg-[#FDF2F4] flex items-center justify-center mb-3">
              <GiftIcon />
            </div>
            <h3 className="font-serif text-base font-bold text-[#1E1217]">Bespoke Personalization</h3>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              Every bond is unique. We personalize frames, acrylics, and hampers with your custom names, dates, and messages.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#ECE5DE] text-left">
            <div className="w-10 h-10 rounded-xl bg-[#FDF2F4] flex items-center justify-center mb-3">
              <ShieldIcon />
            </div>
            <h3 className="font-serif text-base font-bold text-[#1E1217]">Artisan Inspected</h3>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              Zero compromises on finish. Each item undergoes strict quality inspection and arrives packed in signature satin boxing.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#ECE5DE] text-left">
            <div className="w-10 h-10 rounded-xl bg-[#FDF2F4] flex items-center justify-center mb-3">
              <TruckIcon />
            </div>
            <h3 className="font-serif text-base font-bold text-[#1E1217]">Milestone Delivery</h3>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              Scheduled express delivery nationwide to make sure your surprises arrive punctually on their special day.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Section Above Footer (Harmonious soft rose/ivory color, perfectly matching the footer) */}
      <section className="py-10 bg-[#FFF5F6] border-t border-[#F3D7DE] text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1217]">
            Make Someone's Day Special
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1.5 leading-relaxed">
            Browse our curated collections or connect directly with our studio for custom requests.
          </p>

          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2.5 rounded-xl bg-[#821D38] hover:bg-[#6E162E] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <span>Explore Gifts</span>
              <ArrowRightIcon />
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-50 text-[#821D38] text-xs font-semibold border border-[#821D38]/25 transition-colors cursor-pointer"
            >
              Contact Us
            </button>
          </div>

          {/* Contact Details from Admin Settings */}
          {(storeInfo.phone || storeInfo.email || storeInfo.location) && (
            <div className="mt-6 pt-5 border-t border-[#F3D7DE] flex flex-wrap items-center justify-center gap-3 text-xs text-neutral-700">
              {storeInfo.phone && (
                <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-[#F3D7DE]">
                  <PhoneIcon />
                  <span>{storeInfo.phone}</span>
                </span>
              )}
              {storeInfo.email && (
                <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-[#F3D7DE]">
                  <MailIcon />
                  <span>{storeInfo.email}</span>
                </span>
              )}
              {storeInfo.location && (
                <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-[#F3D7DE]">
                  <MapPinIcon />
                  <span>{storeInfo.location}</span>
                </span>
              )}
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default AboutUsPage;
