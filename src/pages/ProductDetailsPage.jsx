import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  Star,
  Share2,
  Package,

  Gift,
  ShoppingBag,
  Check,
  ChevronRight,
  ChevronLeft,
  ZoomIn,
  Clock,
  ArrowLeft,
  Box,
  X,
  CreditCard,
  MessageSquare,
  PackageCheck
} from 'lucide-react';
import { fetchProductByIdOrSlug, fetchLiveProducts, submitProductReview } from '../services/productService';
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

  // Dynamic Customer Review Form States
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [customerReviewName, setCustomerReviewName] = useState('');
  const [customerReviewEmail, setCustomerReviewEmail] = useState('');
  const [customerReviewComment, setCustomerReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');
  const [reviewErrorMsg, setReviewErrorMsg] = useState('');

  const handleCustomerReviewSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = customerReviewName.trim();
    const trimmedComment = customerReviewComment.trim();

    if (!trimmedName || !trimmedComment) {
      setReviewErrorMsg('Please fill in your name and review comments.');
      return;
    }

    if (/^\s*rs\s*gifts?\s*$/i.test(trimmedName)) {
      setReviewErrorMsg('Please enter your personal name, not the store name.');
      return;
    }

    try {
      setIsSubmittingReview(true);
      setReviewErrorMsg('');
      setReviewSuccessMsg('');

      const prodId = product?._id || product?.id;
      const res = await submitProductReview({
        productId: prodId,
        rating: reviewRating,
        comment: trimmedComment,
        customerName: trimmedName,
        customerEmail: customerReviewEmail.trim()
      });

      const newRev = res?.review || {
        _id: 'rev_' + Date.now(),
        customerName: trimmedName,
        rating: reviewRating,
        comment: trimmedComment,
        createdAt: new Date().toISOString(),
        isApproved: true
      };

      setReviews((prev) => [newRev, ...prev]);
      setCustomerReviewComment('');
      setReviewSuccessMsg('Thank you! Your review has been submitted and is now published.');
      setIsReviewFormOpen(false);
    } catch (err) {
      console.error('Failed to submit review:', err);
      setReviewErrorMsg(err.message || 'Could not submit review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Dynamically calculated rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
    : (product?.rating || '5.0');



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

  const activeImage = galleryImages[selectedImageIndex] || product?.image || '';

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
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


  // Share Handler
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name || 'RS Gifts',
        text: `Check out ${product?.name} on RS Gifts!`,
        url: window.location.href,
      }).catch(() => { });
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb skeleton */}
          <div className="h-4 w-48 bg-rose-100/60 rounded-full mb-8 animate-pulse" />

          {/* Main 2-column skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Gallery Skeleton */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="w-full aspect-square max-h-[420px] bg-[#FAF6F4] rounded-2xl border border-[#ECE3E7] animate-pulse" />
              <div className="flex gap-2.5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#FAF6F4] border border-[#ECE3E7] animate-pulse" />
                ))}
              </div>
            </div>

            {/* Info Skeleton */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="h-4 w-24 bg-rose-100/80 rounded-full animate-pulse" />
              <div className="h-6 w-3/4 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-4 w-1/3 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-9 w-40 bg-rose-100/70 rounded-xl animate-pulse" />
              <div className="h-20 w-full bg-gray-100 rounded-xl animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse" />
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
            The gift your looking for is not available right now try best gifts from our premium collections
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
      {/* Top Breadcrumb Navigation */}
      <div className="border-b border-[#ECE3E7]/60 bg-white/40 backdrop-blur-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
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
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-start">

          {/* LEFT COLUMN: Gallery with Thumbnails (Clean & Compact) */}
          <div className="lg:col-span-5 flex flex-col gap-3 select-none">
            {/* Main Image Stage */}
            <div
              onClick={() => setIsLightboxOpen(true)}
              className="relative w-full aspect-square max-h-[380px] sm:max-h-[420px] bg-gradient-to-b from-[#FAF6F4] to-[#F7EFEA] rounded-2xl border border-[#ECE3E7] shadow-xs overflow-hidden cursor-pointer group flex items-center justify-center"
            >
              {/* Product Image - Clean static view without hover zoom enlargement */}
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover pointer-events-none"
              />

              {/* Wishlist Button (Floating Top Right) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product);
                }}
                aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 hover:bg-white shadow-sm flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-90 cursor-pointer z-10"
              >
                <Heart
                  className={`w-4.5 h-4.5 transition-colors ${isWishlisted ? 'text-[#E11D48] fill-[#E11D48]' : 'text-[#821D38] stroke-[2]'
                    }`}
                />
              </button>

              {/* Exclusive / Bestseller Badge (Floating Top Left) */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
                {product.featured && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F59E0B] text-white shadow-xs">
                    <Star size={10} className="fill-white" /> Bestseller
                  </span>
                )}
              </div>

              {/* Gallery Navigation Arrows (if multiple images) */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#1E1217] shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer z-10"
                    title="Previous Image"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#1E1217] shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer z-10"
                    title="Next Image"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}

              {/* Enlarge Hint / Image Counter (Bottom) */}
              <div className="absolute bottom-2.5 right-3 flex items-center gap-1.5 z-10 pointer-events-none">
                <span className="text-[10px] font-medium text-[#483B42] bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
                  <ZoomIn size={11} /> Click to view
                </span>
                {galleryImages.length > 1 && (
                  <span className="text-[10px] font-bold text-[#1E1217] bg-white/90 px-2 py-0.5 rounded-full shadow-2xs">
                    {selectedImageIndex + 1} / {galleryImages.length}
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Row */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {galleryImages.map((imgUrl, idx) => {
                  const isActive = idx === selectedImageIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-white border-2 transition-all duration-200 cursor-pointer shrink-0 ${isActive
                        ? 'border-[#821D38] ring-2 ring-[#821D38]/20 shadow-xs'
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
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Category */}
              <div className="mb-2">
                <span className="inline-flex items-center gap-1 text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-[#821D38] bg-[#FDF2F5] px-2.5 py-0.5 rounded-full border border-[#DFC8D0]/60">
                  {product.category || 'Luxury Gift'}
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-xl sm:text-2xl font-bold text-[#1E1217] tracking-tight leading-snug mb-2.5">
                {product.name}
              </h1>


              {/* Price Section */}
              <div className="bg-[#FAF4F1] p-3 sm:p-3.5 rounded-xl border border-[#EBE1DC] mb-3.5">
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <span className="text-xl sm:text-2xl font-extrabold text-[#1E1217]">
                    ₹{Number(product.price).toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                    </span>
                  )}
                  {product.discount && (
                    <span className="text-[11px] font-bold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-md">
                      {product.discount}
                    </span>
                  )}
                </div>
                <p className="text-[10.5px] text-[#705E67] mt-0.5">
                  Inclusive of all taxes. Free shipping on orders over ₹999.
                </p>
              </div>

              {/* Short Description */}
              {product.description && (
                <div className="mb-3.5">
                  <p className="text-xs text-[#483B42] leading-relaxed line-clamp-3">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Quantity Selector & Live Subtotal */}
              <div className="flex items-center justify-between gap-4 mb-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#2E2026] mb-1">
                    Quantity
                  </label>
                  <div className="inline-flex items-center rounded-lg border border-[#D9CDD3] bg-white shadow-2xs overflow-hidden">
                    <button
                      type="button"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      className="px-2.5 py-1.5 text-[#483B42] hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors font-bold cursor-pointer text-xs"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-xs text-[#1E1217]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      disabled={product.stock ? quantity >= product.stock : false}
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="px-2.5 py-1.5 text-[#483B42] hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors font-bold cursor-pointer text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block text-[10.5px] text-[#705E67]">Subtotal</span>
                  <span className="text-base font-bold text-[#1E1217]">
                    ₹{(product.price * quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3.5">
                {/* Add to Cart Button */}
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={`w-full py-2.5 sm:py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed ${addedAnimation
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
                  className="w-full py-2.5 sm:py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#A83F5B] hover:bg-[#93344D] text-white transition-all duration-200 shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Share & Gift Assistance */}
              <div className="flex items-center justify-between text-[11px] text-[#705E67] pt-1">
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

            
          </div>
        </div>
      </section>

      {/* Tabbed Product Information Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14">
        <div className="bg-white rounded-2xl border border-[#ECE3E7] shadow-2xs overflow-hidden">
          {/* Tab Header Buttons */}
          <div className="flex items-center gap-2 sm:gap-6 border-b border-[#ECE3E7] px-4 sm:px-8 bg-[#FAF6F4]/60 overflow-x-auto">
            {[
              { id: 'description', label: 'Description' },
              { id: 'details', label: 'Product Details' },
              { id: 'shipping', label: 'Shipping & Returns' },
              { id: 'reviews', label: `Customer Reviews (${reviews.length})` }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 sm:px-4 text-xs sm:text-sm font-bold transition-all relative whitespace-nowrap cursor-pointer ${isActive ? 'text-[#821D38]' : 'text-[#705E67] hover:text-[#1E1217]'
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
              product.description ? (
                <div className="space-y-4 max-w-4xl">
                  <h3 className="text-base sm:text-lg font-bold text-[#1E1217]">
                    About {product.name}
                  </h3>
                  <div className="leading-relaxed whitespace-pre-line text-sm sm:text-base text-[#5C4A52]">
                    {product.description}
                  </div>
                </div>
              ) : null
            )}

            {activeTab === 'details' && (
              <div className="max-w-2xl space-y-6">
                {product.inTheBox ? (
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#1E1217] mb-3">
                      In The Box / Package Contents
                    </h3>
                    <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#ECE3E7] flex items-start gap-3">
                      <Package className="w-5 h-5 text-[#821D38] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-[#1E1217]">
                          {product.inTheBox}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1E1217] mb-3">
                    Specifications & Material Details
                  </h3>
                  <div className="divide-y divide-[#ECE3E7] border-y border-[#ECE3E7]">
                    <div className="py-2.5 flex justify-between">
                      <span className="text-[#705E67] font-medium">Category</span>
                      <span className="font-bold text-[#1E1217]">{product.category || 'Gifts'}</span>
                    </div>
                    {product.specifications?.material && (
                      <div className="py-2.5 flex justify-between">
                        <span className="text-[#705E67] font-medium">Material</span>
                        <span className="font-bold text-[#1E1217]">{product.specifications.material}</span>
                      </div>
                    )}
                    {product.specifications?.dimensions && (
                      <div className="py-2.5 flex justify-between">
                        <span className="text-[#705E67] font-medium">Dimensions</span>
                        <span className="font-bold text-[#1E1217]">{product.specifications.dimensions}</span>
                      </div>
                    )}
                    {product.specifications?.weight && (
                      <div className="py-2.5 flex justify-between">
                        <span className="text-[#705E67] font-medium">Weight</span>
                        <span className="font-bold text-[#1E1217]">{product.specifications.weight}</span>
                      </div>
                    )}
                    {product.specifications?.color && (
                      <div className="py-2.5 flex justify-between">
                        <span className="text-[#705E67] font-medium">Color / Finish</span>
                        <span className="font-bold text-[#1E1217]">{product.specifications.color}</span>
                      </div>
                    )}
                    <div className="py-2.5 flex justify-between">
                      <span className="text-[#705E67] font-medium">Country of Origin</span>
                      <span className="font-bold text-[#1E1217]">{product.specifications?.countryOfOrigin || 'India'}</span>
                    </div>
                    {product.specifications?.careInstructions && (
                      <div className="py-2.5 flex justify-between">
                        <span className="text-[#705E67] font-medium">Care Instructions</span>
                        <span className="font-bold text-[#1E1217]">{product.specifications.careInstructions}</span>
                      </div>
                    )}
                    {Array.isArray(product.specifications?.customSpecs) &&
                      product.specifications.customSpecs.map((spec, idx) => (
                        <div key={idx} className="py-2.5 flex justify-between">
                          <span className="text-[#705E67] font-medium">{spec.key}</span>
                          <span className="font-bold text-[#1E1217]">{spec.value}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 max-w-3xl">
                <h3 className="text-base sm:text-lg font-bold text-[#1E1217]">
                  Shipping Timelines & Return Policy
                </h3>
                <ul className="space-y-2.5 list-disc pl-5 text-[#5A4952]">
                  <li>
                    <strong>Dispatch:</strong>{' '}
                    {product.shippingDetails?.dispatchTimeline ||
                      'Orders placed before 4:00 PM IST are dispatched within 24 hours.'}
                  </li>
                  <li>
                    <strong>Transit Time:</strong>{' '}
                    {product.shippingDetails?.transitTimeline ||
                      'Metro cities: 2-3 business days. Rest of India: 3-5 business days.'}
                  </li>
                  <li>
                    <strong>Free Delivery:</strong>{' '}
                    {product.shippingDetails?.freeShippingNote ||
                      'Applied automatically on all orders above ₹999 across India.'}
                  </li>
                  <li>
                    <strong>Return Policy:</strong>{' '}
                    {product.shippingDetails?.returnPolicy ||
                      'We offer a 7-day hassle-free replacement in the unlikely event of transit damage or manufacturing defect.'}
                  </li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6 max-w-4xl">
                {/* Header Rating Box & Write Review Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#FFF9F5] border border-[#ECE3E7]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-extrabold text-[#1E1217]">{averageRating}</span>
                      <div className="flex items-center text-[#C9A45C]">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.round(Number(averageRating))
                              ? 'fill-[#C9A45C] stroke-[#C9A45C]'
                              : 'text-gray-300 stroke-gray-300'
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-[#705E67] mt-1">
                      {reviews.length > 0
                        ? `Based on ${reviews.length} customer review${reviews.length > 1 ? 's' : ''}`
                        : 'No reviews yet for this product. Be the first to share your thoughts!'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsReviewFormOpen((prev) => !prev);
                      setReviewErrorMsg('');
                      setReviewSuccessMsg('');
                    }}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#821D38] hover:bg-[#68132B] text-white text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto"
                  >
                    <Star className="w-4 h-4 fill-white" />
                    <span>{isReviewFormOpen ? 'Close Form' : 'Write a Review'}</span>
                  </button>
                </div>

                {/* Review Success Alert */}
                {reviewSuccessMsg && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between">
                    <span>{reviewSuccessMsg}</span>
                    <button
                      type="button"
                      onClick={() => setReviewSuccessMsg('')}
                      className="text-emerald-700 hover:text-emerald-900 font-bold ml-2 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Dynamic Customer Review Submission Form */}
                {isReviewFormOpen && (
                  <form
                    onSubmit={handleCustomerReviewSubmit}
                    className="p-5 rounded-2xl bg-[#FFFDFD] border border-[#821D38]/30 shadow-md space-y-4 animate-fade-in"
                  >
                    <div className="flex items-center justify-between border-b border-[#ECE3E7] pb-3">
                      <div>
                        <h4 className="text-sm font-bold text-[#1E1217]">Write a Customer Review</h4>
                        <p className="text-xs text-[#705E67] mt-0.5">
                          Share your honest feedback to help fellow gift shoppers.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsReviewFormOpen(false)}
                        className="text-xs text-[#8C7D85] hover:text-[#1E1217] cursor-pointer"
                      >
                        ✕ Cancel
                      </button>
                    </div>

                    {reviewErrorMsg && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                        {reviewErrorMsg}
                      </div>
                    )}

                    {/* Interactive Star Rating */}
                    <div>
                      <label className="block text-xs font-bold text-[#1E1217] mb-1.5">
                        Your Rating <span className="text-[#821D38]">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="p-1 cursor-pointer transition-transform hover:scale-110"
                            >
                              <Star
                                className={`w-5 h-5 ${star <= (hoverRating || reviewRating)
                                  ? 'fill-[#C9A45C] text-[#C9A45C]'
                                  : 'text-gray-300 stroke-gray-300'
                                  }`}
                              />
                            </button>
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-[#821D38] ml-2">
                          {reviewRating} of 5 Stars
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#1E1217] mb-1">
                          Your Name <span className="text-[#821D38]"></span>
                        </label>
                        <input
                          type="text"
                          required
                          value={customerReviewName}
                          onChange={(e) => setCustomerReviewName(e.target.value)}
                          placeholder="e.g. Pooja Verma"
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#ECE3E7] bg-white text-[#1E1217] placeholder-[#A89FA4] focus:outline-none focus:border-[#821D38] focus:ring-1 focus:ring-[#821D38]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1E1217] mb-1">
                          Your Email <span className="text-[11px] font-normal text-[#8C7D85]">(Optional, kept private)</span>
                        </label>
                        <input
                          type="email"
                          value={customerReviewEmail}
                          onChange={(e) => setCustomerReviewEmail(e.target.value)}
                          placeholder="e.g. pooja@example.com"
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#ECE3E7] bg-white text-[#1E1217] placeholder-[#A89FA4] focus:outline-none focus:border-[#821D38] focus:ring-1 focus:ring-[#821D38]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1E1217] mb-1">
                        Your Review & Experience <span className="text-[#821D38]">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={customerReviewComment}
                        onChange={(e) => setCustomerReviewComment(e.target.value)}
                        placeholder="Tell other shoppers what you liked about the quality, gift box, or presentation..."
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#ECE3E7] bg-white text-[#1E1217] placeholder-[#A89FA4] focus:outline-none focus:border-[#821D38] focus:ring-1 focus:ring-[#821D38] resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsReviewFormOpen(false)}
                        className="px-4 py-2 rounded-xl border border-[#ECE3E7] text-xs font-semibold text-[#705E67] hover:text-[#1E1217] cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingReview}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#821D38] hover:bg-[#68132B] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                      >
                        {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Customer Reviews List */}
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((rev, i) => {
                      let reviewerName = (rev.customerName || rev.name || rev.user?.name || '').trim();
                      if (!reviewerName || /^\s*rs\s*gifts?\s*$/i.test(reviewerName)) {
                        reviewerName = 'Verified Customer';
                      }
                      const reviewDate = rev.createdAt
                        ? new Date(rev.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })
                        : rev.date || '';
                      const stars = Math.min(5, Math.max(1, Number(rev.rating) || 5));

                      return (
                        <div key={rev._id || rev.id || i} className="p-4 rounded-2xl border border-[#ECE3E7] bg-white shadow-xs">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-xs sm:text-sm text-[#1E1217]">
                              {reviewerName}
                            </span>
                            {reviewDate && (
                              <span className="text-[11px] text-[#8C7D85]">{reviewDate}</span>
                            )}
                          </div>
                          <div className="flex items-center text-[#C9A45C] mb-2">
                            {[...Array(stars)].map((_, idx) => (
                              <Star key={idx} className="w-3.5 h-3.5 fill-[#C9A45C] stroke-[#C9A45C]" />
                            ))}
                          </div>
                          <p className="text-xs text-[#5A4952] leading-relaxed">
                            {rev.comment || rev.reviewText}
                          </p>
                          {rev.adminReply && (
                            <div className="mt-3 p-3 rounded-xl bg-[#FAF6F4] border-l-3 border-[#821D38] text-xs">
                              <span className="font-bold text-[#821D38] block mb-0.5">RS Gifts Response:</span>
                              <p className="text-[#5A4952]">{rev.adminReply}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10 px-4 rounded-2xl border border-dashed border-[#ECE3E7] bg-[#FAF8F7]">
                    <div className="w-12 h-12 rounded-full bg-[#FDF2F5] text-[#821D38] flex items-center justify-center mx-auto mb-3">
                      <MessageSquare size={20} />
                    </div>
                    <h4 className="text-sm font-bold text-[#1E1217] mb-1">No reviews yet</h4>
                    <p className="text-xs text-[#705E67] max-w-sm mx-auto mb-4">
                      Be the first to share your experience with this gift!
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsReviewFormOpen(true);
                        setReviewErrorMsg('');
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#821D38] hover:bg-[#68132B] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5 fill-white" />
                      <span>Write the First Review</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* "You May Also Like" Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
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
                        className={`w-4 h-4 transition-colors ${isRelWish ? 'text-[#E11D48] fill-[#E11D48]' : 'text-[#821D38] stroke-[2]'
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
                      <div className="flex items-center gap-0.5 mb-2.5" title={`Rated ${relProd.rating || 5} out of 5 stars`}>
                        {[1, 2, 3, 4, 5].map((starIndex) => {
                          const isGold = starIndex <= Math.round(Number(relProd.rating || 5));
                          return (
                            <Star
                              key={starIndex}
                              className={`w-3 h-3 ${
                                isGold
                                  ? 'fill-[#C9A45C] text-[#C9A45C] stroke-[#C9A45C]'
                                  : 'fill-[#E8DFD8] text-[#D4C8BF] stroke-[#D4C8BF]'
                              }`}
                            />
                          );
                        })}
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
