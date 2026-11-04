import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Gift,
  Heart,
  Sparkles,
  ShieldCheck,
  Truck,
  ArrowRight,
  Package,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Star,
  Clock,
  ChevronRight
} from 'lucide-react';
import api from '../services/api';

export const AboutUsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const appRoot = document.querySelector('.app-root');
    if (appRoot) appRoot.scrollTop = 0;
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
    return {
      phone: '',
      email: '',
      location: '',
    };
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
      {/* 1. New Modern Minimalist Hero (Visual-Centric, Low Text) */}
      <section className="relative pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-[#ECE5DE] bg-gradient-to-b from-[#FFF5EE] via-[#FFF9F5] to-white overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#FDF2F4] blur-3xl opacity-60 pointer-events-none" />

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF2F4] border border-[#821D38]/15 text-[#821D38] text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles size={13} className="text-[#821D38]" />
            <span>RS Gifts Studio • Thoughtful Celebrations</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#1E1217] tracking-tight leading-[1.15]">
            Where Every Gift <span className="text-[#821D38] italic font-normal">Tells A Story</span>
          </h1>

          <p className="mt-4 text-xs sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            We turn your heartfelt emotions into tangible keepsakes. Handcrafted photo frames, luxury hampers, and curated surprises designed for life’s most precious celebrations.
          </p>

          {/* Quick Metrics Bar in Modern Pill Design */}
          <div className="mt-7 inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 bg-white px-6 py-3 rounded-2xl border border-neutral-200/80 shadow-xs text-xs font-semibold text-neutral-800">
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-base sm:text-lg font-bold text-[#821D38]">50,000+</span>
              <span className="text-neutral-500 font-normal">Gifts Delivered</span>
            </div>
            <span className="text-neutral-300 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-base sm:text-lg font-bold text-[#821D38]">100%</span>
              <span className="text-neutral-500 font-normal">Handcrafted</span>
            </div>
            <span className="text-neutral-300 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <div className="flex text-[#C9A45C]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={11} className="fill-[#C9A45C]" />
                ))}
              </div>
              <span className="font-serif text-base sm:text-lg font-bold text-[#821D38]">4.9 / 5</span>
              <span className="text-neutral-500 font-normal">Customer Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Alternating Zigzag Product Showcases (Visual Dominant, Crisp Points) */}
      <section className="py-12 sm:py-16 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-14 sm:space-y-20">
        
        {/* ROW 1: Left Image ➔ Right Content (Personalized Keepsakes) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center bg-white p-6 sm:p-10 rounded-3xl border border-[#ECE5DE] shadow-xs">
          {/* Left Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/11] bg-[#FFF9F5] shadow-md group">
              <img
                src="/images/products/personalized-frame.jpg"
                alt="Personalized Photo Keepsakes"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/categories/personalized-gifts.png';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-neutral-200 text-[11px] font-bold text-[#821D38] flex items-center gap-1 shadow-xs">
                <Sparkles size={12} />
                <span>Custom Engraved</span>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#821D38] bg-[#FDF2F4] px-2.5 py-1 rounded-md">
              01 • Personalized Keepsakes
            </span>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E1217] leading-snug">
              Immortalize Cherished Memories in Wood &amp; Crystal
            </h2>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Every bond has special moments. Our artisans hand-craft personalized wooden frames, glowing LED plaques, and engraved plaques with photographic clarity.
            </p>

            {/* Crisp Feature Bullets */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-neutral-800">
                <CheckCircle2 size={16} className="text-[#821D38] shrink-0" />
                <span>High-Definition Laser &amp; UV Photo Engraving</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-neutral-800">
                <CheckCircle2 size={16} className="text-[#821D38] shrink-0" />
                <span>Custom Names, Meaningful Dates &amp; Personal Notes</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-neutral-800">
                <CheckCircle2 size={16} className="text-[#821D38] shrink-0" />
                <span>Solid Natural Hardwood &amp; Optical-Grade Acrylic</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('/personalized-gifts')}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#821D38] hover:text-[#6E162E] group cursor-pointer"
              >
                <span>Browse Personalized Gifts</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* ROW 2: Right Image ➔ Left Content (Luxury Hampers & Blooms) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center bg-white p-6 sm:p-10 rounded-3xl border border-[#ECE5DE] shadow-xs">
          {/* Left Content on Large Screens (ordered 2 on mobile) */}
          <div className="lg:col-span-6 space-y-4 order-2 lg:order-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#821D38] bg-[#FDF2F4] px-2.5 py-1 rounded-md">
              02 • Luxury Hampers &amp; Flowers
            </span>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E1217] leading-snug">
              Curated Gift Boxes Packed with Unboxing Joy
            </h2>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Nothing matches the delight of untying a satin ribbon to reveal handpicked gourmet delights, fragrant blossoms, and personalized tokens.
            </p>

            {/* Crisp Feature Bullets */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-neutral-800">
                <CheckCircle2 size={16} className="text-[#821D38] shrink-0" />
                <span>Farm-Fresh Hand-Tied Exotic Floral Bouquets</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-neutral-800">
                <CheckCircle2 size={16} className="text-[#821D38] shrink-0" />
                <span>Artisanal Chocolates, Dry Fruits &amp; Gourmet Treats</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-neutral-800">
                <CheckCircle2 size={16} className="text-[#821D38] shrink-0" />
                <span>Complimentary Signature Gift Box &amp; Custom Greeting Card</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('/category/flowers-hampers')}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#821D38] hover:text-[#6E162E] group cursor-pointer"
              >
                <span>Explore Luxury Hampers</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Image on Large Screens (ordered 1 on mobile) */}
          <div className="lg:col-span-6 relative order-1 lg:order-2">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/11] bg-[#FFF9F5] shadow-md group">
              <img
                src="/images/products/luxury-hamper.jpg"
                alt="Luxury Curated Gift Hampers"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/categories/flowers-hampers.png';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-neutral-200 text-[11px] font-bold text-[#821D38] flex items-center gap-1 shadow-xs">
                <Package size={12} />
                <span>Signature Hamper</span>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 3: Left Image ➔ Right Content (Anniversary & Romantic Keepsakes) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center bg-white p-6 sm:p-10 rounded-3xl border border-[#ECE5DE] shadow-xs">
          {/* Left Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/11] bg-[#FFF9F5] shadow-md group">
              <img
                src="/images/products/golden-rose.jpg"
                alt="24K Golden Rose and Romantic Keepsakes"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/categories/anniversary-gifts.png';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-neutral-200 text-[11px] font-bold text-[#821D38] flex items-center gap-1 shadow-xs">
                <Heart size={12} className="fill-[#821D38]" />
                <span>24K Golden Rose</span>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#821D38] bg-[#FDF2F4] px-2.5 py-1 rounded-md">
              03 • Anniversary &amp; Milestones
            </span>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E1217] leading-snug">
              Timeless Tokens That Celebrate Lifelong Love
            </h2>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Celebrate your journey of togetherness with romantic keepsakes that stand the test of time — from 24K gold foil roses in glass domes to customized couple plaques.
            </p>

            {/* Crisp Feature Bullets */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-neutral-800">
                <CheckCircle2 size={16} className="text-[#821D38] shrink-0" />
                <span>Preserved 24K Gold Foil Rose with Ambient LED Lights</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-neutral-800">
                <CheckCircle2 size={16} className="text-[#821D38] shrink-0" />
                <span>Custom Engraved Couple Date &amp; Names Plaque</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-neutral-800">
                <CheckCircle2 size={16} className="text-[#821D38] shrink-0" />
                <span>Secure Shock-Proof Safe Milestone Doorstep Delivery</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('/anniversary-gifts')}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#821D38] hover:text-[#6E162E] group cursor-pointer"
              >
                <span>Browse Anniversary Gifts</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

      </section>

      {/* 3. Below Images Plus Content (Visual 3-Card Deck Showcase) */}
      <section className="py-14 bg-white border-t border-b border-[#ECE5DE]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#821D38] bg-[#FDF2F4] px-2.5 py-1 rounded-md">
              Curated Gift Categories
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E1217] mt-3">
              Crafted for Every Milestone
            </h2>
            <p className="text-xs text-neutral-500 mt-1.5">
              Handpicked selections designed to make smiles happen effortlessly.
            </p>
          </div>

          {/* 3 Visual Cards with Image Top, Crisp Content Below */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Card 1: Birthday Celebrations */}
            <div 
              onClick={() => navigate('/birthday-gifts')}
              className="bg-[#FFF9F5] rounded-2xl border border-[#ECE5DE] hover:border-[#821D38]/30 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col justify-between"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-white relative">
                <img
                  src="/images/birthday-hero.png"
                  alt="Birthday Celebrations"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/categories/birthday-gifts.png';
                  }}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#821D38] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                  Bestseller
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#1E1217] group-hover:text-[#821D38] transition-colors">
                    Birthday Celebrations
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                    Surprise hampers, birthday mugs, chocolates, and plush teddy combos packaged for high unboxing joy.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-200/60 flex items-center justify-between text-xs font-bold text-[#821D38]">
                  <span>Explore Birthday Gifts</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Card 2: 3D Moon Lamps */}
            <div 
              onClick={() => navigate('/personalized-gifts')}
              className="bg-[#FFF9F5] rounded-2xl border border-[#ECE5DE] hover:border-[#821D38]/30 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col justify-between"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-white relative">
                <img
                  src="/images/products/moon-lamp.jpg"
                  alt="Custom Glowing Moon Lamps"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/categories/personalized-gifts.png';
                  }}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#C9A45C] text-neutral-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                  Trending Keepsake
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#1E1217] group-hover:text-[#821D38] transition-colors">
                    Custom Photo 3D Moon Lamps
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                    3D-printed ambient moonlight customized with your cherished photo and heartfelt personal message.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-200/60 flex items-center justify-between text-xs font-bold text-[#821D38]">
                  <span>Customize Lamp</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Card 3: Corporate & Festivals */}
            <div 
              onClick={() => navigate('/category/corporate-gifts')}
              className="bg-[#FFF9F5] rounded-2xl border border-[#ECE5DE] hover:border-[#821D38]/30 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col justify-between"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-white relative">
                <img
                  src="/images/categories/corporate-gifts.png"
                  alt="Corporate & Festive Gifting"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/categories/festival-gifts.png';
                  }}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#1E1217] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                  Corporate &amp; Bulk
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#1E1217] group-hover:text-[#821D38] transition-colors">
                    Corporate &amp; Festive Sets
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                    Executive personalized gifting boxes, branded tokens, and Diwali celebration hampers for your team.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-200/60 flex items-center justify-between text-xs font-bold text-[#821D38]">
                  <span>View Corporate Sets</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. The 4 Brand Guarantees (Crisp, Icon-Driven, Fast to scan) */}
      <section className="py-12 bg-[#FFF9F5]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-white border border-[#ECE5DE] text-center shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#FDF2F4] text-[#821D38] flex items-center justify-center mx-auto mb-3">
                <ShieldCheck size={22} />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#1E1217]">100% Quality Inspected</h4>
              <p className="text-[11px] text-neutral-500 mt-1">Every item inspected by artisans before dispatch</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#ECE5DE] text-center shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#FDF2F4] text-[#821D38] flex items-center justify-center mx-auto mb-3">
                <Package size={22} />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#1E1217]">Signature Satin Packaging</h4>
              <p className="text-[11px] text-neutral-500 mt-1">Multi-layer safe packing with gift ribbons</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#ECE5DE] text-center shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#FDF2F4] text-[#821D38] flex items-center justify-center mx-auto mb-3">
                <Truck size={22} />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#1E1217]">Pan-India Express Dispatch</h4>
              <p className="text-[11px] text-neutral-500 mt-1">Doorstep delivery covering 19,000+ pin codes</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#ECE5DE] text-center shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#FDF2F4] text-[#821D38] flex items-center justify-center mx-auto mb-3">
                <Clock size={22} />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#1E1217]">Milestone Punctuality</h4>
              <p className="text-[11px] text-neutral-500 mt-1">Scheduled dispatch right in time for celebrations</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Live Studio Contact & Direct CTA Banner */}
      <section className="bg-gradient-to-r from-[#821D38] via-[#751A32] to-[#581224] py-12 text-white">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
            Ready to Celebrate Someone Special?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-200 max-w-lg mx-auto leading-relaxed">
            Choose from our custom engraved keepsakes, fresh floral hampers, and birthday specials.
          </p>

          {/* Quick Studio Contact Pills */}
          {(storeInfo.phone || storeInfo.email || storeInfo.location) && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-[11px] text-white/90">
              {storeInfo.phone && (
                <span className="bg-white/10 px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/15">
                  <Phone size={12} className="text-[#C9A45C]" />
                  <span>{storeInfo.phone}</span>
                </span>
              )}
              {storeInfo.email && (
                <span className="bg-white/10 px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/15">
                  <Mail size={12} className="text-[#C9A45C]" />
                  <span>{storeInfo.email}</span>
                </span>
              )}
              {storeInfo.location && (
                <span className="bg-white/10 px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/15">
                  <MapPin size={12} className="text-[#C9A45C]" />
                  <span>{storeInfo.location}</span>
                </span>
              )}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 rounded-xl bg-white text-[#821D38] hover:bg-[#FFF9F5] text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              Start Shopping Now
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-6 py-2.5 rounded-xl bg-transparent border border-white/40 hover:bg-white/10 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            >
              Contact Support
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
