import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Lightweight, standalone inline SVGs (Zero external icon dependencies)
const CheckIcon = ({ className = "w-4 h-4 text-[#821D38]" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const ArrowRightIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const ChevronDownIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const StarIcon = ({ className = "w-3 h-3 text-[#C9A45C]" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const ShieldIcon = ({ className = "w-5 h-5 text-[#821D38]" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const BoxIcon = ({ className = "w-5 h-5 text-[#821D38]" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const TruckIcon = ({ className = "w-5 h-5 text-[#821D38]" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
  </svg>
);

const ClockIcon = ({ className = "w-5 h-5 text-[#821D38]" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const HeartIcon = ({ className = "w-5 h-5 text-[#821D38]" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const GiftIcon = ({ className = "w-5 h-5 text-[#821D38]" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V3.5a2.5 2.5 0 115 0V8h-5zm0 0V3.5a2.5 2.5 0 10-5 0V8h5zm-8 4h16M4 8h16v13H4V8z" />
  </svg>
);

const SparkleIcon = ({ className = "w-5 h-5 text-[#C9A45C]" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l2.4 7.2L21.6 12l-7.2 2.4L12 21.6l-2.4-7.2L2.4 12l7.2-2.4L12 2z" />
  </svg>
);

const PhoneIcon = ({ className = "w-3.5 h-3.5 text-[#C9A45C]" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MailIcon = ({ className = "w-3.5 h-3.5 text-[#C9A45C]" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const MapPinIcon = ({ className = "w-3.5 h-3.5 text-[#C9A45C]" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const AboutUsPage = () => {
  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const appRoot = document.querySelector('.app-root');
    if (appRoot) appRoot.scrollTop = 0;
  }, []);

  // Dynamic store details
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

  // Interactive Brand Story Pillars
  const [activePillar, setActivePillar] = useState(0);

  const pillars = [
    {
      id: '01',
      tag: 'Soul & Purpose',
      title: 'Turning Every Emotion into an Unforgettable Keepsake',
      description: 'We believe that the best gifts are not just objects—they are moments frozen in time. Whether it is celebrating a milestone birthday, honoring an anniversary, or surprising a cherished friend, RS Gifts exists to bridge distances and create joyous smiles.',
      highlights: [
        'Personalized keepsakes tailored to individual love stories',
        'Heartfelt dedication to emotional significance over mass production',
        'Curated surprise experiences designed to spark instant warmth'
      ],
      quote: '“Gifts speak the profound language of gratitude when words alone fall short.”'
    },
    {
      id: '02',
      tag: 'Artisan Craftsmanship',
      title: 'Meticulous Attention to Detail & Handcrafted Quality',
      description: 'Zero shortcuts. Every single piece is carefully selected, precisely engraved, and assembled by our artisans. From optical-grade crystal clear acrylics to rich natural hardwoods, we inspect each detail before it reaches our presentation box.',
      highlights: [
        'High-precision laser engraving & photographic print clarity',
        'Multi-checkpoint quality inspection for every finished item',
        'Premium grade materials built to stand the test of time'
      ],
      quote: '“Every curve, engraving, and edge reflects the respect we hold for your occasion.”'
    },
    {
      id: '03',
      tag: 'The RS Promise',
      title: 'Milestone Punctuality & White-Glove Presentation',
      description: 'An anniversary gift arriving a day late misses the magic. That is why our dispatch operations are built around strict milestone punctuality. We encase each item in signature multi-layer protective boxing topped with rich satin ribbons.',
      highlights: [
        'Pan-India delivery network covering 19,000+ pin codes',
        'Signature satin-ribboned gift boxing ready for instant presentation',
        'Custom greeting note with personal sender messages included'
      ],
      quote: '“When you celebrate with RS Gifts, punctuality and elegance are guaranteed.”'
    }
  ];

  // Interactive FAQ Accordion
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'Can I customize any gift with my own text, names, or photos?',
      a: 'Yes! RS Gifts specializes in bespoke personalization. You can provide customized recipient names, meaningful milestone dates, heartfelt personal notes, and high-resolution photo uploads during the order process.'
    },
    {
      q: 'How do you ensure delicate items remain safe during transit?',
      a: 'Every keepsake undergoes our 4-layer shockproof packaging protocol: protective anti-scratch film, impact-absorbing cushion contours, a reinforced presentation box, and a tamper-evident outer shield to ensure flawless doorstep delivery across India.'
    },
    {
      q: 'Do you take bulk corporate orders or custom event hampers?',
      a: 'Absolutely. We curate bespoke employee welcome kits, executive holiday gifts, conference hampers, and wedding favor sets with custom branding and dedicated volume pricing. Reach out to our team directly through our contact page.'
    },
    {
      q: 'How can I track my order once it is placed?',
      a: 'As soon as your gift is handcrafted and dispatched, you will receive a tracking link via SMS/email, and you can also track real-time delivery status anytime in your RS Gifts Account dashboard under Track Order.'
    }
  ];

  const toggleFaq = (idx) => {
    setOpenFaq(prev => prev === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] font-sans text-neutral-800 antialiased selection:bg-[#821D38] selection:text-white">
      
      {/* 1. ARCHITECTURAL LUXURY HERO (No stock images, rich typography & badges) */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-[#ECE5DE] bg-gradient-to-b from-[#FFF5EE] via-[#FFF9F5] to-white overflow-hidden">
        {/* Soft atmospheric glow accents */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#FDF2F4] blur-3xl opacity-70 pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-[#FAF0E6] blur-3xl opacity-50 pointer-events-none" />

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF2F4] border border-[#821D38]/20 text-[#821D38] text-[11px] sm:text-xs font-bold uppercase tracking-widest mb-6 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#821D38] animate-pulse"></span>
            <span>RS Gifts Studio • The Art of Thoughtful Gifting</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#1E1217] tracking-tight leading-[1.18] max-w-4xl mx-auto">
            Crafting Emotion into <span className="text-[#821D38] italic font-normal">Timeless Keepsakes</span>
          </h1>

          <p className="mt-5 text-sm sm:text-base lg:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Every celebration holds a story worth treasuring. At RS Gifts, we handcraft custom keepsakes, curated surprise hampers, and memorable gifts designed to speak directly to the heart.
          </p>

          {/* Clean Metric Counters in Minimalist Floating Card */}
          <div className="mt-10 inline-grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 bg-white p-5 sm:p-6 rounded-3xl border border-[#ECE5DE] shadow-sm text-left max-w-3xl mx-auto">
            <div className="px-3 border-r border-neutral-100 last:border-0">
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#821D38]">50,000+</div>
              <div className="text-[11px] sm:text-xs text-neutral-500 font-medium mt-0.5">Smiles Delivered</div>
            </div>
            <div className="px-3 border-r border-neutral-100 last:border-0">
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#821D38]">100%</div>
              <div className="text-[11px] sm:text-xs text-neutral-500 font-medium mt-0.5">Artisan Inspected</div>
            </div>
            <div className="px-3 border-r border-neutral-100 last:border-0">
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#821D38]">19,000+</div>
              <div className="text-[11px] sm:text-xs text-neutral-500 font-medium mt-0.5">Pin Codes Covered</div>
            </div>
            <div className="px-3">
              <div className="flex items-center gap-1 font-serif text-2xl sm:text-3xl font-bold text-[#821D38]">
                <span>4.9</span>
                <div className="flex text-[#C9A45C] ml-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-3 h-3 text-[#C9A45C]" />
                  ))}
                </div>
              </div>
              <div className="text-[11px] sm:text-xs text-neutral-500 font-medium mt-0.5">Customer Rating</div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. INTERACTIVE BRAND STORY SHOWCASE (Tabs & Interactive Deep-Dives, 0 Images) */}
      <section className="py-14 sm:py-20 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#821D38] bg-[#FDF2F4] px-3 py-1 rounded-md">
            Our Core Philosophy
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1E1217] mt-3">
            Why We Do What We Do
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-2">
            Click through our pillars to explore our approach to design, handcrafting, and memorable unboxing.
          </p>
        </div>

        {/* Interactive Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 bg-[#F6EFEA] rounded-2xl border border-[#ECE5DE] gap-1 sm:gap-2">
            {pillars.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setActivePillar(idx)}
                className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activePillar === idx
                    ? 'bg-[#821D38] text-white shadow-md'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/60'
                }`}
              >
                <span className="font-mono text-[10px] opacity-75 mr-1.5">{item.id}.</span>
                {item.tag}
              </button>
            ))}
          </div>
        </div>

        {/* Active Pillar Card (Rich Editorial Typography & Geometric Accents) */}
        <div className="bg-white rounded-3xl border border-[#ECE5DE] p-6 sm:p-12 shadow-sm relative overflow-hidden transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFF9F5] rounded-bl-full pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#821D38]">
                <SparkleIcon className="w-4 h-4 text-[#C9A45C]" />
                <span className="tracking-widest uppercase">{pillars[activePillar].tag}</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E1217] leading-tight">
                {pillars[activePillar].title}
              </h3>

              <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                {pillars[activePillar].description}
              </p>

              <div className="space-y-3 pt-2">
                {pillars[activePillar].highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#FDF2F4] text-[#821D38] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckIcon className="w-3.5 h-3.5 text-[#821D38]" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-neutral-800">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Editorial Quote & Accent Box */}
            <div className="lg:col-span-5 bg-[#FFF9F5] p-6 sm:p-8 rounded-2xl border border-[#ECE5DE] relative space-y-4">
              <div className="text-[#C9A45C] font-serif text-5xl leading-none select-none opacity-40">“</div>
              <p className="font-serif italic text-base sm:text-lg text-[#1E1217] leading-snug">
                {pillars[activePillar].quote.replace(/“|”/g, '')}
              </p>
              <div className="pt-3 border-t border-[#ECE5DE] flex items-center justify-between text-xs text-neutral-500">
                <span className="font-semibold text-[#821D38]">RS Gifts Philosophy</span>
                <span>Pillar {pillars[activePillar].id}</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. THE 4-STEP CELEBRATION JOURNEY (Milestone Roadmap, 0 Images) */}
      <section className="py-14 sm:py-20 bg-[#FFF5EE] border-y border-[#ECE5DE]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#821D38] bg-white px-3 py-1 rounded-md border border-[#821D38]/15">
              How It Works
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1E1217] mt-3">
              The Journey of Your Special Gift
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2">
              From your initial idea to that magical smile on your loved one’s face.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-[#ECE5DE] shadow-2xs relative group hover:border-[#821D38]/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#FDF2F4] text-[#821D38] flex items-center justify-center mb-5 font-serif font-bold text-lg group-hover:scale-105 transition-transform">
                01
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#821D38] mb-1">
                <GiftIcon className="w-4 h-4 text-[#821D38]" />
                <span>Select &amp; Discover</span>
              </div>
              <h4 className="font-serif text-base font-bold text-[#1E1217]">Curate The Occasion</h4>
              <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                Explore our themed collections—from birthday delights and anniversaries to festival hampers and corporate gifts.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-[#ECE5DE] shadow-2xs relative group hover:border-[#821D38]/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#FDF2F4] text-[#821D38] flex items-center justify-center mb-5 font-serif font-bold text-lg group-hover:scale-105 transition-transform">
                02
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#821D38] mb-1">
                <HeartIcon className="w-4 h-4 text-[#821D38]" />
                <span>Personalize</span>
              </div>
              <h4 className="font-serif text-base font-bold text-[#1E1217]">Infuse Your Memories</h4>
              <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                Add custom recipient names, unforgettable dates, personal notes, or high-definition photos for bespoke engraving.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-[#ECE5DE] shadow-2xs relative group hover:border-[#821D38]/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#FDF2F4] text-[#821D38] flex items-center justify-center mb-5 font-serif font-bold text-lg group-hover:scale-105 transition-transform">
                03
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#821D38] mb-1">
                <BoxIcon className="w-4 h-4 text-[#821D38]" />
                <span>Handcraft &amp; Pack</span>
              </div>
              <h4 className="font-serif text-base font-bold text-[#1E1217]">Artisan Assembly</h4>
              <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                Every piece is laser-engraved, hand-finished, multi-check inspected, and cocooned in our signature satin box.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-2xl border border-[#ECE5DE] shadow-2xs relative group hover:border-[#821D38]/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#FDF2F4] text-[#821D38] flex items-center justify-center mb-5 font-serif font-bold text-lg group-hover:scale-105 transition-transform">
                04
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#821D38] mb-1">
                <TruckIcon className="w-4 h-4 text-[#821D38]" />
                <span>Deliver &amp; Smile</span>
              </div>
              <h4 className="font-serif text-base font-bold text-[#1E1217]">Punctual Surprise</h4>
              <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                Express dispatch directly to your recipient’s doorstep anywhere in India, precisely on time for the milestone.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. THE 4 BRAND GUARANTEES (Minimalist Bento Matrix) */}
      <section className="py-14 sm:py-20 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="p-6 rounded-2xl bg-white border border-[#ECE5DE] text-left shadow-2xs hover:shadow-sm transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-[#FDF2F4] text-[#821D38] flex items-center justify-center mb-4">
              <ShieldIcon />
            </div>
            <h4 className="text-sm font-bold text-[#1E1217]">100% Quality Inspected</h4>
            <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
              Every item is examined by artisans before boxing to guarantee flawless finishes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#ECE5DE] text-left shadow-2xs hover:shadow-sm transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-[#FDF2F4] text-[#821D38] flex items-center justify-center mb-4">
              <BoxIcon />
            </div>
            <h4 className="text-sm font-bold text-[#1E1217]">Signature Satin Packaging</h4>
            <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
              Multi-layer shockproof boxing wrapped with luxury ribbons and complimentary gift cards.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#ECE5DE] text-left shadow-2xs hover:shadow-sm transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-[#FDF2F4] text-[#821D38] flex items-center justify-center mb-4">
              <TruckIcon />
            </div>
            <h4 className="text-sm font-bold text-[#1E1217]">Pan-India Express Dispatch</h4>
            <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
              Doorstep delivery covering 19,000+ pin codes with live end-to-end SMS tracking.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#ECE5DE] text-left shadow-2xs hover:shadow-sm transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-[#FDF2F4] text-[#821D38] flex items-center justify-center mb-4">
              <ClockIcon />
            </div>
            <h4 className="text-sm font-bold text-[#1E1217]">Milestone Punctuality</h4>
            <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
              Scheduled dispatches calibrated to arrive right when you need the celebration to happen.
            </p>
          </div>

        </div>
      </section>

      {/* 5. INTERACTIVE FAQ ACCORDION (Clean, informative, no external images) */}
      <section className="py-12 sm:py-16 bg-[#FFFDFB] border-t border-[#ECE5DE]">
        <div className="max-w-[860px] mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#821D38] bg-[#FDF2F4] px-3 py-1 rounded-md">
              Got Questions?
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E1217] mt-3">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#ECE5DE] overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-serif text-sm sm:text-base font-semibold text-[#1E1217] hover:text-[#821D38] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <div className={`transform transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#821D38]' : 'text-neutral-400'}`}>
                      <ChevronDownIcon />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 6. FOUNDER'S PLEDGE & STUDIO CONNECT FOOTER */}
      <section className="py-14 sm:py-20 bg-gradient-to-br from-[#1E1217] via-[#2A1620] to-[#1E1217] text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-[11px] font-medium border border-white/15">
            <SparkleIcon className="w-3.5 h-3.5 text-[#C9A45C]" />
            <span>The RS Gifts Craft Studio</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold max-w-2xl mx-auto leading-tight">
            Ready to Make Someone’s Special Day Truly Unforgettable?
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto leading-relaxed">
            Discover thoughtful keepsakes crafted with affection, precision, and passion. Choose an existing design or customize a unique surprise.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-full bg-[#821D38] hover:bg-[#9B2444] text-white text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <span>Explore All Gifts</span>
              <ArrowRightIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold transition-all border border-white/20 cursor-pointer"
            >
              Contact Our Studio
            </button>
          </div>

          {/* Contact Details from Settings */}
          {(storeInfo.phone || storeInfo.email || storeInfo.location) && (
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 text-xs text-white/80">
              {storeInfo.phone && (
                <span className="bg-white/5 px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
                  <PhoneIcon />
                  <span>{storeInfo.phone}</span>
                </span>
              )}
              {storeInfo.email && (
                <span className="bg-white/5 px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
                  <MailIcon />
                  <span>{storeInfo.email}</span>
                </span>
              )}
              {storeInfo.location && (
                <span className="bg-white/5 px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
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
