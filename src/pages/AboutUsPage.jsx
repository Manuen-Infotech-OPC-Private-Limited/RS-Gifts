import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Gift,
  Heart,
  Sparkles,
  ShieldCheck,
  Truck,
  Smile,
  Award,
  Clock,
  ArrowRight,
  Package,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Star,
  Quote,
  Calendar,
  Layers,
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
          hours: parsed.hours || parsed.supportHours || '',
        };
      }
    } catch { }
    return {
      phone: '',
      email: '',
      location: '',
      hours: '',
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
            hours: s.supportHours || '',
          });
        }
      })
      .catch(() => { });
  }, []);

  const metrics = [
    { number: '50,000+', label: 'Happy Celebrations', sublabel: 'Cherished moments made special across India' },
    { number: '1,200+', label: 'Handcrafted Gifts', sublabel: 'Curated keepsakes & bespoke products' },
    { number: '99.4%', label: 'On-Time Deliveries', sublabel: 'Punctual milestone delivery you can rely on' },
    { number: '4.9 ★', label: 'Customer Rating', sublabel: 'Over 5,000+ glowing verified reviews' }
  ];

  const milestones = [
    {
      year: '2021',
      title: 'The Artisanal Beginning',
      desc: 'Started as a passionate boutique gifting studio in Hyderabad, hand-crafting personalized wooden frames, custom mugs, and handwritten greeting cards for intimate celebrations.'
    },
    {
      year: '2022',
      title: 'Expanding Across India',
      desc: 'Introduced farm-fresh floral bouquets, luxury festival hampers, and pan-India express courier networks covering over 5,000 pin codes.'
    },
    {
      year: '2023',
      title: 'Bespoke Personalization Studio',
      desc: 'Upgraded to precision laser-engraving, UV acrylic printing, and our signature satin-ribbon luxury packaging, crossing 25,000 happy families.'
    },
    {
      year: 'Today',
      title: 'India’s Cherished Gifting Destination',
      desc: 'Proudly serving 50,000+ milestone celebrations with same-day dispatch, custom corporate gifting, and dedicated customer care.'
    }
  ];

  const categories = [
    {
      title: 'Personalized Keepsakes',
      desc: 'Custom engraved frames, glowing LED moon lamps, and personalized names that immortalize your special bonds.',
      img: '/images/categories/personalized-gifts.png',
      fallbackImg: '/images/products/personalized-frame.jpg',
      path: '/personalized-gifts'
    },
    {
      title: 'Birthday Specials',
      desc: 'Exciting birthday hampers, custom greeting chocolates, teddy combos, and surprise gift boxes.',
      img: '/images/categories/birthday-gifts.png',
      fallbackImg: '/images/birthday-hero.png',
      path: '/birthday-gifts'
    },
    {
      title: 'Anniversary Tokens',
      desc: 'Timeless 24K golden roses in glass domes, romantic couple plaques, and elegant keepsake gifts.',
      img: '/images/categories/anniversary-gifts.png',
      fallbackImg: '/images/products/golden-rose.jpg',
      path: '/anniversary-gifts'
    },
    {
      title: 'Flowers & Luxury Hampers',
      desc: 'Exotic hand-tied fresh blossoms, gourmet artisanal sweets, dry fruit assortments, and festive baskets.',
      img: '/images/categories/flowers-hampers.png',
      fallbackImg: '/images/products/luxury-hamper.jpg',
      path: '/category/flowers-hampers'
    }
  ];

  const brandPillars = [
    {
      icon: <Sparkles className="w-5 h-5 text-[#821D38]" />,
      title: 'Artisanal Personalization',
      description: 'Custom photo engraving, names, dates, and personalized cards crafted with utmost precision and artistic dedication.'
    },
    {
      icon: <Package className="w-5 h-5 text-[#821D38]" />,
      title: 'Signature Gift Wrapping',
      description: 'Every gift is wrapped like a work of art — accompanied by satin ribbons, premium boxes, and heartfelt greeting messages.'
    },
    {
      icon: <Truck className="w-5 h-5 text-[#821D38]" />,
      title: 'Pan-India Express Dispatch',
      description: 'Swift and safe delivery network covering 19,000+ pin codes across India with delicate handling and shock-proof packing.'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#821D38]" />,
      title: 'Uncompromised Quality',
      description: 'We source only premium materials, durable hardwoods, optical-grade acrylics, and farm-fresh curated flowers.'
    },
    {
      icon: <Clock className="w-5 h-5 text-[#821D38]" />,
      title: 'Punctuality for Milestones',
      description: 'We understand birthdays and anniversaries cannot wait. Our scheduled dispatch guarantees your surprise lands right on time.'
    },
    {
      icon: <Heart className="w-5 h-5 text-[#821D38]" />,
      title: 'Crafted with Deep Empathy',
      description: 'Behind every order is a human story. We treat every parcel as if it were a gift being sent to our own family.'
    }
  ];

  const testimonials = [
    {
      quote: 'Ordered a personalized wooden anniversary frame for my parents’ 25th celebration. The engraving quality, crisp finish, and satin ribbon packaging were simply breathtaking!',
      name: 'Priya Sharma',
      location: 'Hyderabad, Telangana',
      occasion: '25th Wedding Anniversary Gift'
    },
    {
      quote: 'The luxury gift hamper arrived right on my wife’s birthday morning. The flowers were fresh and the customized greeting card was printed flawlessly. Highly recommend RS Gifts!',
      name: 'Rahul Menon',
      location: 'Bangalore, Karnataka',
      occasion: 'Birthday Surprise Hamper'
    },
    {
      quote: 'We ordered 120 custom engraved festive gift sets for our team. The RS Gifts team coordinated everything smoothly, and each parcel reached our employees across India without a scratch.',
      name: 'Vikram Kulkarni',
      location: 'Mumbai, Maharashtra',
      occasion: 'Corporate Festive Gifting'
    }
  ];

  const craftingSteps = [
    {
      step: '01',
      title: 'Thoughtful Curation',
      desc: 'Browse handpicked collections segmented by occasion, relationship, and emotions.'
    },
    {
      step: '02',
      title: 'Bespoke Customization',
      desc: 'Upload cherished memories, enter custom notes, and select your signature gift wrap.'
    },
    {
      step: '03',
      title: 'Handcrafted Assembly',
      desc: 'Our artisans meticulously engrave, assemble, and inspect every detail for perfection.'
    },
    {
      step: '04',
      title: 'Joyful Unboxing',
      desc: 'Delivered securely to their doorstep, creating an unforgettable unboxing experience.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F5] font-sans text-neutral-800 antialiased selection:bg-[#821D38] selection:text-white">
      {/* 1. Hero Section (Split Layout with Visual Showcase & Floating Badges) */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-20 border-b border-[#ECE5DE] bg-gradient-to-b from-[#FFF5EE] via-[#FFF9F5] to-white">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#FDF2F4] blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#FFF0E6] blur-3xl opacity-60 pointer-events-none" />

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF2F4] border border-[#821D38]/20 text-[#821D38] text-xs font-bold uppercase tracking-wider">
                <Gift size={14} className="text-[#821D38]" />
                <span>Gifts For A Brighter Tomorrow</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-[52px] font-bold text-[#1E1217] tracking-tight leading-[1.15]">
                Crafting Smiles, Preserving Memories &amp; <span className="text-[#821D38] italic font-normal">Celebrating Love</span>
              </h1>

              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-xl">
                Welcome to <strong className="text-[#821D38] font-bold">RS Gifts</strong> — where human emotions meet artisanal craftsmanship. We turn ordinary moments into treasured lifelong memories through custom engraved keepsakes, luxury flower hampers, and thoughtful personalized gifts.
              </p>

              {/* Social Proof Mini Strip */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-[#821D38] text-white flex items-center justify-center text-xs font-bold border-2 border-white">RS</div>
                  <div className="w-8 h-8 rounded-full bg-[#C9A45C] text-white flex items-center justify-center text-xs font-bold border-2 border-white">★</div>
                  <div className="w-8 h-8 rounded-full bg-[#1E1217] text-white flex items-center justify-center text-xs font-bold border-2 border-white">50k</div>
                </div>
                <div>
                  <div className="flex items-center text-[#C9A45C]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} className="fill-[#C9A45C]" />
                    ))}
                  </div>
                  <p className="text-[11px] font-semibold text-neutral-600">4.9 / 5 from over 50,000+ happy gifters</p>
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 rounded-xl bg-[#821D38] hover:bg-[#6E162E] text-white text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer group"
                >
                  <span>Explore Our Collections</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="px-6 py-3 rounded-xl bg-white border border-neutral-300 hover:border-[#821D38] text-neutral-800 hover:text-[#821D38] text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-2xs"
                >
                  <span>Contact Gifting Studio</span>
                </button>
              </div>
            </div>

            {/* Right Visual Composite Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-[420px] lg:max-w-none">
                {/* Main Showcase Image Frame */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#FFF9F5] aspect-[4/4.5] group">
                  <img
                    src="/images/products/luxury-hamper.jpg"
                    alt="RS Gifts Signature Showcase"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/hero-banner-1.png';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A45C] bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      Signature Studio Quality
                    </span>
                    <h3 className="font-serif text-lg font-bold mt-1 text-white">
                      Curated &amp; Hand-Wrapped with Love
                    </h3>
                  </div>
                </div>

                {/* Floating Badge 1: 50k+ Deliveries */}
                <div className="absolute -top-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-neutral-100 flex items-center gap-3 animate-bounce-slow">
                  <div className="w-10 h-10 rounded-xl bg-[#FDF2F4] text-[#821D38] flex items-center justify-center shrink-0">
                    <Gift size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-900 leading-tight">50,000+ Gifts</p>
                    <p className="text-[10px] text-neutral-500">Delivered Across India</p>
                  </div>
                </div>

                {/* Floating Badge 2: Handcrafted */}
                <div className="absolute -bottom-4 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-neutral-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF9F5] text-[#C9A45C] flex items-center justify-center shrink-0 border border-[#C9A45C]/30">
                    <Heart size={20} className="fill-[#C9A45C]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-900 leading-tight">100% Handcrafted</p>
                    <p className="text-[10px] text-neutral-500">With Personal Empathy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Metrics Strip */}
      <section className="bg-white border-b border-[#ECE5DE] py-10 shadow-2xs">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-neutral-100">
            {metrics.map((m, idx) => (
              <div key={idx} className="flex flex-col items-center pt-4 md:pt-0">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[#821D38] tracking-tight">
                  {m.number}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#1E1217] mt-1">
                  {m.label}
                </span>
                <span className="text-[11px] text-neutral-500 mt-0.5 max-w-[180px]">
                  {m.sublabel}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. The Story & Heritage Section */}
      <section className="py-16 sm:py-20 bg-[#FFF9F5]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Story Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#821D38] tracking-widest uppercase">
                <Heart size={14} className="fill-[#821D38]" />
                <span>Our Heritage &amp; Passion</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1E1217] leading-snug">
                Because Every Gift Tells A Story That Ordinary Words Cannot
              </h2>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                At <strong className="text-neutral-900 font-semibold">RS Gifts</strong>, we believe gifting is far more than exchanging an item. It is an emotional embrace, a quiet thank you, a celebration of shared years, or the anticipation of a joyous milestone. Whether it’s an anniversary keepsake that makes a couple tear up, a surprise birthday hamper delivered at midnight, or a festival token sent across miles, we treat every parcel with sacred respect.
              </p>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Founded with a singular mission to replace generic, forgettable presents with meaningful bespoke keepsakes, our studio brings together dedicated artisans, optical-grade acrylics, sustainably sourced woods, and gourmet treats. We ensure that whatever you feel is beautifully translated into an unboxing celebration.
              </p>

              {/* Quality Checklist Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {[
                  '100% Genuine Quality Guarantee',
                  'Artisanal Handcrafting & Inspection',
                  'Customized Messages & Engravings',
                  'Complimentary Luxury Gift Wrapping'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs font-semibold text-neutral-800 bg-white p-2.5 rounded-xl border border-neutral-200/80 shadow-2xs">
                    <CheckCircle2 size={16} className="text-[#821D38] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Card: The RS Gifts Difference */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl bg-gradient-to-br from-[#821D38] via-[#751A32] to-[#581224] p-8 sm:p-10 text-white shadow-xl overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/10 blur-xl" />
                <div className="absolute top-4 right-4 text-white/20">
                  <Gift size={90} strokeWidth={1} />
                </div>

                <span className="text-[11px] font-bold uppercase tracking-widest text-[#C9A45C]">
                  The RS Gifts Difference
                </span>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold mt-2 leading-tight text-white">
                  "Thoughtful Gifting, Seamless Experience."
                </h3>

                <p className="text-xs sm:text-sm text-neutral-200 mt-4 leading-relaxed">
                  We don't simply deliver boxes; we curate joy. From the moment you place your order to the second your loved one unties the satin ribbon, our team ensures every touchpoint radiates warmth, luxury, and authentic emotion.
                </p>

                <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between">
                  <div>
                    <p className="font-serif text-lg font-bold text-white">RS Gifts Studio</p>
                    <p className="text-[11px] text-neutral-300">Hyderabad &amp; Pan-India Service</p>
                  </div>
                  <div className="flex gap-1 text-[#C9A45C]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} className="fill-[#C9A45C]" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Signature Collections Showcase Grid */}
      <section className="py-16 sm:py-20 bg-white border-t border-b border-[#ECE5DE]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#821D38]">
              Signature Offerings
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1E1217] mt-2">
              Collections We Craft with Love
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-3">
              Every occasion holds a unique resonance. Explore our most cherished gifting categories.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                onClick={() => navigate(cat.path)}
                className="group bg-[#FFF9F5] rounded-2xl border border-[#ECE5DE] hover:border-[#821D38]/30 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-white relative">
                  <img
                    src={cat.img}
                    alt={cat.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = cat.fallbackImg;
                    }}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#1E1217] group-hover:text-[#821D38] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-200/60 flex items-center text-xs font-bold text-[#821D38] group-hover:translate-x-1 transition-transform">
                    <span>View Collection</span>
                    <ChevronRight size={14} className="ml-0.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Our Journey Timeline */}
      <section className="py-16 sm:py-20 bg-[#FFF9F5]">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#821D38]">
              Our Journey
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1E1217] mt-2">
              The Path of Thoughtful Gifting
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-3">
              How a humble creative passion evolved into India's beloved gifting destination.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-[#ECE5DE] shadow-2xs hover:shadow-md transition-shadow relative"
              >
                <div className="inline-block px-3 py-1 rounded-full bg-[#FDF2F4] text-[#821D38] font-serif text-xs font-bold mb-3 border border-[#821D38]/20">
                  {m.year}
                </div>
                <h3 className="font-serif text-base font-bold text-[#1E1217] mb-2">
                  {m.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why Choose Us (The 6 Pillars) */}
      <section className="py-16 sm:py-20 bg-white border-t border-[#ECE5DE]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#821D38]">
              Why Choose RS Gifts
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1E1217] mt-2">
              The Pillars of Our Promise
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-3">
              Every creation leaving our workshop reflects six core principles that define who we are.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {brandPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-2xl bg-[#FFF9F5] border border-[#ECE5DE] hover:border-[#821D38]/30 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#ECE5DE] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-2xs">
                    {pillar.icon}
                  </div>
                  <h3 className="text-base font-bold text-[#1E1217] mb-2 group-hover:text-[#821D38] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. The Crafting Process (4-Step Flow) */}
      <section className="py-16 sm:py-20 bg-[#FFF9F5] border-t border-[#ECE5DE]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#821D38]">
              The RS Gifts Experience
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1E1217] mt-2">
              From Your Heart To Their Hands
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-3">
              A smooth, worry-free process that transforms your sentiment into an unforgettable gift.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {craftingSteps.map((step, idx) => (
              <div
                key={idx}
                className="relative bg-white p-6 rounded-2xl border border-[#ECE5DE] shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <span className="font-serif text-3xl font-bold text-[#821D38]/20 block mb-3">
                    {step.step}
                  </span>
                  <h3 className="text-sm font-bold text-[#1E1217] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Customer Wall of Love (Testimonials) */}
      <section className="py-16 sm:py-20 bg-white border-t border-[#ECE5DE]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#821D38]">
              Customer Love
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1E1217] mt-2">
              Stories from Delighted Gifters
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-3">
              Real emotions and joyful unboxings shared by our cherished customer family.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="p-7 rounded-2xl bg-[#FFF9F5] border border-[#ECE5DE] shadow-2xs flex flex-col justify-between relative"
              >
                <div>
                  <Quote size={28} className="text-[#821D38]/20 mb-3" />
                  <div className="flex gap-1 text-[#C9A45C] mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-[#C9A45C]" />
                    ))}
                  </div>
                  <p className="text-xs text-neutral-700 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-200/60">
                  <p className="text-xs font-bold text-[#1E1217]">{t.name}</p>
                  <p className="text-[11px] text-neutral-500">{t.location}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-[#821D38] bg-[#FDF2F4] px-2 py-0.5 rounded-md">
                    {t.occasion}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Mission & Vision Dual Cards */}
      <section className="py-16 bg-[#FFF9F5] border-t border-[#ECE5DE]">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="p-8 rounded-3xl bg-white border border-[#ECE5DE] shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#821D38] text-white flex items-center justify-center mb-4 shadow-xs">
                <Smile size={20} />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1217] mb-3">
                Our Mission
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                To empower people across India to celebrate their most precious bonds through personalized, high-quality, and deeply memorable gifting experiences that spark joy and bring people closer together.
              </p>
            </div>

            {/* Vision */}
            <div className="p-8 rounded-3xl bg-white border border-[#ECE5DE] shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#C9A45C] text-white flex items-center justify-center mb-4 shadow-xs">
                <Award size={20} />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1217] mb-3">
                Our Vision
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                To become India's foremost destination for bespoke celebrations, celebrated for exquisite craftsmanship, unswerving reliability, and the heartfelt warmth behind every surprise delivered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Live Studio Contact Details */}
      {storeInfo.phone || storeInfo.email || storeInfo.location ? (
        <section className="py-12 bg-white border-t border-[#ECE5DE]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="font-serif text-xl font-bold text-[#1E1217] mb-6">
              Connect With Our Gifting Studio
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-700">
              {storeInfo.phone && (
                <div className="flex items-center gap-2 bg-[#FFF9F5] px-4 py-2.5 rounded-xl border border-neutral-200">
                  <Phone size={14} className="text-[#821D38]" />
                  <span className="font-semibold">{storeInfo.phone}</span>
                </div>
              )}
              {storeInfo.email && (
                <div className="flex items-center gap-2 bg-[#FFF9F5] px-4 py-2.5 rounded-xl border border-neutral-200">
                  <Mail size={14} className="text-[#821D38]" />
                  <span className="font-semibold">{storeInfo.email}</span>
                </div>
              )}
              {storeInfo.location && (
                <div className="flex items-center gap-2 bg-[#FFF9F5] px-4 py-2.5 rounded-xl border border-neutral-200">
                  <MapPin size={14} className="text-[#821D38]" />
                  <span className="font-semibold">{storeInfo.location}</span>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {/* 11. Bottom CTA Banner */}
      <section className="bg-gradient-to-r from-[#821D38] via-[#751A32] to-[#581224] py-14 text-white">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-2xl sm:text-4xl font-bold leading-tight">
            Ready to Celebrate Someone Special Today?
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-neutral-200 max-w-xl mx-auto leading-relaxed">
            Discover our curated birthday specials, anniversary tokens, personalized frames, and luxury hampers.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-xl bg-white text-[#821D38] hover:bg-[#FFF9F5] text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              Start Shopping Now
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-6 py-3 rounded-xl bg-transparent border border-white/40 hover:bg-white/10 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer"
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
