import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    User,
    Tag,
    MessageSquare,
    Send,
    CheckCircle2
} from 'lucide-react';
import api from '../services/api';

export const Contactus = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        const appRoot = document.querySelector('.app-root');
        if (appRoot) appRoot.scrollTop = 0;
    }, []);

    // Dynamic contact info synced with admin/MongoDB/localStorage (no hardcoded defaults)
    const [contactInfo, setContactInfo] = useState(() => {
        try {
            const saved = localStorage.getItem('rs_gifts_contact_info');
            if (saved) {
                const parsed = JSON.parse(saved);
                return {
                    phone: parsed.phone || parsed.contactPhone || '',
                    altPhone: parsed.altPhone || parsed.altContactPhone || '',
                    email: parsed.email || parsed.contactEmail || '',
                    altEmail: parsed.altEmail || parsed.altContactEmail || '',
                    location: parsed.location || parsed.storeAddress || '',
                    hours: parsed.hours || parsed.supportHours || '',
                    altHours: parsed.altHours || parsed.altSupportHours || '',
                    googleMapUrl: parsed.googleMapUrl || parsed.mapEmbedUrl || '',
                };
            }
        } catch { }
        return {
            phone: '',
            altPhone: '',
            email: '',
            altEmail: '',
            location: '',
            hours: '',
            altHours: '',
            googleMapUrl: '',
        };
    });

    useEffect(() => {
        // Fetch live public contact settings dynamically from MongoDB
        api.get('/customer/content/settings')
            .then(res => {
                const s = res?.data?.settings || res?.settings;
                if (s) {
                    const liveContact = {
                        phone: s.contactPhone || '',
                        altPhone: s.altContactPhone || '',
                        email: s.contactEmail || s.supportEmail || '',
                        altEmail: s.altContactEmail || '',
                        location: s.storeAddress || '',
                        hours: s.supportHours || '',
                        altHours: s.altSupportHours || '',
                        googleMapUrl: s.googleMapUrl || '',
                    };
                    setContactInfo(liveContact);
                    try {
                        localStorage.setItem('rs_gifts_contact_info', JSON.stringify(liveContact));
                    } catch (e) { }
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
                        altPhone: parsed.altPhone || parsed.altContactPhone || '',
                        email: parsed.email || parsed.contactEmail || '',
                        altEmail: parsed.altEmail || parsed.altContactEmail || '',
                        location: parsed.location || parsed.storeAddress || '',
                        hours: parsed.hours || parsed.supportHours || '',
                        altHours: parsed.altHours || parsed.altSupportHours || '',
                        googleMapUrl: parsed.googleMapUrl || parsed.mapEmbedUrl || '',
                    });
                }
            } catch (e) { }
        };

        const handleCustomUpdate = (e) => {
            if (e.detail) {
                setContactInfo({
                    phone: e.detail.phone || e.detail.contactPhone || '',
                    altPhone: e.detail.altPhone || e.detail.altContactPhone || '',
                    email: e.detail.email || e.detail.contactEmail || '',
                    altEmail: e.detail.altEmail || e.detail.altContactEmail || '',
                    location: e.detail.location || e.detail.storeAddress || '',
                    hours: e.detail.hours || e.detail.supportHours || '',
                    altHours: e.detail.altHours || e.detail.altSupportHours || '',
                    googleMapUrl: e.detail.googleMapUrl || e.detail.mapEmbedUrl || '',
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

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        if (errorMsg) setErrorMsg('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
            setErrorMsg('Please fill in all required fields (Name, Email, and Message).');
            return;
        }

        setLoading(true);

        // Save message locally to admin inbox / inquiries in localStorage
        try {
            const savedInquiries = JSON.parse(localStorage.getItem('rs_gifts_inquiries') || '[]');
            const newInquiry = {
                id: 'inq-' + Date.now(),
                ...formData,
                date: new Date().toISOString(),
                status: 'Unread'
            };
            savedInquiries.unshift(newInquiry);
            localStorage.setItem('rs_gifts_inquiries', JSON.stringify(savedInquiries));
        } catch (e) {
            console.warn('Could not save inquiry locally:', e);
        }

        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
        }, 600);
    };

    return (
        <div className="w-full bg-[#FFF9F5] py-6 sm:py-9 font-sans select-none min-h-[85vh]">
            <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">

                {/* Page Header */}
                <div className="space-y-1 pt-1">
                    <h1
                        className="text-2xl sm:text-3xl md:text-[34px] font-bold text-[#29252A] tracking-tight"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                        Contact Us
                    </h1>
                    <p className="text-xs sm:text-[13.5px] text-[#6F6870] mt-1 max-w-2xl leading-relaxed">
                        Have a question about a gift, order, delivery, or anything else? Our team is here to help.
                    </p>
                </div>

                {/* Top 2-Card Grid: Get in Touch & Send Us a Message */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* Left Card: Get in Touch */}
                    <div className="lg:col-span-4 xl:col-span-4 bg-[#FFFFFF] rounded-3xl p-6 sm:p-7 border border-[#ECE7EC] shadow-xs flex flex-col space-y-5">
                        <div>
                            {/* Title without divider line */}
                            <div className="mb-3">
                                <h2
                                    className="text-lg sm:text-xl font-bold text-[#29252A]"
                                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                                >
                                    Get in Touch
                                </h2>
                                <p className="text-xs text-[#6F6870] mt-1.5 leading-relaxed">
                                    We're always happy to help! Reach out to us through any of the following channels.
                                </p>
                            </div>

                            {/* Channels List */}
                            <div className="space-y-4 pt-1">

                                {/* 1. Visit Our Store */}
                                {contactInfo.location && (
                                    <div className="flex items-start gap-3.5">
                                        <div className="w-11 h-11 rounded-full bg-[#FDF2F4] text-[#C9A45C] flex items-center justify-center shrink-0 border border-[#DFC8D0]/50 shadow-2xs">
                                            <MapPin size={20} strokeWidth={2} />
                                        </div>
                                        <div>
                                            <h3 className="text-xs sm:text-[13px] font-bold text-[#29252A]">
                                                Visit Our Store
                                            </h3>
                                            <p className="text-[11.5px] text-[#6F6870] mt-0.5 leading-snug">
                                                {contactInfo.location}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* 2. Call Us */}
                                {(contactInfo.phone || contactInfo.altPhone) && (
                                    <div className="flex items-start gap-3.5">
                                        <div className="w-11 h-11 rounded-full bg-[#FDF2F4] text-[#C9A45C] flex items-center justify-center shrink-0 border border-[#DFC8D0]/50 shadow-2xs">
                                            <Phone size={19} strokeWidth={2} />
                                        </div>
                                        <div>
                                            <h3 className="text-xs sm:text-[13px] font-bold text-[#29252A]">
                                                Call Us
                                            </h3>
                                            <div className="mt-0.5 space-y-0.5 text-[11.5px] text-[#6F6870]">
                                                {contactInfo.phone && (
                                                    <p>
                                                        <a
                                                            href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`}
                                                            className="hover:text-[#821D38] transition-colors"
                                                        >
                                                            {contactInfo.phone}
                                                        </a>
                                                    </p>
                                                )}
                                                {contactInfo.altPhone && (
                                                    <p>
                                                        <a
                                                            href={`tel:${contactInfo.altPhone.replace(/\s+/g, '')}`}
                                                            className="hover:text-[#821D38] transition-colors"
                                                        >
                                                            {contactInfo.altPhone}
                                                        </a>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 3. Email Us */}
                                {(contactInfo.email || contactInfo.altEmail) && (
                                    <div className="flex items-start gap-3.5">
                                        <div className="w-11 h-11 rounded-full bg-[#FDF2F4] text-[#C9A45C] flex items-center justify-center shrink-0 border border-[#DFC8D0]/50 shadow-2xs">
                                            <Mail size={19} strokeWidth={2} />
                                        </div>
                                        <div>
                                            <h3 className="text-xs sm:text-[13px] font-bold text-[#29252A]">
                                                Email Us
                                            </h3>
                                            <div className="mt-0.5 space-y-0.5 text-[11.5px] text-[#6F6870]">
                                                {contactInfo.email && (
                                                    <p>
                                                        <a
                                                            href={`mailto:${contactInfo.email}`}
                                                            className="hover:text-[#821D38] transition-colors"
                                                        >
                                                            {contactInfo.email}
                                                        </a>
                                                    </p>
                                                )}
                                                {contactInfo.altEmail && (
                                                    <p>
                                                        <a
                                                            href={`mailto:${contactInfo.altEmail}`}
                                                            className="hover:text-[#821D38] transition-colors"
                                                        >
                                                            {contactInfo.altEmail}
                                                        </a>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 4. Working Hours */}
                                {(contactInfo.hours || contactInfo.altHours) && (
                                    <div className="flex items-start gap-3.5">
                                        <div className="w-11 h-11 rounded-full bg-[#FDF2F4] text-[#C9A45C] flex items-center justify-center shrink-0 border border-[#DFC8D0]/50 shadow-2xs">
                                            <Clock size={19} strokeWidth={2} />
                                        </div>
                                        <div>
                                            <h3 className="text-xs sm:text-[13px] font-bold text-[#29252A]">
                                                Working Hours
                                            </h3>
                                            <div className="mt-0.5 space-y-0.5 text-[11.5px] text-[#6F6870]">
                                                {contactInfo.hours && <p>{contactInfo.hours}</p>}
                                                {contactInfo.altHours && <p>{contactInfo.altHours}</p>}
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* Follow Us Social Icons Footer */}
                        <div className="pt-1 flex items-center gap-3">
                            <span className="text-xs font-bold text-[#29252A]">
                                Follow Us
                            </span>
                            <div className="flex items-center gap-2">
                                {/* Instagram */}
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    className="w-7.5 h-7.5 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center transition-transform hover:scale-110 shadow-2xs"
                                >
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>

                                {/* WhatsApp */}
                                <a
                                    href={`https://wa.me/${contactInfo.phone.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="WhatsApp"
                                    className="w-7.5 h-7.5 rounded-full bg-[#25D366] text-white flex items-center justify-center transition-transform hover:scale-110 shadow-2xs"
                                >
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                    </div>

                    {/* Right Card: Send Us a Message */}
                    <div className="lg:col-span-8 xl:col-span-8 bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#ECE7EC] shadow-xs relative overflow-hidden flex flex-col justify-between">
                        <div className="relative z-10">
                            {/* Heading without divider line */}
                            <div className="mb-6">
                                <h2
                                    className="text-lg sm:text-xl font-bold text-[#29252A]"
                                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                                >
                                    Send Us a Message
                                </h2>
                                <p className="text-xs text-[#6F6870] mt-1.5">
                                    Fill out the form below and we'll get back to you as soon as possible.
                                </p>
                            </div>

                            {submitted ? (
                                <div className="py-12 px-4 text-center space-y-4 animate-in fade-in duration-300">
                                    <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#15803D] flex items-center justify-center mx-auto shadow-xs">
                                        <CheckCircle2 size={36} />
                                    </div>
                                    <h3
                                        className="text-xl font-bold text-[#29252A]"
                                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                                    >
                                        Thank You for Reaching Out!
                                    </h3>
                                    <p className="text-xs sm:text-[13px] text-[#6F6870] max-w-md mx-auto leading-relaxed">
                                        Your message has been received by our gifting concierge team. We will review your request and get back to you within 24 hours.
                                    </p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="px-6 py-2.5 rounded-xl border border-[#821D38] text-[#821D38] hover:bg-[#FDF2F4] text-xs font-semibold transition-colors cursor-pointer"
                                    >
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {errorMsg && (
                                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                                            {errorMsg}
                                        </div>
                                    )}

                                    {/* Form Grid: Row 1 */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Full Name */}
                                        <div>
                                            <label className="block text-xs font-semibold text-[#29252A] mb-1.5">
                                                Full Name
                                            </label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C9A45C]">
                                                    <User size={15} />
                                                </span>
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleChange}
                                                    placeholder="Your full name"
                                                    required
                                                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#ECE7EC] focus:border-[#821D38] focus:ring-1 focus:ring-[#821D38] text-xs sm:text-[13px] text-[#29252A] placeholder-[#6F6870]/60 bg-white transition-all outline-none"
                                                />
                                            </div>
                                        </div>

                                        {/* Email Address */}
                                        <div>
                                            <label className="block text-xs font-semibold text-[#29252A] mb-1.5">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C9A45C]">
                                                    <Mail size={15} />
                                                </span>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="your@email.com"
                                                    required
                                                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#ECE7EC] focus:border-[#821D38] focus:ring-1 focus:ring-[#821D38] text-xs sm:text-[13px] text-[#29252A] placeholder-[#6F6870]/60 bg-white transition-all outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Grid: Row 2 */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Phone Number */}
                                        <div>
                                            <label className="block text-xs font-semibold text-[#29252A] mb-1.5">
                                                Phone Number
                                            </label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C9A45C]">
                                                    <Phone size={15} />
                                                </span>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="+91 98765 43210"
                                                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#ECE7EC] focus:border-[#821D38] focus:ring-1 focus:ring-[#821D38] text-xs sm:text-[13px] text-[#29252A] placeholder-[#6F6870]/60 bg-white transition-all outline-none"
                                                />
                                            </div>
                                        </div>

                                        {/* Subject */}
                                        <div>
                                            <label className="block text-xs font-semibold text-[#29252A] mb-1.5">
                                                Subject
                                            </label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C9A45C]">
                                                    <Tag size={15} />
                                                </span>
                                                <select
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-[#ECE7EC] focus:border-[#821D38] focus:ring-1 focus:ring-[#821D38] text-xs sm:text-[13px] text-[#29252A] bg-white transition-all outline-none appearance-none cursor-pointer"
                                                >
                                                    <option value="">Select a subject</option>
                                                    <option value="Order Inquiry & Tracking">Order Inquiry & Tracking</option>
                                                    <option value="Customization & Laser Engraving">Customization & Laser Engraving</option>
                                                    <option value="Same-Day & Express Delivery">Same-Day & Express Delivery</option>
                                                    <option value="Corporate & Bulk Gifting">Corporate & Bulk Gifting</option>
                                                    <option value="Payment & Billing Question">Payment & Billing Question</option>
                                                    <option value="Feedback & General Inquiry">Feedback & General Inquiry</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#6F6870]">
                                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Grid: Row 3 (Message Textarea) */}
                                    <div>
                                        <label className="block text-xs font-semibold text-[#29252A] mb-1.5">
                                            Message
                                        </label>
                                        <div className="relative">
                                            <span className="absolute top-3 left-3.5 pointer-events-none text-[#C9A45C]">
                                                <MessageSquare size={15} />
                                            </span>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows={4}
                                                placeholder="Type your message here..."
                                                required
                                                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#ECE7EC] focus:border-[#821D38] focus:ring-1 focus:ring-[#821D38] text-xs sm:text-[13px] text-[#29252A] placeholder-[#6F6870]/60 bg-white transition-all outline-none resize-none leading-relaxed"
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#821D38] hover:bg-[#6E162E] text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-98"
                                        >
                                            <Send size={15} />
                                            <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
                                        </button>
                                    </div>

                                </form>
                            )}
                        </div>

                    </div>

                </div>

                {/* Google Navigation Section (Comes directly below the forms, outside form divs, exact width of the 2 boxes combined) */}
                <div className="w-full bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#ECE7EC] shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <h2
                                className="text-lg sm:text-xl font-bold text-[#29252A]"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                            >
                                Google Navigation
                            </h2>
                            <p className="text-xs sm:text-[13px] text-[#6F6870] mt-1 leading-relaxed">
                                Find your way to our store with Google Maps navigation.
                            </p>
                        </div>
                        {contactInfo.googleMapUrl && (
                            <a
                                href={contactInfo.googleMapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#821D38] hover:underline"
                            >
                                <span>Open in Google Maps</span>
                            </a>
                        )}
                    </div>

                    {/* Navigation Container - Left empty for admin to configure */}
                    <div className="w-full h-[320px] sm:h-[400px] rounded-2xl overflow-hidden border border-[#ECE7EC] bg-[#FAF8FA] flex items-center justify-center relative">
                        {contactInfo.googleMapUrl ? (
                            <iframe
                                title="Google Navigation"
                                src={contactInfo.googleMapUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full h-full"
                            />
                        ) : (
                            <div className="text-center p-6 space-y-2.5">
                                <div className="w-12 h-12 rounded-full bg-[#FDF2F4] text-[#C9A45C] flex items-center justify-center mx-auto border border-[#DFC8D0]/50 shadow-2xs">
                                    <MapPin size={22} strokeWidth={2} />
                                </div>
                                <p className="text-sm font-semibold text-[#29252A]">
                                    Google Navigation Map
                                </p>
                                <p className="text-xs text-[#6F6870] max-w-sm mx-auto leading-relaxed">
                                    Google Navigation is currently empty. The store administrator can add the Google Maps navigation embed URL in the admin panel.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Contactus;
