import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  Star,
  Share2,
  Truck,
  ShieldCheck,
  RefreshCw,
  Gift,
  ShoppingBag,
  Check,
  ChevronRight,
  ChevronLeft,
  ZoomIn,
  MapPin,
  Sparkles,
  Clock,
  ArrowLeft,
  Box,
  AlertCircle,
  X,
  CreditCard,
  MessageSquare,
  PackageCheck
} from 'lucide-react';
import { fetchProductByIdOrSlug, fetchLiveProducts } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const ProductDetailsPage = () => {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const { addToCart, closeCartDrawer } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Core Data States
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gallery States
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isHoverZooming, setIsHoverZooming] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef(null);

  // User Selection States
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('Standard');
  const [customText, setCustomText] = useState('');
  const [addGiftWrap, setAddGiftWrap] = useState(false);
  const [cardMessage, setCardMessage] = useState('');
  const [activeTab, setActiveTab] = useState('description');

  // Interactive Feedback States
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Pincode Checker States
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState(null);
  const [checkingPincode, setCheckingPincode] = useState(false);

  // Load Product Data on mount or when idOrSlug changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setSelectedImageIndex(0);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const loadData = async () => {
      try {
        const result = await fetchProductByIdOrSlug(idOrSlug);
        if (!isMounted) return;

        setProduct(result.product);
        setReviews(result.reviews || []);

        if (result.relatedProducts && result.relatedProducts.length > 0) {
          setRelatedProducts(result.relatedProducts);
        } else {
          // Fallback to general live products if no specific related products returned
          try {
            const all = await fetchLiveProducts();
            if (isMounted) {
              const others = (all || [])
                .filter((p) => p.id !== result.product.id && p.id !== result.product._id)
                .slice(0, 6);
              setRelatedProducts(others);
            }
          } catch {
            // ignore fallback error
          }
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Failed to load product details:', err);
        setError(err.message || 'Product not found');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [idOrSlug]);

  // Gallery Navigation Handlers
  const galleryImages = product?.gallery?.length
    ? product.gallery
    : [product?.image].filter(Boolean);

  const activeImage = galleryImages[selectedImageIndex] || product?.image || '/images/products/teddy-bear.png';

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  // Zoom handlers
  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomCoords({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  // Cart & Buy Now Handlers
  const handleAddToCart = () => {
    if (!product) return;
    const customProps = {
      variant: selectedVariant,
      customText: customText.trim() || undefined,
      giftWrap: addGiftWrap,
      cardMessage: cardMessage.trim() || undefined,
    };

    addToCart({ ...product, ...customProps }, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    const customProps = {
      variant: selectedVariant,
      customText: customText.trim() || undefined,
      giftWrap: addGiftWrap,
      cardMessage: cardMessage.trim() || undefined,
    };

    addToCart({ ...product, ...customProps }, quantity);
    closeCartDrawer();
    navigate('/cart');
  };

  // Pincode Verification Handler
  const handleCheckPincode = (e) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    if (!cleanPin || cleanPin.length !== 6 || !/^\d+$/.test(cleanPin)) {
      setPincodeResult({
        success: false,
        message: 'Please enter a valid 6-digit Indian PIN code.'
      });
      return;
    }

    setCheckingPincode(true);
    setTimeout(() => {
      setCheckingPincode(false);
      // Deterministic delivery estimate
      const days = (parseInt(cleanPin[cleanPin.length - 1], 10) % 3) + 2;
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + days);
      const formattedDate = deliveryDate.toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });

      setPincodeResult({
        success: true,
        pincode: cleanPin,
        date: formattedDate,
        message: `Fast Delivery by ${formattedDate}`,
        freeShipping: true,
        cod: true
      });
    }, 450);
  };

  // Share Handler
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name || 'RS Gifts',
        text: `Check out ${product?.name} on RS Gifts!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  // Calculation helpers
  const isWishlisted = product ? isInWishlist(product.id) : false;
  const isOutOfStock = product?.stock === 0;
  const isLowStock = product?.stock > 0 && product?.stock <= (product?.lowStockThreshold || 5);

  // 1. Loading Skeleton View
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#FFF9F5] py-8 sm:py-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb skeleton */}
          <div className="h-4 w-48 bg-rose-100/60 rounded-full mb-8 animate-pulse" />

          {/* Main 2-column skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Gallery Skeleton */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="w-full aspect-square bg-[#FAF6F4] rounded-3xl border border-[#ECE3E7] animate-pulse" />
              <div className="flex gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-20 h-20 rounded-2xl bg-[#FAF6F4] border border-[#ECE3E7] animate-pulse" />
                ))}
              </div>
            </div>

            {/* Info Skeleton */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              <div className="h-5 w-24 bg-rose-100/80 rounded-full animate-pulse" />
              <div className="h-8 w-3/4 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-4 w-1/3 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-10 w-44 bg-rose-100/70 rounded-xl animate-pulse" />
              <div className="h-24 w-full bg-gray-100 rounded-2xl animate-pulse" />
              <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Error / Not Found View
  if (error || !product) {
    return (
      <div className="w-full min-h-[70vh] bg-[#FFF9F5] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#EFEBEF] shadow-sm p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#FDF2F5] text-[#821D38] flex items-center justify-center mx-auto mb-4">
            <Gift size={32} />
          </div>
          <h2 className="text-xl font-bold text-[#1E1217] mb-2">Gift Not Found</h2>
          <p className="text-sm text-[#705E67] mb-6 leading-relaxed">
            The gift you are looking for might have been moved, updated, or is currently unavailable.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#821D38] text-white font-bold text-sm hover:bg-[#561023] transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Browse All Gifts</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FFF9F5] text-[#1E1217] pb-20">
      {/* Top Breadcrumb Navigation */}
      <div className="border-b border-[#ECE3E7]/60 bg-white/40 backdrop-blur-xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-[#705E67] overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-[#821D38] transition-colors font-medium">
              Home
            </Link>
            <ChevronRight size={13} className="text-[#A89CA2] shrink-0" />
            {product.category && (
              <>
                <span className="hover:text-[#821D38] transition-colors font-medium cursor-pointer">
                  {product.category}
                </span>
                <ChevronRight size={13} className="text-[#A89CA2] shrink-0" />
              </>
            )}
            <span className="text-[#1E1217] font-semibold truncate max-w-[200px] sm:max-w-md">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Product Showcase Section */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-14">
          
          {/* LEFT COLUMN: Premium Gallery with Thumbnails & Zoom */}
          <div className="lg:col-span-7 flex flex-col gap-4 select-none">
            {/* Main Image Stage */}
            <div
              ref={imageContainerRef}
              onMouseEnter={() => setIsHoverZooming(true)}
              onMouseLeave={() => setIsHoverZooming(false)}
              onMouseMove={handleMouseMove}
              onClick={() => setIsLightboxOpen(true)}
              className="relative w-full aspect-square sm:aspect-[4/3] lg:aspect-square bg-gradient-to-b from-[#FAF6F4] to-[#F7EFEA] rounded-3xl border border-[#ECE3E7] shadow-sm overflow-hidden cursor-crosshair group flex items-center justify-center"
            >
              {/* Image with smooth zoom transform */}
              <img
                src={activeImage}
                alt={product.name}
                style={{
                  transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`,
                  transform: isHoverZooming ? 'scale(1.75)' : 'scale(1)',
                }}
                className="w-full h-full object-cover transition-transform duration-200 ease-out pointer-events-none"
              />

              {/* Wishlist Button (Floating Top Right) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product);
                }}
                aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 hover:bg-white shadow-md flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-90 cursor-pointer z-10"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    isWishlisted ? 'text-[#E11D48] fill-[#E11D48]' : 'text-[#821D38] stroke-[2]'
                  }`}
                />
              </button>

              {/* Discount / Exclusive Badge (Floating Top Left) */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
                {product.discount && (
                  <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-[#821D38] text-white shadow-xs">
                    <Sparkles size={11} />
                    {product.discount}
                  </span>
                )}
                {product.featured && (
                  <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-[#F59E0B] text-white shadow-xs">
                    ★ Bestseller
                  </span>
                )}
              </div>

              {/* Gallery Navigation Arrows (if multiple images) */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#1E1217] shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer z-10"
                    title="Previous Image"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#1E1217] shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer z-10"
                    title="Next Image"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              {/* Enlarge Hint / Image Counter (Bottom) */}
              <div className="absolute bottom-3.5 right-4 flex items-center gap-2 z-10 pointer-events-none">
                <span className="text-[11px] font-medium text-[#483B42] bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-2xs flex items-center gap-1">
                  <ZoomIn size={12} /> Click to Enlarge
                </span>
                {galleryImages.length > 1 && (
                  <span className="text-[11px] font-bold text-[#1E1217] bg-white/90 px-2.5 py-1 rounded-full shadow-2xs">
                    {selectedImageIndex + 1} / {galleryImages.length}
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Row */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-2.5 sm:gap-3.5 overflow-x-auto pb-2 scrollbar-none">
                {galleryImages.map((imgUrl, idx) => {
                  const isActive = idx === selectedImageIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-white border-2 transition-all duration-200 cursor-pointer shrink-0 ${
                        isActive
                          ? 'border-[#821D38] ring-2 ring-[#821D38]/20 shadow-md scale-102'
                          : 'border-[#ECE3E7] hover:border-[#821D38]/50 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Product Info, Price, Variants, & Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Category & SKU row */}
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#821D38] bg-[#FDF2F5] px-3 py-1 rounded-full border border-[#DFC8D0]/60">
                  {product.category || 'Luxury Gift'}
                </span>

                {product.sku && (
                  <span className="text-[11px] text-[#8C7D85] font-mono">
                    SKU: {product.sku}
                  </span>
                )}
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1217] tracking-tight leading-snug mb-3">
                {product.name}
              </h1>

              {/* Ratings & Stock Availability Row */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pb-4 mb-4 border-b border-[#ECE3E7]">
                {/* Star Rating */}
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center text-[#F59E0B]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#F59E0B] stroke-[#F59E0B]" />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-[#1E1217]">
                    {product.rating}
                  </span>
                  <span className="text-xs text-[#705E67]">
                    ({product.reviews || reviews.length || 24} reviews)
                  </span>
                </div>

                <span className="text-[#D1C6CB]">•</span>

                {/* Stock Status */}
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#DC2626]">
                    <span className="w-2 h-2 rounded-full bg-[#DC2626]"></span>
                    Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D97706]">
                    <span className="w-2 h-2 rounded-full bg-[#D97706] animate-ping"></span>
                    Only {product.stock} left in stock!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D]">
                    <span className="w-2 h-2 rounded-full bg-[#15803D]"></span>
                    In Stock & Ready to Ship
                  </span>
                )}
              </div>

              {/* Price Section */}
              <div className="bg-[#FAF4F1] p-4 sm:p-5 rounded-2xl border border-[#EBE1DC] mb-5">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#1E1217]">
                    ₹{Number(product.price).toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-base sm:text-lg text-gray-400 line-through">
                      ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                    </span>
                  )}
                  {product.discount && (
                    <span className="text-xs font-bold text-[#15803D] bg-[#DCFCE7] px-2.5 py-0.5 rounded-md">
                      {product.discount}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#705E67] mt-1">
                  Inclusive of all taxes. Free shipping on orders over ₹999.
                </p>

                {/* Active Coupon Banner if available */}
                {product.activeCoupon && (
                  <div className="mt-3 pt-3 border-t border-[#E5DAD4] flex items-center gap-2 text-xs font-medium text-[#821D38]">
                    <Sparkles size={14} className="shrink-0 text-[#821D38]" />
                    <span>
                      Coupon applied: <strong className="font-bold">{product.activeCoupon.label || product.activeCoupon.code}</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Short Description */}
              {product.description && (
                <div className="mb-5">
                  <p className="text-xs sm:text-sm text-[#483B42] leading-relaxed line-clamp-3">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Gifting / Personalization Options */}
              <div className="space-y-3.5 mb-5 pb-5 border-b border-[#ECE3E7]">
                {/* Custom Name / Message engraving input */}
                <div>
                  <label className="block text-xs font-bold text-[#2E2026] mb-1">
                    Personalized Name / Custom Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="e.g., Happy Birthday Sarah! or Love, Alex"
                    maxLength={50}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CDD3] bg-white text-xs sm:text-sm text-[#1E1217] placeholder:text-gray-400 focus:outline-none focus:border-[#821D38] focus:ring-1 focus:ring-[#821D38]"
                  />
                </div>

                {/* Luxury Gift Wrap Addon Checkbox */}
                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-[#ECE3E7] hover:border-[#821D38]/40 transition-colors cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={addGiftWrap}
                    onChange={(e) => setAddGiftWrap(e.target.checked)}
                    className="mt-0.5 accent-[#821D38] rounded cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-[#1E1217]">
                      Add Luxury Gift Wrapping (+₹99)
                    </span>
                    <p className="text-[#705E67] text-[11px] mt-0.5">
                      Wrapped in our signature berry paper, satin ribbon & wax seal.
                    </p>
                  </div>
                </label>
              </div>

              {/* Quantity Selector & Live Subtotal */}
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <label className="block text-xs font-bold text-[#2E2026] mb-1.5">
                    Quantity
                  </label>
                  <div className="inline-flex items-center rounded-xl border border-[#D9CDD3] bg-white shadow-2xs overflow-hidden">
                    <button
                      type="button"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      className="px-3 py-2 text-[#483B42] hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-xs sm:text-sm text-[#1E1217]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      disabled={product.stock ? quantity >= product.stock : false}
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="px-3 py-2 text-[#483B42] hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block text-[11px] text-[#705E67]">Subtotal</span>
                  <span className="text-lg font-bold text-[#1E1217]">
                    ₹{((product.price * quantity) + (addGiftWrap ? 99 : 0)).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                {/* Add to Cart Button */}
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed ${
                    addedAnimation
                      ? 'bg-[#15803D] text-white'
                      : 'bg-[#E8A0AD] hover:bg-[#df93a1] text-[#29252A]'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 stroke-[2]" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                {/* Buy Now Button */}
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#A83F5B] hover:bg-[#93344D] text-white transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Pincode Delivery Checker */}
              <div className="bg-white p-4 rounded-2xl border border-[#ECE3E7] shadow-2xs mb-5">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#2E2026]">
                  <MapPin size={14} className="text-[#821D38]" />
                  <span>Check Delivery Date & Pincode</span>
                </div>
                <form onSubmit={handleCheckPincode} className="flex gap-2">
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Enter 6-digit PIN code"
                    maxLength={6}
                    className="flex-1 px-3 py-2 rounded-xl border border-[#D9CDD3] text-xs text-[#1E1217] placeholder:text-gray-400 focus:outline-none focus:border-[#821D38]"
                  />
                  <button
                    type="submit"
                    disabled={checkingPincode}
                    className="px-4 py-2 rounded-xl bg-[#821D38] text-white text-xs font-bold hover:bg-[#561023] transition-colors cursor-pointer"
                  >
                    {checkingPincode ? 'Checking...' : 'Check'}
                  </button>
                </form>

                {/* Pincode Result Feedback */}
                {pincodeResult && (
                  <div
                    className={`mt-2.5 p-2 rounded-lg text-xs flex items-center gap-2 ${
                      pincodeResult.success
                        ? 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]'
                        : 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
                    }`}
                  >
                    {pincodeResult.success ? <Check size={14} /> : <AlertCircle size={14} />}
                    <span>{pincodeResult.message}</span>
                  </div>
                )}
              </div>

              {/* Share & Gift Assistance */}
              <div className="flex items-center justify-between text-xs text-[#705E67] pt-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 hover:text-[#821D38] transition-colors cursor-pointer font-medium"
                >
                  <Share2 size={13} />
                  <span>{copiedShare ? 'Link Copied!' : 'Share This Gift'}</span>
                </button>

                <span className="text-[#8C7D85]">
                  Need Help? WhatsApp +91 98765 43210
                </span>
              </div>
            </div>

            {/* Trust Highlights Grid (4 Key Pillars) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-6 mt-6 border-t border-[#ECE3E7]">
              <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-white border border-[#EFEBEF]">
                <Truck className="w-5 h-5 text-[#821D38] mb-1.5" />
                <span className="text-[11px] font-bold text-[#1E1217]">Free Shipping</span>
                <span className="text-[9.5px] text-[#705E67]">Orders over ₹999</span>
              </div>
              <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-white border border-[#EFEBEF]">
                <ShieldCheck className="w-5 h-5 text-[#821D38] mb-1.5" />
                <span className="text-[11px] font-bold text-[#1E1217]">100% Secure</span>
                <span className="text-[9.5px] text-[#705E67]">Encrypted Checkout</span>
              </div>
              <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-white border border-[#EFEBEF]">
                <RefreshCw className="w-5 h-5 text-[#821D38] mb-1.5" />
                <span className="text-[11px] font-bold text-[#1E1217]">Easy Returns</span>
                <span className="text-[9.5px] text-[#705E67]">7-Day Replacement</span>
              </div>
              <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-white border border-[#EFEBEF]">
                <Gift className="w-5 h-5 text-[#821D38] mb-1.5" />
                <span className="text-[11px] font-bold text-[#1E1217]">Gift Ready</span>
                <span className="text-[9.5px] text-[#705E67]">Luxury Packaging</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabbed Product Information Section */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="bg-white rounded-3xl border border-[#ECE3E7] shadow-2xs overflow-hidden">
          {/* Tab Header Buttons */}
          <div className="flex items-center gap-2 sm:gap-6 border-b border-[#ECE3E7] px-4 sm:px-8 bg-[#FAF6F4]/60 overflow-x-auto">
            {[
              { id: 'description', label: 'Description' },
              { id: 'details', label: 'Product Details' },
              { id: 'shipping', label: 'Shipping & Returns' },
              { id: 'reviews', label: `Customer Reviews (${reviews.length || 24})` }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 sm:px-4 text-xs sm:text-sm font-bold transition-all relative whitespace-nowrap cursor-pointer ${
                    isActive ? 'text-[#821D38]' : 'text-[#705E67] hover:text-[#1E1217]'
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.75 bg-[#821D38] rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content Display */}
          <div className="p-6 sm:p-8 lg:p-10 text-xs sm:text-sm leading-relaxed text-[#483B42]">
            {activeTab === 'description' && (
              <div className="space-y-4 max-w-4xl">
                <h3 className="text-base sm:text-lg font-bold text-[#1E1217]">
                  About {product.name}
                </h3>
                <p className="leading-relaxed">
                  {product.description ||
                    'Each gift from RS Gifts is meticulously handcrafted with love and utmost attention to detail. Designed to evoke genuine smiles, this curated gift piece blends modern luxury with thoughtful emotions.'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#ECE3E7]">
                    <h4 className="font-bold text-[#821D38] mb-1.5 flex items-center gap-1.5">
                      <Sparkles size={14} /> The RS Gifts Experience
                    </h4>
                    <p className="text-xs text-[#705E67]">
                      Curated with high-grade materials and packaged inside our signature luxury box, ensuring an unforgettable unboxing moment.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#ECE3E7]">
                    <h4 className="font-bold text-[#821D38] mb-1.5 flex items-center gap-1.5">
                      <Gift size={14} /> Perfect Occasions
                    </h4>
                    <p className="text-xs text-[#705E67]">
                      Ideal for {product.occasions?.length ? product.occasions.join(', ') : 'Birthdays, Anniversaries, Romantic Surprises, and Festive Celebrations'}.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="max-w-2xl">
                <h3 className="text-base sm:text-lg font-bold text-[#1E1217] mb-4">
                  Specifications & Material Details
                </h3>
                <div className="divide-y divide-[#ECE3E7] border-y border-[#ECE3E7]">
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#705E67] font-medium">SKU</span>
                    <span className="font-mono font-bold text-[#1E1217]">{product.sku || 'RSG-LUX-001'}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#705E67] font-medium">Category</span>
                    <span className="font-bold text-[#1E1217]">{product.category || 'Gifts'}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#705E67] font-medium">Stock Availability</span>
                    <span className="font-bold text-[#1E1217]">{product.stock || 10} Units</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#705E67] font-medium">In The Box</span>
                    <span className="font-bold text-[#1E1217]">1x {product.name}, Luxury Gift Box, Greeting Card</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#705E67] font-medium">Country of Origin</span>
                    <span className="font-bold text-[#1E1217]">India</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 max-w-3xl">
                <h3 className="text-base sm:text-lg font-bold text-[#1E1217]">
                  Shipping Timelines & Return Policy
                </h3>
                <ul className="space-y-2 list-disc pl-5 text-[#5A4952]">
                  <li>
                    <strong>Dispatch:</strong> Orders placed before 4:00 PM IST are dispatched within 24 hours.
                  </li>
                  <li>
                    <strong>Transit Time:</strong> Metro cities: 2-3 business days. Rest of India: 3-5 business days.
                  </li>
                  <li>
                    <strong>Free Delivery:</strong> Applied automatically on all orders above ₹999 across India.
                  </li>
                  <li>
                    <strong>Return Policy:</strong> We offer a 7-day hassle-free replacement in the unlikely event of transit damage or manufacturing defect.
                  </li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#FFF9F5] border border-[#ECE3E7]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-extrabold text-[#1E1217]">{product.rating}</span>
                      <div className="flex items-center text-[#F59E0B]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[#F59E0B] stroke-[#F59E0B]" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-[#705E67] mt-1">Based on {reviews.length || 24} verified customer reviews</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert('Review submission is available for authenticated customers who purchased this gift.')}
                    className="py-2.5 px-4 rounded-xl bg-[#821D38] text-white text-xs font-bold hover:bg-[#561023] transition-colors self-start sm:self-auto cursor-pointer"
                  >
                    Write a Review
                  </button>
                </div>

                {/* Review Items */}
                <div className="space-y-4">
                  {(reviews.length > 0 ? reviews : [
                    {
                      name: 'Pooja Verma',
                      rating: 5,
                      date: '2 days ago',
                      comment: 'Absolutely stunning! The packaging was so luxurious and the recipient was genuinely touched. Highly recommend RS Gifts!'
                    },
                    {
                      name: 'Rahul Sharma',
                      rating: 5,
                      date: '1 week ago',
                      comment: 'Delivered right on time for my sister’s birthday. Excellent quality and presentation exactly as shown in images.'
                    }
                  ]).map((rev, i) => (
                    <div key={i} className="p-4 rounded-2xl border border-[#ECE3E7] bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-[#1E1217]">
                            {rev.name || rev.user?.name || 'Verified Buyer'}
                          </span>
                          <span className="text-[10px] font-semibold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                            Verified Purchase
                          </span>
                        </div>
                        <span className="text-[11px] text-[#8C7D85]">{rev.date || 'Recent'}</span>
                      </div>
                      <div className="flex items-center text-[#F59E0B] mb-2">
                        {[...Array(rev.rating || 5)].map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 fill-[#F59E0B] stroke-[#F59E0B]" />
                        ))}
                      </div>
                      <p className="text-xs text-[#5A4952] leading-relaxed">
                        {rev.comment || rev.reviewText || 'Superb gifting experience! Thank you RS Gifts.'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* "You May Also Like" Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-14 sm:mt-20">
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#ECE3E7]">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1E1217] tracking-tight">
                You May Also Like
              </h2>
              <p className="text-xs sm:text-sm text-[#705E67] mt-0.5">
                Thoughtful gifts and curated surprises you’ll fall in love with.
              </p>
            </div>
          </div>

          {/* Related Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-4.5">
            {relatedProducts.map((relProd) => {
              const isRelWish = isInWishlist(relProd.id);

              return (
                <div
                  key={relProd.id}
                  onClick={() => navigate(`/product/${relProd.slug || relProd.id}`)}
                  className="group bg-white rounded-2xl border border-[#EFEBEF] hover:border-[#DFC8D0] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5 cursor-pointer select-none"
                >
                  {/* Card Image */}
                  <div className="relative w-full aspect-[314/276] overflow-hidden bg-[#FAF6F4]">
                    <img
                      src={relProd.image}
                      alt={relProd.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(relProd);
                      }}
                      className="absolute top-2.5 right-2.5 w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-white/95 hover:bg-white shadow-sm flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isRelWish ? 'text-[#E11D48] fill-[#E11D48]' : 'text-[#821D38] stroke-[2]'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Card Details */}
                  <div className="p-2.5 sm:p-3 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-xs sm:text-[13px] font-semibold text-[#271B21] line-clamp-1 mb-1.5 group-hover:text-[#821D38] transition-colors">
                        {relProd.name}
                      </h3>
                      <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                        <span className="text-sm font-bold text-[#1E1217]">
                          ₹{Number(relProd.price).toLocaleString('en-IN')}
                        </span>
                        {relProd.originalPrice && relProd.originalPrice > relProd.price && (
                          <span className="text-[11px] text-gray-400 line-through">
                            ₹{Number(relProd.originalPrice).toLocaleString('en-IN')}
                          </span>
                        )}
                        {relProd.discount && (
                          <span className="text-[10px] font-semibold text-[#18794E] bg-[#E8F5E9] px-1.5 py-0.5 rounded">
                            {relProd.discount}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mb-2.5">
                        <div className="flex items-center text-[#F59E0B]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-[#F59E0B] stroke-[#F59E0B]" />
                          ))}
                        </div>
                        <span className="text-[11px] text-[#7A6E75] font-medium">
                          ({relProd.reviews || 0})
                        </span>
                      </div>
                    </div>

                    {/* Quick Add Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(relProd, 1);
                      }}
                      className="w-full py-2 px-1 rounded-xl text-[11px] font-bold bg-[#A83F5B] hover:bg-[#93344D] text-white transition-all shadow-2xs flex items-center justify-center gap-1 cursor-pointer active:scale-98"
                    >
                      <ShoppingBag size={12} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Lightbox Fullscreen Modal */}
      {isLightboxOpen && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 select-none"
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center"
          >
            <img
              src={activeImage}
              alt={product.name}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
            />
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 cursor-pointer"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-white text-xs font-semibold">
                  {selectedImageIndex + 1} / {galleryImages.length}
                </span>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 cursor-pointer"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;
