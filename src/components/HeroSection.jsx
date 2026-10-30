import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Truck,
  ShieldCheck,
  Gift,
  ArrowRight,
  Clock
} from 'lucide-react';
import api from '../services/api';

const defaultSlide = {
  id: 'default_banner_1',
  tagline: 'GIFTS THAT SPEAK FROM THE HEART',
  titleLine1: 'Make Every Moment,',
  titleLine2: 'Truly Special',
  description: 'Thoughtful gifts for every occasion. Because every celebration deserves something memorable.',
  buttonText: 'Shop Now',
  buttonLink: '/gifts',
  image: '/images/hero-banner-1.png',
  badges: [
    { id: 'b1', icon: Truck, label: 'Fast & Reliable Delivery' },
    { id: 'b2', icon: ShieldCheck, label: 'Secure Payments' },
    { id: 'b3', icon: Gift, label: 'Easy Returns' },
  ],
};

export const HeroSection = ({ onShopNow }) => {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([defaultSlide]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Fetch live banners from backend
  useEffect(() => {
    let isMounted = true;
    const loadLiveBanners = async () => {
      try {
        const data = await api.get('/customer/content/banners');
        const activeBanners = (data?.banners || []).filter(
          (b) => b && b.active !== false && (b.image || b.imageUrl)
        );
        if (activeBanners.length > 0 && isMounted) {
          const dynamicSlides = activeBanners.map((b, idx) => {
            const rawTitle = b.title || "More Than Gifts, It's Emotions";
            const parts = rawTitle.includes(',') ? rawTitle.split(',') : [rawTitle];
            return {
              id: b._id || b.id || `live_banner_${idx}`,
              tagline: b.subtitle ? 'EXCLUSIVE CURATED GIFTS' : 'GIFTS THAT SPEAK FROM THE HEART',
              titleLine1: parts[0] ? parts[0].trim() + (parts.length > 1 ? ',' : '') : 'More Than Gifts,',
              titleLine2: parts.length > 1 ? parts.slice(1).join(' ').trim() : '',
              hasHeart: true,
              description: b.subtitle || 'Thoughtful gifts for every occasion. Because every moment deserves something special.',
              buttonText: b.buttonText || 'Shop Now',
              buttonLink: b.link || b.buttonLink || '/gifts',
              image: b.image || b.imageUrl || '/images/hero-banner-1.png',
              badges: [
                { id: `b_${idx}_1`, icon: Truck, label: 'Fast & Reliable Delivery' },
                { id: `b_${idx}_2`, icon: ShieldCheck, label: 'Secure Payments' },
                { id: `b_${idx}_3`, icon: Gift, label: 'Easy Returns' },
              ]
            };
          });
          setSlides(dynamicSlides);
        }
      } catch (err) {
        console.warn('Could not load live banners from backend:', err);
      }
    };

    loadLiveBanners();
    return () => { isMounted = false; };
  }, []);

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Autoplay with pause on hover
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide, totalSlides]);

  // Touch swipe handling
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      nextSlide();
    }
    if (touchStartX.current - touchEndX.current < -50) {
      prevSlide();
    }
  };

  const handleActionClick = (link) => {
    if (onShopNow) {
      onShopNow(link);
    } else if (navigate) {
      navigate(link);
    }
  };

  const handleBannerClick = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    if (clickX < rect.width / 2) {
      prevSlide();
    } else {
      nextSlide();
    }
  };

  return (
    <section
      onClick={handleBannerClick}
      className="relative w-full overflow-hidden bg-[#FFF9F5] select-none cursor-pointer"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Hero Carousel"
    >
      {/* Slides Container */}
      <div
        className="flex w-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, idx) => (
          <div
            key={slide.id || idx}
            className="w-full shrink-0 relative min-h-[185px] sm:min-h-[260px] lg:min-h-[320px] flex items-center"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-right sm:bg-center lg:bg-right transition-opacity duration-500"
              style={{
                backgroundImage: `url("${slide.image || '/images/hero-banner-1.png'}")`,
                backgroundColor: '#FDF7F4'
              }}
            />

            {/* Soft Ambient Gradient Overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to right, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.92) 36%, rgba(255, 255, 255, 0.70) 58%, rgba(255, 255, 255, 0.15) 82%, rgba(255, 255, 255, 0) 100%)'
              }}
            />

            {/* Inner Content Area */}
            <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-5 lg:py-6 flex flex-col justify-center">
              <div className="max-w-[210px] sm:max-w-[500px]">
                {/* Tagline / Subtitle */}
                <p
                  className="hidden sm:flex text-[10px] sm:text-[11px] font-semibold tracking-[0.16em] text-[#821D38] uppercase mb-1 items-center gap-1.5"
                >
                  {slide.tagline}
                </p>

                {/* Main Heading */}
                <h1
                  className="text-base sm:text-2xl md:text-[30px] lg:text-[34px] font-serif font-bold text-[#561023] leading-[1.14] tracking-tight mb-1 sm:mb-2"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  <span>{slide.titleLine1}</span>
                  {slide.titleLine2 && (
                    <>
                      <br />
                      <span>{slide.titleLine2}</span>
                    </>
                  )}
                </h1>

                {/* Description */}
                <p
                  className="text-[11px] sm:text-[13px] text-[#52454B] leading-snug mb-2 sm:mb-3.5 whitespace-pre-line font-normal"
                >
                  {slide.description}
                </p>

                {/* Call to Action Button */}
                <div className="mb-1 sm:mb-4 relative z-30">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleActionClick(slide.buttonLink); }}
                    className="group inline-flex items-center justify-center gap-1.5 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-[#821D38] hover:bg-[#6E162E] text-white text-[11px] sm:text-[13px] font-medium shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <span>{slide.buttonText}</span>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="hidden sm:flex flex-wrap items-center gap-3.5 sm:gap-5 text-[10.5px] sm:text-[11.5px] font-medium text-[#483B42]">
                  {(slide.badges || []).map((badge) => {
                    const IconComponent = badge.icon || Gift;
                    return (
                      <div key={badge.id} className="flex items-center gap-1.5">
                        <IconComponent className="w-3.5 h-3.5 text-[#C9A45C] stroke-[2] shrink-0" />
                        <span>{badge.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Dots Pagination */}
      {slides.length > 1 && (
        <div className="absolute bottom-2 sm:bottom-2.5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${currentSlide === index
                ? 'w-2.5 h-2.5 bg-[#821D38] ring-2 ring-[#821D38]/30 scale-110'
                : 'w-2 h-2 bg-[#D9C4CC] hover:bg-[#B3939F]'
                }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSection;
