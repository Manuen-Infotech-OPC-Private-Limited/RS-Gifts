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
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#821D38" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9" />
    <rect x="3" y="7" width="18" height="5" rx="1" />
    <path d="M12 7v15" />
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </svg>
);

const CorporateBriefcaseIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#821D38" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const PartyCelebrationIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#821D38" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 11l-8-8-5 5 8 8 5-5z" />
    <path d="M3 21l3-1 1-3" />
    <path d="M14 3l1-2" />
    <path d="M20 8l2-1" />
    <path d="M18 16l3 2" />
    <path d="M9 19l-2 3" />
    <circle cx="17.5" cy="5.5" r="0.5" fill="#821D38" />
    <circle cx="21" cy="12" r="0.5" fill="#821D38" />
  </svg>
);

const RibbonBowIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#821D38" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="2.5" />
    <path d="M9.5 12C6.5 8 2.5 7.5 2.5 11c0 3 6 2 7 2" />
    <path d="M14.5 12C17.5 8 21.5 7.5 21.5 11c0 3-6 2-7 2" />
    <path d="M10.5 14L6 22" />
    <path d="M13.5 14L18 22" />
  </svg>
);

const TargetVisionIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#821D38" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
    <path d="M12 2v3m0 14v3m10-10h-3M5 12H2" />
  </svg>
);

const HandshakePromiseIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#B87D3B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 15h2" />
    <path d="M6.8 11a3 3 0 0 0-2.8 2l-1.5 4.5A2 2 0 0 0 4.4 20h2.1a2 2 0 0 0 1.8-1.1L9 17h6l.7 1.9a2 2 0 0 0 1.8 1.1h2.1a2 2 0 0 0 1.9-2.5L20 13a3 3 0 0 0-2.8-2h-3.4a2 2 0 0 1-1.4-.6L12 9.5a2 2 0 0 0-2.8 0L8.2 10.4a2 2 0 0 1-1.4.6z" />
    <path d="M7 11V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" />
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
            <div className="transition-transform duration-300 group-hover:scale-110">
              <GiftBoxCardIcon />
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
            <div className="transition-transform duration-300 group-hover:scale-110">
              <CorporateBriefcaseIcon />
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
            <div className="transition-transform duration-300 group-hover:scale-110">
              <PartyCelebrationIcon />
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
            <div className="transition-transform duration-300 group-hover:scale-110">
              <RibbonBowIcon />
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
            
            {/* Block 1: Our Vision */}
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="shrink-0 mt-0.5">
                <TargetVisionIcon />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1217]">
                  Our Vision
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
              <div className="shrink-0 mt-0.5">
                <HandshakePromiseIcon />
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
