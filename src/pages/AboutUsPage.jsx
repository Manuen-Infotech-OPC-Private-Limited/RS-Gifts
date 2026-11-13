import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Pixel-perfect SVG Icons matching the reference design mockup
const DiamondGemIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#821D38" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
    <path d="M2 9h20" />
    <path d="M10 3l-2 6 4 12 4-12-2-6" />
  </svg>
);

const QualityRosetteIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#821D38" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="9" r="6" />
    <path d="M9 9l2 2 4-4" />
    <path d="M8.5 14.5L7 21l5-2 5 2-1.5-6.5" />
  </svg>
);

const DeliveryVanIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#821D38" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 3h15v13H1z" />
    <path d="M16 8h4l3 3v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const GiftBoxCardIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#821D38" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    {/* Ribbon Bow on top */}
    <path d="M20 11.5c-2.5-5-7.5-6.5-10.5-4s-1.5 7 10.5 4z" />
    <path d="M20 11.5c2.5-5 7.5-6.5 10.5-4s1.5 7-10.5 4z" />
    {/* Lid */}
    <rect x="3" y="11.5" width="34" height="7.5" rx="1.5" />
    {/* Box Body */}
    <path d="M5.5 19v14.5a2.5 2.5 0 0 0 2.5 2.5h24a2.5 2.5 0 0 0 2.5-2.5V19" />
    {/* Vertical ribbon band */}
    <path d="M18.5 11.5V36" />
    <path d="M21.5 11.5V36" />
  </svg>
);

const CorporateBriefcaseIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#821D38" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    {/* Curved Arched Carry Handle */}
    <path d="M14.5 8.5V4a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v4.5" />
    {/* Briefcase Body with rounded corners */}
    <rect x="2.5" y="8.5" width="35" height="26.5" rx="4" />
    {/* Horizontal Flap Fold Line */}
    <path d="M2.5 17.5h35" />
    {/* Central Clasp / Latch hanging from the fold line */}
    <path d="M17 17.5v4.5a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5v-4.5" />
  </svg>
);

const PartyCelebrationIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#821D38" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    {/* Party Popper Cone */}
    <path d="M5.5 34.5L14 13.5c4-4 12 4 12 12L5.5 34.5z" />
    {/* Opening Oval Rim */}
    <path d="M14 13.5c-1.5 3 2.5 9.5 12 12" />
    {/* Main burst beam */}
    <path d="M23 16l8-8" />
    {/* Top-left streamer */}
    <path d="M13 8.5l2.5-4.5" />
    {/* Bottom-right streamer */}
    <path d="M30 19l4.5 2.5" />
    {/* Top-right sparkle */}
    <path d="M28.5 5.5l3.5 2.5" />
    {/* Confetti particles */}
    <circle cx="21" cy="5.5" r="1.2" fill="#821D38" stroke="none" />
    <circle cx="33.5" cy="12.5" r="1.2" fill="#821D38" stroke="none" />
    <path d="M16 3.5c1 .5 1.8 1.5 1.5 2.5" />
  </svg>
);

const RibbonBowIcon = () => (
  <svg width="44" height="40" viewBox="0 0 44 40" fill="none" stroke="#821D38" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    {/* Center Knot */}
    <rect x="20" y="10.5" width="4" height="6.5" rx="2" />
    {/* Left Butterfly Wing Loop */}
    <path d="M20 12.5C13 2.5 3.5 4.5 3.5 11s7 5.5 16.5 2.5" />
    {/* Right Butterfly Wing Loop */}
    <path d="M24 12.5C31 2.5 40.5 4.5 40.5 11s-7 5.5-16.5 2.5" />
    {/* Left Flowing Ribbon Tail */}
    <path d="M20 16c-3 6.5-8.5 13-14 17.5" />
    {/* Right Flowing Ribbon Tail */}
    <path d="M24 16c3 6.5 8.5 13 14 17.5" />
  </svg>
);

const TargetVisionIcon = () => (
  <svg width="36" height="36" viewBox="0 0 32 32" fill="none" stroke="#821D38" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    {/* Concentric Bullseye Rings */}
    <circle cx="14" cy="18" r="11" />
    <circle cx="14" cy="18" r="6.8" />
    <circle cx="14" cy="18" r="2.4" fill="#821D38" />
    {/* Arrow Shaft piercing center */}
    <path d="M14 18l12-12" />
    {/* Arrow Fletching / Feathers */}
    <path d="M22 6h4v4" />
    <path d="M19 9h4v4" />
  </svg>
);

const HandshakePromiseIcon = () => (
  <svg width="38" height="38" viewBox="0 0 32 32" fill="none" stroke="#B87D3B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    {/* Left cuff */}
    <path d="M4 17l4-5a1.5 1.5 0 0 1 2 0l3 3" />
    <path d="M3 20l3-4" />
    {/* Right cuff */}
    <path d="M28 17l-4-5a1.5 1.5 0 0 0-2 0l-3 3" />
    <path d="M29 20l-3-4" />
    {/* Interlocking hand clasp & fingers */}
    <path d="M12 14l2 2a1.5 1.5 0 0 0 2.1 0l3-3" />
    <path d="M10 16.5l2 2a1.5 1.5 0 0 0 2.1 0l2-2" />
    <path d="M8.5 19l1.8 1.8a1.5 1.5 0 0 0 2.1 0l1.6-1.6" />
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
    <div className="min-h-screen bg-[#FFFDFB] font-sans text-neutral-800 antialiased selection:bg-[#821D38] selection:text-white">

      {/* 1. HERO SECTION (Matches Reference Mockup) */}
      <section className="relative overflow-hidden w-full border-b border-[#EFE7E2] bg-[#FAF5F0]/70 py-10 sm:py-14 lg:py-16">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Left Column: Heading, Subtitle, Description, and 3 Feature Cards */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-5">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[46px] font-bold text-[#1E1217] tracking-tight leading-[1.18]">
                About <span className="text-[#821D38]">RS Gifts</span>
              </h1>

              <h2 className="font-serif text-lg sm:text-xl lg:text-[22px] font-bold text-[#1E1217] leading-snug">
                Thoughtful Gifts for Every Moment of Life
              </h2>

              <p className="text-xs sm:text-sm lg:text-[14.5px] text-[#4A3E44] leading-relaxed max-w-lg">
                RS Gifts is your one-stop destination for premium and personalized gifting. We bring together unique products, quality craftsmanship, and a personal touch to make every occasion special.
              </p>

              {/* 3 Feature Badges in a Row matching reference */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 pt-3 max-w-md">

                {/* Badge 1: Curated Collection */}
                <div className="bg-[#FAF2EE] border border-[#EFE5E0] rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center shadow-2xs hover:shadow-xs transition-shadow">
                  <div className="mb-2">
                    <DiamondGemIcon />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-[#1E1217] leading-tight">
                    Curated<br />Collection
                  </span>
                </div>

                {/* Badge 2: Quality Assured */}
                <div className="bg-[#FAF2EE] border border-[#EFE5E0] rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center shadow-2xs hover:shadow-xs transition-shadow">
                  <div className="mb-2">
                    <QualityRosetteIcon />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-[#1E1217] leading-tight">
                    Quality<br />Assured
                  </span>
                </div>

                {/* Badge 3: Reliable Delivery */}
                <div className="bg-[#FAF2EE] border border-[#EFE5E0] rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center shadow-2xs hover:shadow-xs transition-shadow">
                  <div className="mb-2">
                    <DeliveryVanIcon />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-[#1E1217] leading-tight">
                    Reliable<br />Delivery
                  </span>
                </div>

              </div>
            </div>

            {/* Right Column: Hero Gift Showcase Image matching reference */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[500px] rounded-3xl overflow-hidden shadow-xs border border-[#EFE5E0]">
                <img
                  src={`${import.meta.env.BASE_URL}images/about/about-hero-gifts.jpg`}
                  onError={(e) => {
                    if (!e.currentTarget.dataset.triedFallback) {
                      e.currentTarget.dataset.triedFallback = 'true';
                      e.currentTarget.src = `${import.meta.env.BASE_URL}images/about/about-hero-gifts.jpg.png`;
                    }
                  }}
                  alt="RS Gifts Signature Collection - Teddy, Rose Dome, Mug and Keepsakes"
                  className="w-full h-auto object-cover select-none transition-transform duration-500 hover:scale-[1.02]"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. WHAT WE OFFER SECTION */}
      <section className="py-12 sm:py-16 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Centered Decorative Section Title */}
        <div className="flex items-center justify-center gap-4 mb-10 sm:mb-12">
          <div className="h-[1px] w-12 sm:w-24 bg-[#D8CED3]" />
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#1E1217] text-center tracking-tight">
            What We Offer
          </h2>
          <div className="h-[1px] w-12 sm:w-24 bg-[#D8CED3]" />
        </div>

        {/* 4 Category Cards in a Responsive Grid matching reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

          {/* Card 1: Personal Gifts */}
          <div
            onClick={() => navigate('/category/gifts')}
            className="group bg-[#FAF2EE] hover:bg-[#F5ECE6] border border-[#EFE5E0] rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center gap-3.5 transition-all duration-300 cursor-pointer shadow-2xs hover:shadow-xs hover:-translate-y-0.5"
          >
            <div className="h-11 sm:h-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <img
                src={`${import.meta.env.BASE_URL}images/about/offer-personal-gifts.png`}
                alt="Personal Gifts"
                className="w-10 h-10 sm:w-11 sm:h-11 object-contain select-none"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.nextElementSibling) {
                    e.currentTarget.nextElementSibling.style.display = 'block';
                  }
                }}
              />
              <div style={{ display: 'none' }}>
                <GiftBoxCardIcon />
              </div>
            </div>
            <h3 className="font-bold text-base sm:text-lg text-[#1E1217] group-hover:text-[#821D38] transition-colors leading-snug">
              Personal Gifts
            </h3>
          </div>

          {/* Card 2: Corporate Gifts */}
          <div
            onClick={() => navigate('/category/corporate-gifts')}
            className="group bg-[#FAF2EE] hover:bg-[#F5ECE6] border border-[#EFE5E0] rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center gap-3.5 transition-all duration-300 cursor-pointer shadow-2xs hover:shadow-xs hover:-translate-y-0.5"
          >
            <div className="h-11 sm:h-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <img
                src={`${import.meta.env.BASE_URL}images/about/offer-corporate-gifts.png`}
                alt="Corporate Gifts"
                className="w-10 h-10 sm:w-11 sm:h-11 object-contain select-none"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.nextElementSibling) {
                    e.currentTarget.nextElementSibling.style.display = 'block';
                  }
                }}
              />
              <div style={{ display: 'none' }}>
                <CorporateBriefcaseIcon />
              </div>
            </div>
            <h3 className="font-bold text-base sm:text-lg text-[#1E1217] group-hover:text-[#821D38] transition-colors leading-snug">
              Corporate Gifts
            </h3>
          </div>

          {/* Card 3: Occasion Gifts */}
          <div
            onClick={() => navigate('/festival-gifts')}
            className="group bg-[#FAF2EE] hover:bg-[#F5ECE6] border border-[#EFE5E0] rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center gap-3.5 transition-all duration-300 cursor-pointer shadow-2xs hover:shadow-xs hover:-translate-y-0.5"
          >
            <div className="h-11 sm:h-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <img
                src={`${import.meta.env.BASE_URL}images/about/offer-occasion-gifts.png`}
                alt="Occasion Gifts"
                className="w-10 h-10 sm:w-11 sm:h-11 object-contain select-none"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.nextElementSibling) {
                    e.currentTarget.nextElementSibling.style.display = 'block';
                  }
                }}
              />
              <div style={{ display: 'none' }}>
                <PartyCelebrationIcon />
              </div>
            </div>
            <h3 className="font-bold text-base sm:text-lg text-[#1E1217] group-hover:text-[#821D38] transition-colors leading-snug">
              Occasion Gifts
            </h3>
          </div>

          {/* Card 4: Custom & Personalized Gifts */}
          <div
            onClick={() => navigate('/personalized-gifts')}
            className="group bg-[#FAF2EE] hover:bg-[#F5ECE6] border border-[#EFE5E0] rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center gap-3.5 transition-all duration-300 cursor-pointer shadow-2xs hover:shadow-xs hover:-translate-y-0.5"
          >
            <div className="h-11 sm:h-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <img
                src={`${import.meta.env.BASE_URL}images/about/offer-custom-gifts.png`}
                alt="Custom & Personalized Gifts"
                className="w-11 h-10 sm:w-12 sm:h-11 object-contain select-none"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.nextElementSibling) {
                    e.currentTarget.nextElementSibling.style.display = 'block';
                  }
                }}
              />
              <div style={{ display: 'none' }}>
                <RibbonBowIcon />
              </div>
            </div>
            <h3 className="font-bold text-base sm:text-lg text-[#1E1217] group-hover:text-[#821D38] transition-colors leading-snug">
              Custom &amp; Personalized Gifts
            </h3>
          </div>

        </div>
      </section>

      {/* 3. OUR VISION & OUR PROMISE SECTION (Matches Bottom Section in Mockup) */}
      <section className="py-8 sm:py-14 pb-14 sm:pb-20 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Hands Tying Burgundy Ribbon on Gift Box */}
          <div className="md:col-span-6 flex justify-center md:justify-start">
            <div className="relative w-full max-w-[480px] rounded-3xl overflow-hidden shadow-xs border border-[#EFE5E0]">
              <img
                src={`${import.meta.env.BASE_URL}images/about/about-crafting-hands.jpg`}
                alt="Carefully Handcrafted and Wrapped Gift Box with Burgundy Ribbon"
                className="w-full h-auto object-cover select-none transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          </div>

          {/* Right Column: Our Vision & Our Promise */}
          <div className="md:col-span-6 flex flex-col justify-center space-y-6 sm:space-y-8 pl-0 md:pl-4 lg:pl-8">

            {/* Block 1: Our Mission */}
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#FAF2EE] border border-[#EFE5E0] flex items-center justify-center shrink-0 shadow-2xs">
                <img
                  src={`${import.meta.env.BASE_URL}images/about/icon-target-vision.png`}
                  alt="Our Mission Target"
                  className="w-8 h-8 sm:w-9 sm:h-9 object-contain select-none"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextElementSibling) {
                      e.currentTarget.nextElementSibling.style.display = 'block';
                    }
                  }}
                />
                <div style={{ display: 'none' }}>
                  <TargetVisionIcon />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1217]">
                  Our Mission
                </h3>
                <p className="text-xs sm:text-sm lg:text-[14.5px] text-[#4A3E44] leading-relaxed">
                  To make gifting simple, meaningful, and memorable for everyone.
                </p>
              </div>
            </div>

            {/* Subtle Divider Line */}
            <div className="h-[1px] w-full bg-[#EFE5E0]" />

            {/* Block 2: Our Promise */}
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#FAF2EE] border border-[#EFE5E0] flex items-center justify-center shrink-0 shadow-2xs">
                <img
                  src={`${import.meta.env.BASE_URL}images/about/icon-handshake-promise.png`}
                  alt="Our Promise Handshake"
                  className="w-9 h-9 sm:w-10 sm:h-10 object-contain select-none"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextElementSibling) {
                      e.currentTarget.nextElementSibling.style.display = 'block';
                    }
                  }}
                />
                <div style={{ display: 'none' }}>
                  <HandshakePromiseIcon />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1217]">
                  Our Promise
                </h3>
                <p className="text-xs sm:text-sm lg:text-[14.5px] text-[#4A3E44] leading-relaxed">
                  Quality products, secure shopping, and a delightful gifting experience.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default AboutUsPage;
