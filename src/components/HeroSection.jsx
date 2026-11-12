import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
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
        {slides.map((slide, idx) => {
          const hasTitle = Boolean(slide.titleLine1 || slide.titleLine2);
          const hasTextContent = Boolean(slide.tagline || hasTitle || slide.description);
          const hasAction = Boolean(slide.buttonText);
          const hasAnyContent = hasTextContent || hasAction;

          return (
            <div
              key={slide.id || idx}
              className="w-full shrink-0 relative flex items-center justify-center bg-[#FFF9F5] min-h-[130px] sm:min-h-[220px] md:min-h-[300px] overflow-hidden"
            >
              {/* Full Banner Image - full width, responsive height, NEVER cropped */}
              <img
                src={resolveImageUrl(slide.image)}
                alt={slide.titleLine1 || slide.tagline || 'RS Gifts Banner'}
                className="w-full h-auto max-h-[620px] object-contain block select-none pointer-events-none"
                draggable={false}
                loading={idx === 0 ? 'eager' : 'lazy'}
              />

              {/* Inner Content Area - Clean text overlay, ZERO glassmorphism effect */}
              {hasAnyContent && (
                <div className="absolute inset-0 z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-5 lg:py-6 flex flex-col justify-center pointer-events-none">
                  <div className="max-w-[260px] xs:max-w-[320px] sm:max-w-[500px] pointer-events-auto">
                    {/* Tagline / Subtitle */}
                    {slide.tagline ? (
                      <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.16em] text-[#821D38] uppercase mb-1 sm:mb-1.5 flex items-center gap-1.5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)]">
                        {slide.tagline}
                      </p>
                    ) : null}

                    {/* Main Heading */}
                    {hasTitle ? (
                      <h1
                        className="text-[16px] xs:text-[18px] sm:text-2xl md:text-[30px] lg:text-[36px] font-serif font-bold text-[#561023] leading-[1.16] tracking-tight mb-1 sm:mb-2 drop-shadow-[0_1px_3px_rgba(255,255,255,0.95)]"
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
                    ) : null}

                    {/* Description */}
                    {slide.description ? (
                      <p className="text-[11px] sm:text-[13px] text-[#3D2C34] font-medium leading-snug mb-2 sm:mb-3.5 line-clamp-2 sm:line-clamp-none drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)]">
                        {slide.description}
                      </p>
                    ) : null}

                    {/* Call to Action Button */}
                    {hasAction ? (
                      <div className="relative z-30">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleActionClick(slide.buttonLink);
                          }}
                          className="group inline-flex items-center justify-center gap-1.5 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-[#821D38] hover:bg-[#6E162E] text-white text-[11px] sm:text-[13px] font-medium shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                        >
                          <span>{slide.buttonText}</span>
                          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          );
        })}
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
