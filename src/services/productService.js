import api from './api';

export const normalizeProduct = (p, activeCoupon = null) => {
  if (!p) return null;

  const regPrice = Number(p.originalPrice || p.price || 0);
  const rawSale = p.salePrice !== undefined && p.salePrice !== null && p.salePrice !== '' ? Number(p.salePrice) : null;
  const hasOffer = p.hasOffer !== undefined
    ? Boolean(p.hasOffer)
    : (rawSale !== null && rawSale > 0 && rawSale < regPrice);

  const finalSellingPrice = hasOffer ? (rawSale || Number(p.price || 0)) : (Number(p.price || 0) || regPrice);
  const finalOriginalPrice = hasOffer ? (regPrice > finalSellingPrice ? regPrice : Number(p.price || 0)) : finalSellingPrice;
  const discountPercent = p.discountPercent || (hasOffer && finalOriginalPrice > finalSellingPrice
    ? Math.round(((finalOriginalPrice - finalSellingPrice) / finalOriginalPrice) * 100)
    : 0);
  const savingsAmount = p.savingsAmount || (hasOffer ? (finalOriginalPrice - finalSellingPrice) : 0);
  const discount = p.discount || (hasOffer ? `${discountPercent}% OFF` : '');
  const offerTag = p.offerTag || (hasOffer ? `${discountPercent}% OFF` : '');

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

  const primaryImg = p.image || (Array.isArray(p.images) && p.images[0]) || '';
  let gallery = [];
  if (Array.isArray(p.gallery) && p.gallery.length > 0) {
    gallery = p.gallery.filter(Boolean);
  } else if (Array.isArray(p.images) && p.images.length > 0) {
    gallery = p.images.filter(Boolean);
  } else if (primaryImg) {
    gallery = [primaryImg];
  }
  if (primaryImg && !gallery.includes(primaryImg)) {
    gallery.unshift(primaryImg);
  }

  return {
    id: p._id || p.id,
    _id: p._id || p.id,
    name: p.title || p.name || 'Untitled Gift',
    title: p.title || p.name || 'Untitled Gift',
    sku: p.sku || '',
    slug: p.slug || '',
    price: finalSellingPrice,
    originalPrice: finalOriginalPrice,
    salePrice: rawSale,
    hasOffer,
    discountPercent,
    savingsAmount,
    discount,
    offerTag,
    activeCoupon: activeCoupon || p.activeCoupon || null,
    rating: Number(p.ratings?.average !== undefined && p.ratings.average !== null ? p.ratings.average : (p.rating !== undefined && p.rating !== null ? p.rating : 5)),
    reviews: Number(p.ratings?.count !== undefined ? p.ratings.count : (p.reviews !== undefined ? p.reviews : 0)),
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
    experienceTitle: p.experienceTitle || 'The RS Gifts Experience',
    experienceText: p.experienceText || '',
    inTheBox: p.inTheBox || '',
    specifications: p.specifications || {},
    shippingDetails: p.shippingDetails || {},
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
  let list = [];
  let activeCoupon = null;
  try {
    const queryParams = { limit: 100, ...params };
    const data = await api.get('/customer/products', { params: queryParams });
    const rawList = data.products || (Array.isArray(data) ? data : []);
    activeCoupon = data.activeCoupon || null;
    list = rawList.map((p) => normalizeProduct(p, activeCoupon));
  } catch (err) {
    console.warn('[RS-Gifts API] Backend unreachable, checking local fallback:', err.message);
  }

  // Cross-origin / localStorage synchronization with Admin portal
  try {
    const savedAdmin = localStorage.getItem('rs_gifts_admin_clean_frame_v3');
    if (savedAdmin) {
      const parsed = JSON.parse(savedAdmin);
      const adminProds = (parsed.products || []).filter((p) => p && p.active !== false);
      const existingIds = new Set(list.map((p) => String(p.id || p._id || p.productId || p.sku)));
      adminProds.forEach((ap) => {
        const id = String(ap.id || ap._id || ap.productId || ap.sku);
        if (!existingIds.has(id)) {
          list.unshift(normalizeProduct(ap, activeCoupon));
        }
      });
    }
  } catch {}

  // If search param provided, ensure products match terms
  if (params && params.search && String(params.search).trim()) {
    const terms = String(params.search).toLowerCase().trim().split(/[\s,+/_-]+/).filter(Boolean);
    list = list.filter((p) => {
      if (!p) return false;
      const haystack = [
        p.title,
        p.name,
        p.category,
        p.description,
        ...(Array.isArray(p.categories) ? p.categories : []),
        ...(Array.isArray(p.occasions) ? p.occasions : []),
      ].filter(Boolean).join(' ').toLowerCase();

      return terms.some((t) => {
        const base = t.replace(/(ies|es|s)$/, '');
        return haystack.includes(t) || (base.length >= 3 && haystack.includes(base));
      });
    });
  }

  return list;
};

export const fetchProductByIdOrSlug = async (idOrSlug) => {
  try {
    const data = await api.get(`/products/${idOrSlug}`);
    if (!data || !data.product) {
      throw new Error(data?.message || 'Product not found');
    }
    const coupon = await fetchActiveCoupon().catch(() => null);

    const sanitizeCustomerName = (name) => {
      const trimmed = (name || '').trim();
      if (!trimmed || /^\s*rs\s*gifts?\s*$/i.test(trimmed)) {
        return 'Verified Customer';
      }
      return trimmed;
    };

    // Only include admin-approved reviews and sanitize customer name
    const approvedReviews = (data.reviews || [])
      .filter((r) => r.isApproved === true)
      .map((r) => ({
        ...r,
        customerName: sanitizeCustomerName(r.customerName || r.name || r.user?.name),
      }));

    // Sync with Admin Panel approved reviews from localStorage
    try {
      const savedAdmin = localStorage.getItem('rs_gifts_admin_clean_frame_v3');
      if (savedAdmin) {
        const parsed = JSON.parse(savedAdmin);
        const adminApproved = (parsed.reviews || []).filter(
          (r) =>
            r.status === 'approved' &&
            (r.productId === data.product._id ||
              r.productId === data.product.id ||
              r.productTitle?.toLowerCase() === data.product.name?.toLowerCase())
        );
        const existingIds = new Set(approvedReviews.map((r) => r._id || r.id));
        adminApproved.forEach((ar) => {
          if (!existingIds.has(ar.id)) {
            approvedReviews.push({
              _id: ar.id,
              customerName: sanitizeCustomerName(ar.customerName),
              rating: ar.rating,
              comment: ar.comment,
              createdAt: ar.date,
              isApproved: true,
            });
          }
        });
      }
    } catch {
      // ignore
    }

    return {
      product: normalizeProduct(data.product, coupon),
      rawProduct: data.product,
      reviews: approvedReviews,
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
          const adminApproved = (parsed.reviews || [])
            .filter(
              (r) =>
                r.status === 'approved' &&
                (r.productId === found._id ||
                  r.productId === found.id ||
                  r.productTitle?.toLowerCase() === found.name?.toLowerCase() ||
                  r.productTitle?.toLowerCase() === found.title?.toLowerCase())
            )
            .map((r) => ({
              ...r,
              customerName: (r.customerName || '').trim() && !/^\s*rs\s*gifts?\s*$/i.test(r.customerName.trim())
                ? r.customerName.trim()
                : 'Verified Customer',
            }));
          return {
            product: norm,
            rawProduct: found,
            reviews: adminApproved,
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

export const fetchLiveCategories = async () => {
  let categories = [];
  try {
    const data = await api.get('/customer/categories');
    categories = data.categories || (Array.isArray(data) ? data : []);
  } catch (err) {
    try {
      const data = await api.get('/categories');
      categories = data.categories || (Array.isArray(data) ? data : []);
    } catch {}
  }

  // If backend returned empty or offline, check admin localStorage
  try {
    const savedAdmin = localStorage.getItem('rs_gifts_admin_clean_frame_v3');
    if (savedAdmin) {
      const parsed = JSON.parse(savedAdmin);
      if (Array.isArray(parsed.categories) && parsed.categories.length > 0) {
        const existingSlugs = new Set(categories.map((c) => (c.slug || '').toLowerCase()));
        parsed.categories.forEach((c) => {
          if (c && c.active !== false && !existingSlugs.has((c.slug || '').toLowerCase())) {
            categories.push(c);
          }
        });
      }
    }
  } catch {}

  return categories;
};

export const submitProductReview = async ({ productId, rating, comment, customerName, customerEmail }) => {
  return await api.post('/customer/reviews', {
    productId,
    rating,
    comment,
    customerName,
    customerEmail,
  });
};

export default {
  fetchLiveProducts,
  fetchLiveCategories,
  fetchActiveCoupon,
  fetchProductByIdOrSlug,
  normalizeProduct,
  submitProductReview,
};

export const fetchOfferProducts = async (params = {}) => {
  try {
    const data = await api.get('/customer/products', { params: { offersOnly: true, limit: 100, ...params } });
    const rawList = Array.isArray(data.products) ? data.products : (Array.isArray(data) ? data : []);
    const products = rawList.map((p) => normalizeProduct(p)).filter(Boolean);
    return {
      products,
      activeCoupons: Array.isArray(data.activeCoupons) ? data.activeCoupons : [],
      activeCoupon: data.activeCoupon || null,
      discountDisplay: data.discountDisplay || '',
      total: data.total || products.length,
    };
  } catch (err) {
    console.warn('[RS-Gifts API] Could not fetch offer products:', err.message);
    return { products: [], activeCoupons: [], activeCoupon: null, discountDisplay: '', total: 0 };
  }
};
