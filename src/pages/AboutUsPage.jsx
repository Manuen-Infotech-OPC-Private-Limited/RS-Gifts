import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import rsgiftsHeroImg from '../assets/rsgifts.png';

// Crisp, standalone inline SVGs matching the design mockup icons
const DiamondIcon = () => (
  <svg className="w-6 h-6 text-[#821D38]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12l4 6-10 12L2 9l4-6z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2 9h20M7.5 9l4.5 12 4.5-12" />
  </svg>
);

const PencilIcon = () => (
  <svg className="w-6 h-6 text-[#821D38]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const QualityBadgeIcon = () => (
  <svg className="w-6 h-6 text-[#821D38]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const DeliveryTruckIcon = () => (
  <svg className="w-6 h-6 text-[#821D38]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
  </svg>
);

const GiftBoxIcon = () => (
  <svg className="w-7 h-7 text-[#821D38]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V3.5a2.5 2.5 0 115 0V8h-5zm0 0V3.5a2.5 2.5 0 10-5 0V8h5zm-8 4h16M4 8h16v13H4V8z" />
  </svg>
);

const HeartIcon = () => (
  <svg className="w-7 h-7 text-[#821D38]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const CrownIcon = () => (
  <svg className="w-7 h-7 text-[#821D38]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 18h18M3 18l2-11 5 5 4-8 4 8 5-5 2 11H3z" />
  </svg>
);

const HeadsetIcon = () => (
  <svg className="w-7 h-7 text-[#821D38]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 14h2a2 2 0 012 2v2a2 2 0 01-2 2H3a1 1 0 01-1-1v-4a1 1 0 011-1zm16 0h2a1 1 0 011 1v4a1 1 0 01-1 1h-2a2 2 0 01-2-2v-2a2 2 0 012-2zM4 14a8 8 0 1116 0" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4 ml-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

export const AboutUsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF9F5] font-sans text-neutral-800 antialiased selection:bg-[#821D38] selection:text-white">
      
      {/* 1. HERO SECTION (Full-Width Hero Image Visible Across Left & Right) */}
      <section className="relative overflow-hidden w-full border-b border-[#ECE7EC] min-h-[380px] sm:min-h-[420px] md:min-h-[460px] lg:min-h-[500px] flex items-center">
        {/* Full Hero Image spanning across the hero banner */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={rsgiftsHeroImg}
            alt="RS Gifts Signature Gift Box"
            className="w-full h-full object-cover object-[center_right] select-none"
          />

          {/* Gentle warm tint overlay on the left so the image is clearly visible on this side too, while text is perfectly legible */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-[#FFF9F5]/85 via-[#FFF9F5]/45 via-45% to-transparent max-md:bg-gradient-to-b max-md:from-[#FFF9F5]/90 max-md:via-[#FFF9F5]/50 max-md:to-transparent pointer-events-none" 
            aria-hidden="true" 
          />
        </div>

        {/* Text Content */}
        <div className="relative z-10 max-w-[1200px] w-full mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16 md:py-20">
          <div className="max-w-md sm:max-w-lg">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E1217] tracking-tight">
              About <span className="text-[#821D38] italic font-normal">RS Gifts</span>
            </h1>

            <p className="text-xs sm:text-sm lg:text-base text-neutral-800 font-medium leading-relaxed max-w-md mt-4">
              More than just gifts — we create meaningful experiences for your special moments.
            </p>
          </div>
        </div>
      </section>

      {/* 2. FOUR FEATURES STRIP */}
      <section className="border-b border-[#ECE7EC]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
            
            <div className="flex flex-col items-center justify-center p-2">
              <div className="mb-2">
                <DiamondIcon />
              </div>
              <h4 className="text-xs sm:text-sm font-semibold text-[#1E1217] leading-snug">
                Unique &amp; Thoughtful<br className="hidden sm:inline" /> Collections
              </h4>
            </div>

            <div className="flex flex-col items-center justify-center p-2">
              <div className="mb-2">
                <PencilIcon />
              </div>
              <h4 className="text-xs sm:text-sm font-semibold text-[#1E1217] leading-snug">
                Personalization<br className="hidden sm:inline" /> Options
              </h4>
            </div>

            <div className="flex flex-col items-center justify-center p-2">
              <div className="mb-2">
                <QualityBadgeIcon />
              </div>
              <h4 className="text-xs sm:text-sm font-semibold text-[#1E1217] leading-snug">
                Premium<br className="hidden sm:inline" /> Quality
              </h4>
            </div>

            <div className="flex flex-col items-center justify-center p-2">
              <div className="mb-2">
                <DeliveryTruckIcon />
              </div>
              <h4 className="text-xs sm:text-sm font-semibold text-[#1E1217] leading-snug">
                Safe &amp; Timely<br className="hidden sm:inline" /> Delivery
              </h4>
            </div>

          </div>
        </div>
      </section>

      {/* 3. OUR STORY SECTION */}
      <section className="py-12 sm:py-16 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Custom Gifts Showcase Image with organic curved backdrop */}
          <div className="md:col-span-6 flex justify-center md:justify-start">
            <div className="relative max-w-[440px] sm:max-w-[480px] w-full">
              <img
                src="/images/about/about-story-products.png"
                alt="Customized Photo Lamp, Bottle, and Wooden Keepsake"
                className="w-full h-auto object-contain select-none transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          </div>

          {/* Right Text Content */}
          <div className="md:col-span-6 space-y-3">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1217]">
              Our <span className="text-[#821D38] italic font-normal">Story</span>
            </h2>

            {/* Red Accent Line */}
            <div className="w-12 h-1 bg-[#821D38] rounded-full" />

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed pt-2">
              RS Gifts was founded with a simple idea — to make gifting more personal, memorable, and meaningful. From customized keepsakes to unique gift collections, we bring your emotions to life through thoughtfully crafted gifts.
            </p>

            <div className="pt-3">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#821D38] hover:bg-[#6E162E] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer"
              >
                <span>Shop Our Collection</span>
                <ArrowRightIcon />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4. WHY CHOOSE RS GIFTS? SECTION */}
      <section className="py-12 sm:py-16 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1E1217] text-center mb-8 sm:mb-10">
          Why Choose <span className="text-[#821D38] italic font-normal">RS Gifts?</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* Card 1: Personalized Gifts */}
          <div className="bg-white p-6 rounded-2xl border border-[#ECE7EC] text-center shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-12 h-12 mx-auto flex items-center justify-center">
              <GiftBoxIcon />
            </div>
            <h3 className="font-serif text-sm sm:text-base font-bold text-[#1E1217] mt-3 mb-1.5">
              Personalized Gifts
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Make it truly yours with custom names, photos and messages.
            </p>
          </div>

          {/* Card 2: For Every Occasion */}
          <div className="bg-white p-6 rounded-2xl border border-[#ECE7EC] text-center shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-12 h-12 mx-auto flex items-center justify-center">
              <HeartIcon />
            </div>
            <h3 className="font-serif text-sm sm:text-base font-bold text-[#1E1217] mt-3 mb-1.5">
              For Every Occasion
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Birthdays, Anniversaries, Festivals, Weddings and more.
            </p>
          </div>

          {/* Card 3: Premium Quality */}
          <div className="bg-white p-6 rounded-2xl border border-[#ECE7EC] text-center shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-12 h-12 mx-auto flex items-center justify-center">
              <CrownIcon />
            </div>
            <h3 className="font-serif text-sm sm:text-base font-bold text-[#1E1217] mt-3 mb-1.5">
              Premium Quality
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Crafted with care using high-quality materials and finishing.
            </p>
          </div>

          {/* Card 4: Trusted Support */}
          <div className="bg-white p-6 rounded-2xl border border-[#ECE7EC] text-center shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-12 h-12 mx-auto flex items-center justify-center">
              <HeadsetIcon />
            </div>
            <h3 className="font-serif text-sm sm:text-base font-bold text-[#1E1217] mt-3 mb-1.5">
              Trusted Support
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              We're always here to help you with a smile.
            </p>
          </div>

        </div>
      </section>

      {/* 5. OUR PROMISE SECTION (Matches bottom section in mockup, beautifully blending into footer) */}
      <section className="pb-12 sm:pb-16 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#ECE7EC] overflow-hidden shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left Content */}
            <div className="md:col-span-7 space-y-3">
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1E1217]">
                Our <span className="text-[#821D38] italic font-normal">Promise</span>
              </h2>

              <p className="text-xs sm:text-sm lg:text-base text-neutral-600 leading-relaxed max-w-lg pt-1">
                To deliver high-quality, personalized gifts that bring happiness to your loved ones and make every occasion special.
              </p>
            </div>

            {/* Right Image: Gift box with wooden heart tag & flowers */}
            <div className="md:col-span-5 flex justify-center md:justify-end">
              <div className="max-w-[300px] w-full rounded-2xl overflow-hidden">
                <img
                  src="/images/about/about-promise-gift.png"
                  alt="Our Promise Handcrafted Gift"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUsPage;
