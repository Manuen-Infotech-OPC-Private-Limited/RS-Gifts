import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import api from '../services/api';

const resolveImageUrl = (img) => {
  if (!img) {
    const base = import.meta.env.BASE_URL || '/';
    const prefix = base.endsWith('/') ? base : `${base}/`;
    return `${prefix}images/hero-banner-1.png`;
  }
  if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:')) return img;
  const base = import.meta.env.BASE_URL || '/';
  const prefix = base.endsWith('/') ? base : `${base}/`;
  const clean = img.startsWith('/') ? img.slice(1) : img;
  return `${prefix}${clean}`;
};

const defaultSlide = {
  id: 'default_banner_1',
  tagline: '',
  titleLine1: 'Crafted with Love,',
  titleLine2: 'Given with Joy',
  description: '',
  buttonText: 'Shop Gifts',
  buttonLink: '/gifts',
  image: resolveImageUrl('/images/hero-banner-1.png'),
};

export const HeroSection = ({ onShopNow }) => {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([defaultSlide]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const touchMoved = useRef(false);

  // Fetch live banners from backend and sort sequentially 1, 2, 3...
  useEffect(() => {
    let isMounted = true;
    const loadLiveBanners = async () => {
      try {
        const data = await api.get('/customer/content/banners');
        let activeBanners = (data?.banners || []).filter(
          (b) => b && b.active !== false && (b.image || b.imageUrl)
        );

        if (activeBanners.length > 0 && isMounted) {
          // Strictly sort banners in ascending sequence 1 -> 2 -> 3
          activeBanners.sort((a, b) => {
            const orderA = typeof a.order === 'number' ? a.order : 0;
            const orderB = typeof b.order === 'number' ? b.order : 0;
            if (orderA !== orderB) return orderA - orderB;
            return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
          });

          const dynamicSlides = activeBanners.map((b, idx) => {
            const rawTitle = b.title || '';
            const parts = rawTitle.includes(',') ? rawTitle.split(',') : [rawTitle];
            return {
              id: b._id || b.id || `live_banner_${idx}`,
              tagline: b.tagline ? b.tagline.trim() : '',
              titleLine1: parts[0] ? parts[0].trim() + (parts.length > 1 ? ',' : '') : '',
              titleLine2: parts.length > 1 ? parts.slice(1).join(' ').trim() : '',
              hasHeart: true,
              description: b.subtitle ? b.subtitle.trim() : '',
              buttonText: b.buttonText || 'Shop Gifts',
              buttonLink: b.link || b.buttonLink || '/gifts',
              image: b.image || b.imageUrl || '/images/hero-banner-1.png'
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

  // Sequential Next (1 -> 2 -> 3 -> 1...)
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  // Sequential Prev (3 -> 2 -> 1 -> 3...)
  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Direct Jump to Slide (1, 2, or 3)
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Smooth continuous Autoplay: exactly 1 -> 2 -> 3 -> 1... without skipping
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, totalSlides]);

  // Touch swipe handling without duplicate clicks
  const handleTouchStart = (e) => {
    if (!e.targetTouches || e.targetTouches.length === 0) return;
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
    touchMoved.current = false;
  };

  const handleTouchMove = (e) => {
    if (!e.targetTouches || e.targetTouches.length === 0) return;
    touchEndX.current = e.targetTouches[0].clientX;
    if (Math.abs(touchStartX.current - touchEndX.current) > 10) {
      touchMoved.current = true;
    }
  };

  const handleTouchEnd = () => {
    if (!touchMoved.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide(); // Swiped left -> next slide 1 -> 2 -> 3
      } else {
        prevSlide(); // Swiped right -> prev slide 3 -> 2 -> 1
      }
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
    // If the user swiped/dragged, do not trigger click
    if (touchMoved.current) return;
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    if (clickX < rect.width / 2) {
      prevSlide(); // Left click -> prev slide
    } else {
      nextSlide(); // Right click -> next slide (1 -> 2 -> 3)
    }
  };

  return (
    <section
      onClick={handleBannerClick}
      className="relative w-full overflow-hidden bg-[#FFF9F5] select-none cursor-pointer group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Hero Carousel"
    >
      {/* Slides Container with smooth ease-in-out transition */}
      <div
        className="flex w-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, idx) => (
          <div
            key={slide.id || idx}
            className="w-full shrink-0 relative min-h-[210px] sm:min-h-[270px] lg:min-h-[320px] flex items-center"
          >
            {/* Background Image - full panorama, perfectly centered */}
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-500"
              style={{
                backgroundImage: `url("${resolveImageUrl(slide.image)}")`,
                backgroundColor: '#FDF7F4'
              }}
            />

            {/* Subtle soft vignette for depth without washing out the image */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to right, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.04) 30%, transparent 60%)'
              }}
            />

            {/* Inner Content Area */}
            <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-5 lg:py-6 flex flex-col justify-center">
              <div className="max-w-[260px] xs:max-w-[300px] sm:max-w-[480px] bg-white/40 sm:bg-white/20 backdrop-blur-[2px] p-3 sm:p-5 rounded-2xl border border-white/40 shadow-xs">
                {/* Tagline / Subtitle */}
                {slide.tagline ? (
                  <p
                    className="hidden sm:flex text-[10px] sm:text-[11px] font-bold tracking-[0.16em] text-[#821D38] uppercase mb-1 items-center gap-1.5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]"
                  >
                    {slide.tagline}
                  </p>
                ) : null}

                {/* Main Heading */}
                <h1
                  className="text-[17px] sm:text-2xl md:text-[30px] lg:text-[34px] font-serif font-bold text-[#561023] leading-[1.16] tracking-tight mb-1 sm:mb-2 drop-shadow-[0_1px_3px_rgba(255,255,255,0.95)]"
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
                {slide.description ? (
                  <p
                    className="text-[11px] sm:text-[13px] text-[#3D2C34] font-medium leading-snug mb-2 sm:mb-3.5 line-clamp-2 sm:line-clamp-none drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]"
                  >
                    {slide.description}
                  </p>
                ) : null}

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
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Dots Pagination: 1, 2, 3... indicators with smooth pill animation */}
      {slides.length > 1 && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-2 sm:bottom-2.5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5"
        >
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(index);
              }}
              aria-label={`Go to slide ${index + 1}`}
              className={`transition-all duration-300 cursor-pointer ${
                currentSlide === index
                  ? 'w-6 sm:w-7 h-2 bg-[#821D38] rounded-full scale-100 shadow-xs'
                  : 'w-2 h-2 bg-[#D9C4CC] hover:bg-[#821D38]/60 rounded-full'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSection;
