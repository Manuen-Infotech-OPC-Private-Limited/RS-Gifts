import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('rs_gifts_wishlist');
      return saved ? JSON.parse(saved) : [
        // Seed with 2 demo items so the wishlist page looks vibrant right away
        {
          id: 'prod-2',
          name: 'Personalized Photo Frame',
          price: 499,
          originalPrice: 699,
          discount: '29% OFF',
          rating: 4.9,
          reviews: 98,
          image: '/images/products/photo-frame.png',
          categories: ['All', 'Best Sellers', 'Personalized Gifts']
        },
        {
          id: 'prod-4',
          name: 'LED Moon Lamp',
          price: 1299,
          originalPrice: 1699,
          discount: '24% OFF',
          rating: 4.7,
          reviews: 112,
          image: '/images/products/moon-lamp.png',
          categories: ['All', 'New Arrivals', 'Home & Decor']
        }
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('rs_gifts_wishlist', JSON.stringify(wishlistItems));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  }, [wishlistItems]);

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const toggleWishlist = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice || product.price,
          discount: product.discount || '',
          rating: product.rating || 4.8,
          reviews: product.reviews || 0,
          image: product.image,
          categories: product.categories || ['Gifts'],
          addedAt: new Date().toISOString(),
        }
      ];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
