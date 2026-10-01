import api from './api';

export const normalizeProduct = (p, activeCoupon = null) => {
  if (!p) return null;

  const originalPrice = p.price || 0;
  const salePrice = p.salePrice || p.price || 0;

  let discount = '';
  // Priority 1: Dynamic active coupon from backend (e.g. ₹200 OFF)
  if (activeCoupon && activeCoupon.discountValue) {
    const isFlat = activeCoupon.discountType === 'flat' || activeCoupon.discountType === 'fixed';
    discount = isFlat ? `₹${activeCoupon.discountValue} OFF` : `${activeCoupon.discountValue}% OFF`;
  } else if (p.activeCoupon && p.activeCoupon.discountValue) {
    const isFlat = p.activeCoupon.discountType === 'flat' || p.activeCoupon.discountType === 'fixed';
    discount = isFlat ? `₹${p.activeCoupon.discountValue} OFF` : `${p.activeCoupon.discountValue}% OFF`;
  } else if (p.discount) {
    discount = p.discount;
  } else if (p.salePrice && p.price > p.salePrice) {
    const pct = Math.round(((p.price - p.salePrice) / p.price) * 100);
    discount = pct + '% OFF';
  }

  let categories = ['All'];
  if (p.category) categories.push(p.category);
  if (p.targetPage && !categories.includes(p.targetPage)) {
    categories.push(p.targetPage);
  }
  if (Array.isArray(p.targetPages)) {
    p.targetPages.forEach((tp) => {
      if (tp && !categories.includes(tp)) categories.push(tp);
    });
  }
  if (Array.isArray(p.categories)) {
    p.categories.forEach((c) => {
      if (!categories.includes(c)) categories.push(c);
    });
  }
  if (Array.isArray(p.occasions)) {
    p.occasions.forEach((o) => {
      if (!categories.includes(o)) categories.push(o);
    });
  }

  const primaryImg = p.image || (Array.isArray(p.images) && p.images[0]) || '/images/products/teddy-bear.png';
  let gallery = [];
  if (Array.isArray(p.gallery) && p.gallery.length > 0) {
    gallery = p.gallery;
  } else if (Array.isArray(p.images) && p.images.length > 0) {
    gallery = p.images;
  } else if (primaryImg) {
    gallery = [primaryImg];
  }
  if (!gallery.includes(primaryImg)) {
    gallery.unshift(primaryImg);
  }

  return {
    id: p._id || p.id,
    _id: p._id || p.id,
    name: p.title || p.name || 'Untitled Gift',
    title: p.title || p.name || 'Untitled Gift',
    sku: p.sku || '',
    slug: p.slug || '',
    price: salePrice,
    originalPrice: p.salePrice ? p.price : (p.originalPrice || salePrice),
    discount,
    activeCoupon: activeCoupon || p.activeCoupon || null,
    rating: p.ratings?.average || p.rating || 4.9,
    reviews: p.ratings?.count || p.reviews || 0,
    image: primaryImg,
    gallery,
    category: p.category || '',
    targetPage: p.targetPage || (Array.isArray(p.targetPages) ? p.targetPages[0] : '') || '',
    targetPages: Array.isArray(p.targetPages) ? p.targetPages : (p.targetPage ? [p.targetPage] : []),
    occasions: Array.isArray(p.occasions) ? p.occasions : [],
    categories,
    stock: p.stock ?? 10,
    lowStockThreshold: p.lowStockThreshold ?? 5,
    featured: !!p.featured,
    description: p.description || '',
    personalization: p.personalization || {
      allowCustomText: false,
      customTextLabel: '',
      allowPhotoUpload: false,
      photoUploadRequired: false,
      allowGiftWrap: false,
      allowGreetingCard: false
    }
  };
};

export const fetchActiveCoupon = async () => {
  try {
    const data = await api.get('/customer/coupons/active');
    return data.activeCoupon || null;
  } catch (err) {
    console.warn('[RS-Gifts API] Could not fetch active coupon:', err.message);
    return null;
  }
};

export const fetchLiveProducts = async (params = {}) => {
  try {
    const data = await api.get('/customer/products', { params });
    const rawList = data.products || (Array.isArray(data) ? data : []);
    const activeCoupon = data.activeCoupon || null;
    return rawList.map((p) => normalizeProduct(p, activeCoupon));
  } catch (err) {
    console.warn('[RS-Gifts API] Backend unreachable, using fallback data:', err.message);
    throw err;
  }
};

export const fetchProductByIdOrSlug = async (idOrSlug) => {
  try {
    const data = await api.get(`/products/${idOrSlug}`);
    if (!data || !data.product) {
      throw new Error(data?.message || 'Product not found');
    }
    const coupon = await fetchActiveCoupon().catch(() => null);
    return {
      product: normalizeProduct(data.product, coupon),
      rawProduct: data.product,
      reviews: data.reviews || [],
      relatedProducts: (data.relatedProducts || []).map((p) => normalizeProduct(p, coupon)),
    };
  } catch (err) {
    console.warn('[RS-Gifts API] Direct product fetch failed, checking local sync:', err.message);

    // Fallback: check localStorage admin products if network / offline
    try {
      const savedAdmin = localStorage.getItem('rs_gifts_admin_clean_frame_v3');
      if (savedAdmin) {
        const parsed = JSON.parse(savedAdmin);
        const adminProds = parsed.products || [];
        const found = adminProds.find(
          (p) => p._id === idOrSlug || p.id === idOrSlug || p.slug === idOrSlug
        );
        if (found) {
          const norm = normalizeProduct(found);
          const related = adminProds
            .filter((p) => p._id !== found._id && p.id !== found.id)
            .slice(0, 4)
            .map((p) => normalizeProduct(p));
          return {
            product: norm,
            rawProduct: found,
            reviews: [],
            relatedProducts: related,
          };
        }
      }
    } catch {
      // ignore
    }

    throw err;
  }
};

export default {
  fetchLiveProducts,
  fetchActiveCoupon,
  fetchProductByIdOrSlug,
  normalizeProduct,
};
