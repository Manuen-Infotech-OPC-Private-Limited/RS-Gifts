import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import api from '../services/api';

export const Footer = ({
  bgColor = '#E8A0AD',
  primaryColor = '#29252A',
  secondaryColor = '#6F6870'
}) => {
  const navigate = useNavigate();

  const [contactInfo, setContactInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('rs_gifts_contact_info');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          phone: parsed.phone || parsed.contactPhone || '',
          email: parsed.email || parsed.contactEmail || parsed.supportEmail || '',
          location: parsed.location || parsed.storeAddress || '',
          hours: parsed.hours || parsed.supportHours || ''
        };
      }
    } catch (e) {}
    return {
      phone: '',
      email: '',
      location: '',
      hours: ''
    };
  });

  useEffect(() => {
    // Fetch live public contact settings dynamically from MongoDB
    api.get('/customer/content/settings')
      .then(res => {
        const s = res?.settings || res?.data?.settings;
        if (s) {
          const liveContact = {
            phone: s.contactPhone || '',
            email: s.contactEmail || s.supportEmail || '',
            location: s.storeAddress || '',
            hours: s.supportHours || '',
          };
          setContactInfo(liveContact);
          try {
            localStorage.setItem('rs_gifts_contact_info', JSON.stringify(liveContact));
          } catch (e) {}
        }
      })
      .catch((err) => {
        console.warn('Could not load live contact settings from MongoDB:', err);
      });

    // Listen to localStorage and window custom events for instant real-time updates
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('rs_gifts_contact_info');
        if (saved) {
          const parsed = JSON.parse(saved);
          setContactInfo({
            phone: parsed.phone || parsed.contactPhone || '',
            email: parsed.email || parsed.contactEmail || parsed.supportEmail || '',
            location: parsed.location || parsed.storeAddress || '',
            hours: parsed.hours || parsed.supportHours || ''
          });
        }
      } catch (e) {}
    };

    const handleCustomUpdate = (e) => {
      if (e.detail) {
        setContactInfo({
          phone: e.detail.phone || e.detail.contactPhone || '',
          email: e.detail.email || e.detail.contactEmail || '',
          location: e.detail.location || e.detail.storeAddress || '',
          hours: e.detail.hours || e.detail.supportHours || '',
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('rs_gifts_contact_updated', handleCustomUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('rs_gifts_contact_updated', handleCustomUpdate);
    };
  }, []);

  const handleNav = (path) => {
    if (navigate && path.startsWith('/')) {
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer
      style={{ backgroundColor: bgColor }}
      className="w-full font-sans select-none text-[12.5px] leading-normal"
    >
      {/* Main Footer Container with Compact Padding */}
      <div className="max-w-[1340px] mx-auto px-5 sm:px-8 lg:px-10 pt-6 sm:pt-7 pb-3.5">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-5">

          {/* Column 1: Brand & Tagline & Socials */}
          <div className="w-full lg:max-w-[320px] flex flex-col space-y-2">
            {/* Logo */}
            <div
              onClick={() => handleNav('/')}
              className="inline-flex items-center gap-2.5 cursor-pointer group w-fit"
            >
              {/* Gift Box Icon in #29252A */}
              <svg width="36" height="32" viewBox="6 6 32 29" fill="none" className="shrink-0 transition-transform duration-200 group-hover:scale-105">
                {/* Left Bow Loop */}
                <path
                  d="M22 12.5C18.5 7.2 11 6.5 11 10.5C11 14 18 13.5 22 13.5"
                  stroke={primaryColor}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Right Bow Loop */}
                <path
                  d="M22 12.5C25.5 7.2 33 6.5 33 10.5C33 14 26 13.5 22 13.5"
                  stroke={primaryColor}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Knot */}
                <circle cx="22" cy="13" r="2" fill={primaryColor} />

                {/* Lid */}
                <rect x="7.5" y="13.5" width="29" height="5.5" rx="1" fill={primaryColor} />
                <rect x="20.5" y="13.5" width="3" height="5.5" fill={bgColor} />

                {/* Box Body */}
                <rect x="9.5" y="19" width="25" height="14" rx="1" fill={primaryColor} />
                <rect x="20.5" y="19" width="3" height="14" fill={bgColor} />
              </svg>

              {/* Brand Typography */}
              <div className="flex flex-col justify-center">
                {/* Brand Name: Primary #29252A */}
                <span
                  style={{ color: primaryColor }}
                  className="font-serif text-[25px] sm:text-[27px] font-bold leading-none tracking-[0.03em]"
                >
                  RS GIFTS
                </span>
                {/* Brand Subtitle: Secondary #6F6870 */}
                <span
                  style={{ color: secondaryColor }}
                  className="text-[6.8px] sm:text-[7.2px] font-semibold tracking-[0.14em] uppercase mt-1 leading-none font-sans"
                >
                  GIFTS FOR A BRIGHTER TOMORROW
                </span>
              </div>
            </div>

            {/* Brand Description: Secondary #6F6870 */}
            <p
              style={{ color: secondaryColor }}
              className="text-[12px] sm:text-[12.5px] leading-snug font-normal max-w-[310px]"
            >
              We bring smiles with thoughtful gifts for every occasion. Because every gift tells a story.
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center gap-2 pt-0.5">
              {/* Facebook: White circle with black 'f' */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-6.5 h-6.5 rounded-full bg-white flex items-center justify-center text-[#18181B] shadow-xs hover:scale-110 active:scale-95 transition-transform"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.5 21.5v-8.2h2.8l.4-3.2h-3.2V8.1c0-.9.3-1.6 1.6-1.6h1.7V3.7c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.2H7.5v3.2h2.6v8.2h3.4z" />
                </svg>
              </a>

              {/* Instagram: Dark circle with white camera icon */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-6.5 h-6.5 rounded-full bg-[#29252A] flex items-center justify-center text-white shadow-xs hover:scale-110 active:scale-95 transition-transform border border-white/20"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              {/* YouTube: Red circle with white play triangle */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-6.5 h-6.5 rounded-full bg-[#E50914] flex items-center justify-center text-white shadow-xs hover:scale-110 active:scale-95 transition-transform"
              >
                <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </a>

              {/* Pinterest: Red circle with white 'P' */}
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Pinterest"
                className="w-6.5 h-6.5 rounded-full bg-[#CB2027] flex items-center justify-center text-white shadow-xs hover:scale-110 active:scale-95 transition-transform"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.5 2c-5.2 0-8.5 3.5-8.5 7.8 0 2.8 1.5 4.8 2.4 4.8.4 0 .6-1 .6-1.4 0-.4-.9-1.2-.9-2.7 0-3.3 2.5-5.9 6.2-5.9 3 0 5.1 1.7 5.1 4.5 0 2.3-1.1 6.5-3.8 6.5-1.2 0-2.1-1-2.1-2.3 0-1.9 1.4-3.8 1.4-5.8 0-1.4-.8-2.5-2.2-2.5-1.7 0-3.1 1.8-3.1 4.1 0 1.5.5 2.5.5 2.5s-1.8 7.5-2.1 8.8c-.4 1.5-.1 3.9 0 4.1.1.1.2.1.3 0 .2-.3 2.5-3.5 3.3-6.6l1.2-4.7c.4.8 1.6 1.5 2.8 1.5 4.3 0 6.6-4.1 6.6-8.5C21.7 6.1 17.8 2 12.5 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col space-y-1.5 min-w-[115px]">
            {/* Heading: Primary #29252A */}
            <h4
              style={{ color: primaryColor }}
              className="text-[13.5px] sm:text-[14px] font-bold tracking-tight mb-0.5"
            >
              Quick Links
            </h4>
            {/* Links: Secondary #6F6870 */}
            <ul className="space-y-1.5">
              {[
                { label: 'Home', path: '/' },
                { label: 'About Us', path: '/about' },
                { label: 'All Products', path: '/products' },
                { label: 'Offers', path: '/offers' },
                { label: 'Contact Us', path: '/contact' }
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNav(link.path)}
                    style={{ color: secondaryColor }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = primaryColor)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = secondaryColor)}
                    className="text-[12.5px] font-normal transition-colors cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div className="flex flex-col space-y-1.5 min-w-[135px]">
            {/* Heading: Primary #29252A */}
            <h4
              style={{ color: primaryColor }}
              className="text-[13.5px] sm:text-[14px] font-bold tracking-tight mb-0.5"
            >
              Customer Service
            </h4>
            {/* Links: Secondary #6F6870 */}
            <ul className="space-y-1.5">
              {[
                { label: 'Track Order', path: '/track-order' },
                { label: 'Shipping Policy', path: '/shipping-policy' },
                { label: 'Return & Refund', path: '/refund-policy' },
                { label: 'FAQ', path: '/faq' },
                { label: 'Terms & Conditions', path: '/terms' },
                { label: 'Privacy Policy', path: '/privacy' }
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNav(link.path)}
                    style={{ color: secondaryColor }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = primaryColor)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = secondaryColor)}
                    className="text-[12.5px] font-normal transition-colors cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          {(contactInfo.phone || contactInfo.email || contactInfo.location || contactInfo.hours) && (
            <div className="flex flex-col space-y-1.5 min-w-[195px]">
              {/* Heading: Primary #29252A */}
              <h4
                style={{ color: primaryColor }}
                className="text-[13.5px] sm:text-[14px] font-bold tracking-tight mb-0.5"
              >
                Contact Us
              </h4>
              <div className="space-y-1.5">
                {/* Phone */}
                {contactInfo.phone && (
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Phone className="w-3.5 h-3.5 shrink-0 stroke-[2]" style={{ color: primaryColor }} />
                    <a
                      href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`}
                      style={{ color: secondaryColor }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = primaryColor)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = secondaryColor)}
                      className="text-[12.5px] transition-colors"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                )}

                {/* Email */}
                {contactInfo.email && (
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Mail className="w-3.5 h-3.5 shrink-0 stroke-[2]" style={{ color: primaryColor }} />
                    <a
                      href={`mailto:${contactInfo.email}`}
                      style={{ color: secondaryColor }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = primaryColor)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = secondaryColor)}
                      className="text-[12.5px] transition-colors"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                )}

                {/* Location */}
                {contactInfo.location && (
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <MapPin className="w-3.5 h-3.5 shrink-0 stroke-[2]" style={{ color: primaryColor }} />
                    <span style={{ color: secondaryColor }} className="text-[12.5px]">
                      {contactInfo.location}
                    </span>
                  </div>
                )}

                {/* Hours */}
                {contactInfo.hours && (
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Clock className="w-3.5 h-3.5 shrink-0 stroke-[2]" style={{ color: primaryColor }} />
                    <span style={{ color: secondaryColor }} className="text-[12.5px]">
                      {contactInfo.hours}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Column 5: We Accept */}
          <div className="flex flex-col space-y-1.5 min-w-[215px]">
            {/* Heading: Primary #29252A */}
            <h4
              style={{ color: primaryColor }}
              className="text-[13.5px] sm:text-[14px] font-bold tracking-tight mb-0.5"
            >
              We Accept
            </h4>

            {/* 4 Badges in a single horizontal row matching reference image */}
            <div className="flex items-center gap-1.5 flex-nowrap pt-0.5">
              {/* VISA */}
              <div className="bg-white rounded px-2 py-1 shadow-xs border border-black/5 flex items-center justify-center h-6.5 w-[48px] shrink-0 transition-transform hover:-translate-y-0.5">
                <svg viewBox="0 0 50 16" className="h-3 w-auto" fill="none">
                  <path d="M19.5 1.5L14.7 14.5H10.8L8 4C7.8 3.3 7.6 2.9 7 2.5C5.9 2 4.1 1.5 2.3 1.2L2.5 0.6H9C9.9 0.6 10.7 1.2 10.9 2.2L12.8 12.1L16.6 1.5H19.5ZM34.2 10.2C34.2 6.4 28.9 6.1 28.9 4.4C28.9 3.8 29.5 3.1 30.8 3C31.4 2.9 33.1 2.9 34.6 3.6L35.2 0.9C34.4 0.6 33.3 0.3 32 0.3C27.7 0.3 24.6 2.6 24.6 5.9C24.6 8.3 26.8 9.7 28.4 10.5C30.1 11.3 30.7 11.8 30.7 12.6C30.7 13.7 29.3 14.2 28 14.2C26.1 14.2 24.9 13.7 24 13.2L23.3 16C24.3 16.5 26.1 16.9 27.9 16.9C32.5 16.9 35.5 14.6 35.5 11.1M45.7 14.5H49L46.2 1.5H43.2C42.5 1.5 41.9 1.9 41.7 2.5L35.7 14.5H39.7L40.5 12.2H45.4L45.7 14.5ZM41.5 9.5L43.5 4L44.7 9.5H41.5ZM25.1 1.5L22 14.5H18.3L21.4 1.5H25.1Z" fill="#1A1F71" />
                </svg>
              </div>

              {/* Mastercard */}
              <div className="bg-white rounded px-2 py-1 shadow-xs border border-black/5 flex items-center justify-center h-6.5 w-[48px] shrink-0 transition-transform hover:-translate-y-0.5">
                <svg viewBox="0 0 36 22" className="h-3.5 w-auto">
                  <circle cx="12" cy="11" r="10" fill="#EB001B" />
                  <circle cx="24" cy="11" r="10" fill="#F79E1B" />
                  <path d="M18 4.2C19.9 5.8 21.2 8.3 21.2 11C21.2 13.7 19.9 16.2 18 17.8C16.1 16.2 14.8 13.7 14.8 11C14.8 8.3 16.1 5.8 18 4.2Z" fill="#FF5F00" />
                </svg>
              </div>

              {/* UPI */}
              <div className="bg-white rounded px-2 py-1 shadow-xs border border-black/5 flex items-center justify-center h-6.5 w-[48px] shrink-0 transition-transform hover:-translate-y-0.5">
                <div className="flex items-center gap-0.5 font-bold">
                  <span className="italic text-[#097939] tracking-tighter text-[10.5px] font-black">///</span>
                  <span className="text-[#E76C25] font-black text-[10px] tracking-tight">UPI</span>
                </div>
              </div>

              {/* Paytm */}
              <div className="bg-white rounded px-2 py-1 shadow-xs border border-black/5 flex items-center justify-center h-6.5 w-[48px] shrink-0 transition-transform hover:-translate-y-0.5">
                <div className="flex items-center font-bold text-[10.5px] tracking-tight">
                  <span className="text-[#002970]">pay</span>
                  <span className="text-[#00BAF2]">tm</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar Separator */}
        <div
          style={{ borderColor: `${primaryColor}26`, color: secondaryColor }}
          className="mt-4 sm:mt-5 pt-2.5 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-[11.5px] sm:text-[12px]"
        >
          <div>
            © 2024 RS GIFTS. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5">
            <span>Made with</span>
            <span className="text-[#E11D48] text-[12.5px] inline-block">❤️</span>
            <span>for Special Moments</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
