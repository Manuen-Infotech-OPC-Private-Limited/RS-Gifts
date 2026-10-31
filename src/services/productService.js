import api from './api';

export const normalizeProduct = (p, activeCoupon = null) => {
  if (!p) return null;

  // Calculate discount strictly from product's actual price and salePrice
  const originalPrice = p.salePrice ? p.price : (p.originalPrice || p.price || 0);
  const salePrice = p.salePrice ? p.salePrice : (p.price || 0);

  let discount = '';
  if (originalPrice > salePrice && originalPrice > 0) {
    const pct = Math.round(((originalPrice - salePrice) / originalPrice) * 100);
    discount = `${pct}% OFF`;
  } else if (p.discount && !p.discount.includes('OFF')) {
    discount = p.discount;
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
    price: salePrice,
    originalPrice: p.salePrice ? p.price : (p.originalPrice || salePrice),
    discount,
    activeCoupon: activeCoupon || p.activeCoupon || null,
    rating: Number(p.ratings?.average !== undefined ? p.ratings.average : (p.rating !== undefined ? p.rating : 0)),
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
  try {
    const data = await api.get('/customer/categories');
    return data.categories || (Array.isArray(data) ? data : []);
  } catch (err) {
    try {
      const data = await api.get('/categories');
      return data.categories || (Array.isArray(data) ? data : []);
    } catch {
      console.warn('[RS-Gifts API] Could not fetch live categories:', err.message);
      return [];
    }
  }
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
