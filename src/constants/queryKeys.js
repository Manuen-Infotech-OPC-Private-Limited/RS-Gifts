// Centralized Query Keys factory for type-safe and consistent caching
export const queryKeys = {
  content: {
    all: ['content'],
    settings: () => ['content', 'settings'],
    banners: () => ['content', 'banners'],
    categories: () => ['content', 'categories'],
    occasions: () => ['content', 'occasions'],
  },
  products: {
    all: ['products'],
    list: (params = {}) => ['products', 'list', params],
    detail: (idOrSlug) => ['products', 'detail', idOrSlug],
    featured: () => ['products', 'featured'],
    offers: (params = {}) => ['products', 'offers', params],
  },
  coupons: {
    all: ['coupons'],
    active: () => ['coupons', 'active'],
  },
  reviews: {
    byProduct: (productId) => ['reviews', 'product', productId],
  },
  orders: {
    my: () => ['orders', 'my'],
    detail: (idOrNumber) => ['orders', 'detail', idOrNumber],
  },
  user: {
    profile: () => ['user', 'profile'],
    sessions: () => ['user', 'sessions'],
  },
};

export default queryKeys;
