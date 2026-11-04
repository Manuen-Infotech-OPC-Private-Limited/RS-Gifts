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
  Star
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
    { number: '50,000+', label: 'Happy Celebrations', sublabel: 'Moments made special across India' },
    { number: '1,200+', label: 'Curated Keepsakes', sublabel: 'Handpicked & personalized gifts' },
    { number: '99.4%', label: 'On-Time Deliveries', sublabel: 'Reliable doorstep milestone delivery' },
    { number: '4.9 ★', label: 'Customer Rating', sublabel: 'Verified reviews from loving gifters' }
  ];

  const brandPillars = [
    {
      icon: <Sparkles className="w-6 h-6 text-[#821D38]" />,
      title: 'Artisanal Personalization',
      description: 'Custom photo engraving, names, dates, and personalized cards crafted with utmost precision and artistic dedication.'
    },
    {
      icon: <Package className="w-6 h-6 text-[#821D38]" />,
      title: 'Signature Gift Wrapping',
      description: 'Every gift is wrapped like a work of art — accompanied by satin ribbons, premium boxes, and heartfelt greeting messages.'
    },
    {
      icon: <Truck className="w-6 h-6 text-[#821D38]" />,
      title: 'Pan-India Express Dispatch',
      description: 'Swift and safe delivery network covering 19,000+ pin codes across India with delicate handling and shock-proof packing.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#821D38]" />,
      title: 'Uncompromised Quality',
      description: 'We source only premium materials, durable hardwoods, optical-grade acrylics, and farm-fresh curated flowers.'
    },
    {
      icon: <Clock className="w-6 h-6 text-[#821D38]" />,
      title: 'Punctuality for Milestones',
      description: 'We understand birthdays and anniversaries cannot wait. Our scheduled dispatch guarantees your surprise lands right on time.'
    },
    {
      icon: <Heart className="w-6 h-6 text-[#821D38]" />,
      title: 'Crafted with Deep Empathy',
      description: 'Behind every order is a human story. We treat every parcel as if it were a gift being sent to our own family.'
    }
  ];

  const craftingSteps = [
    {
      step: '01',
      title: 'Thoughtful Curation',
      desc: 'Explore collections thoughtfully segmented by occasion, relationship, and emotion.'
    },
    {
      step: '02',
      title: 'Bespoke Customization',
      desc: 'Upload cherished memories, enter custom notes, and select signature gift wrap.'
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
    <div className="min-h-screen bg-[#FFF9F5] font-sans text-neutral-800 antialiased">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-24 border-b border-[#ECE5DE] bg-gradient-to-b from-[#FFF5EE] via-[#FFF9F5] to-white">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#FDF2F4] blur-3xl opacity-70 pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#FFF0E6] blur-3xl opacity-70 pointer-events-none" />

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF2F4] border border-[#821D38]/15 text-[#821D38] text-xs font-bold uppercase tracking-wider mb-5">
            <Gift size={14} className="text-[#821D38]" />
            <span>Gifts For A Brighter Tomorrow</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#1E1217] tracking-tight leading-tight max-w-4xl mx-auto">
            Making Every Celebration <span className="text-[#821D38] italic">Truly Unforgettable</span>
          </h1>

          <p className="mt-6 text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Welcome to <strong className="text-[#821D38] font-semibold">RS Gifts</strong> — where thoughtfulness meets artisanal elegance. We turn ordinary moments into treasured lifelong memories through personalized keepsakes, bespoke floral hampers, and timeless gifts.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
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
              <span>Get in Touch</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Key Metrics Bar */}
      <section className="bg-white border-b border-[#ECE5DE] py-10 shadow-2xs">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            {metrics.map((m, idx) => (
              <div key={idx} className="flex flex-col items-center">
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

      {/* 3. The Story & Vision Section */}
      <section className="py-16 sm:py-20 bg-[#FFF9F5]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Story Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#821D38] tracking-widest uppercase">
                <Heart size={14} className="fill-[#821D38]" />
                <span>Our Heritage & Passion</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1E1217] leading-snug">
                Because Every Gift Tells A Story That Words Often Cannot
              </h2>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                At <strong className="text-neutral-900">RS Gifts</strong>, we believe that true gifting is never just about exchanging an item. It is a profound bridge of emotions, gratitude, affection, and celebration. Whether it’s celebrating a couple’s milestone anniversary, sending laughter on a friend’s birthday, or thanking corporate partners for their loyalty, we put our heart into every package.
              </p>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Founded with a singular passion to replace generic, impersonal gifts with personalized keepsakes, our studio brings together creative artisans, premium materials, and cutting-edge customization technology. We ensure your feelings are immortalized in each handcrafted product.
              </p>

              {/* Checklist highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  '100% Genuine Quality Guarantee',
                  'Artisanal Handcrafting & Inspection',
                  'Customized Messages & Engravings',
                  'Complimentary Luxury Gift Wrapping'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-semibold text-neutral-800">
                    <CheckCircle2 size={16} className="text-[#821D38] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Feature Card */}
            <div className="relative">
              <div className="relative rounded-3xl bg-gradient-to-br from-[#821D38] to-[#581224] p-8 sm:p-10 text-white shadow-xl overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/10 blur-xl" />
                <div className="absolute top-4 right-4 text-white/20">
                  <Gift size={90} strokeWidth={1} />
                </div>

                <span className="text-[11px] font-bold uppercase tracking-widest text-[#C9A45C]">
                  The RS Gifts Difference
                </span>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold mt-2 leading-tight">
                  "Thoughtful Gifting, Seamless Experience."
                </h3>

                <p className="text-xs sm:text-sm text-neutral-200 mt-4 leading-relaxed">
                  We don't simply ship parcels; we orchestrate smiles. From the moment you place your order to the second your loved one unties the satin ribbon, our team ensures every touchpoint radiates warmth and luxury.
                </p>

                <div className="mt-8 pt-6 border-t border-white/15 flex items-center justify-between">
                  <div>
                    <p className="font-serif text-lg font-bold">RS Gifts Studio</p>
                    <p className="text-[11px] text-neutral-300">Hyderabad & Pan-India Service</p>
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

      {/* 4. Why Choose Us (Pillars Grid) */}
      <section className="py-16 sm:py-20 bg-white border-t border-b border-[#ECE5DE]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* 5. The Crafting Process (4-Step Flow) */}
      <section className="py-16 sm:py-20 bg-[#FFF9F5]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#821D38]">
              How It Works
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

      {/* 6. Mission & Vision Dual Box */}
      <section className="py-16 bg-white border-t border-[#ECE5DE]">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="p-8 rounded-3xl bg-[#FFF9F5] border border-[#ECE5DE] relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-[#821D38] text-white flex items-center justify-center mb-4">
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
            <div className="p-8 rounded-3xl bg-[#FFF9F5] border border-[#ECE5DE] relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-[#C9A45C] text-white flex items-center justify-center mb-4">
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

      {/* 7. Need Help or Bespoke Orders? */}
      {storeInfo.phone || storeInfo.email || storeInfo.location ? (
        <section className="py-12 bg-[#FFF9F5] border-t border-[#ECE5DE]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="font-serif text-xl font-bold text-[#1E1217] mb-6">
              Connect With Our Gifting Team
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-700">
              {storeInfo.phone && (
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-neutral-200">
                  <Phone size={14} className="text-[#821D38]" />
                  <span>{storeInfo.phone}</span>
                </div>
              )}
              {storeInfo.email && (
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-neutral-200">
                  <Mail size={14} className="text-[#821D38]" />
                  <span>{storeInfo.email}</span>
                </div>
              )}
              {storeInfo.location && (
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-neutral-200">
                  <MapPin size={14} className="text-[#821D38]" />
                  <span>{storeInfo.location}</span>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {/* 8. Bottom CTA Banner */}
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
