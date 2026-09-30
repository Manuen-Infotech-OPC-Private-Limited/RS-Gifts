import api from './api';

export const normalizeProduct = (p) => {
  if (!p) return null;

  const originalPrice = p.price || 0;
  const salePrice = p.salePrice || p.price || 0;
  
  let discount = '';
  if (p.salePrice && p.price > p.salePrice) {
    const pct = Math.round(((p.price - p.salePrice) / p.price) * 100);
    discount = pct + '% OFF';
  } else if (p.discount) {
    discount = p.discount;
  }

  let categories = ['All'];
  if (p.category) categories.push(p.category);
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

  return {
    id: p._id || p.id,
    name: p.title || p.name || 'Untitled Gift',
    price: salePrice,
    originalPrice: p.salePrice ? p.price : (p.originalPrice || salePrice),
    discount,
    rating: p.ratings?.average || p.rating || 4.8,
    reviews: p.ratings?.count || p.reviews || 0,
    image: p.image || '/images/products/teddy-bear.png',
    gallery: p.gallery || [],
    categories,
    stock: p.stock ?? 10,
    featured: !!p.featured,
    description: p.description || '',
  };
};

export const fetchLiveProducts = async (params = {}) => {
  try {
    const data = await api.get('/customer/products', { params });
    const rawList = data.products || (Array.isArray(data) ? data : []);
    return rawList.map(normalizeProduct);
  } catch (err) {
    console.warn('[RS-Gifts API] Backend unreachable, using fallback data:', err.message);
    throw err;
  }
};

export default {
  fetchLiveProducts,
  normalizeProduct,
};
