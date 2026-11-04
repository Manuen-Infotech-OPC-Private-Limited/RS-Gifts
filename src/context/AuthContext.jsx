import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Load state from localStorage
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem('rs_gifts_token');
      if (!token) {
        localStorage.removeItem('rs_gifts_user');
        return null;
      }
      const saved = localStorage.getItem('rs_gifts_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) {
          if (parsed.name) parsed.name = parsed.name.replace(/Super Admin|Admin/gi, '').trim() || 'User';
          if (parsed.lastName) parsed.lastName = parsed.lastName.replace(/Super Admin|Admin/gi, '').trim();
          parsed.role = 'customer';
          localStorage.setItem('rs_gifts_user', JSON.stringify(parsed));
          return parsed;
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  const [addresses, setAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem('rs_gifts_addresses');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed)
          ? parsed.filter(a => !['addr_1', 'addr_2', 'addr_3'].includes(a.id))
          : [];
      }
      return [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('rs_gifts_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed)
          ? parsed.filter(o => !['RS-84920', 'RS-78142'].includes(o.id))
          : [];
      }
      return [];
    } catch {
      return [];
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register'

  // Clean legacy occasions from localStorage
  useEffect(() => {
    try {
      localStorage.removeItem('rs_gifts_occasions');
    } catch {}
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('rs_gifts_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('rs_gifts_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('rs_gifts_addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('rs_gifts_orders', JSON.stringify(orders));
  }, [orders]);

  // Auth actions
  const login = async (emailOrPhone, password) => {
    try {
      const data = await api.post('/customer/auth/login', {
        email: emailOrPhone.trim(),
        password,
      });

      const token = data.token;
      const backendUser = data.user || {};
      const rawName = (backendUser.name || 'User').replace(/Super Admin|Admin/gi, '').trim() || 'User';
      const nameParts = rawName.split(' ');
      const firstName = backendUser.firstName || nameParts[0] || 'User';
      const lastName = backendUser.lastName || nameParts.slice(1).join(' ') || '';

      const loggedUser = {
        id: backendUser.id || backendUser._id || `usr_${Date.now()}`,
        name: rawName,
        firstName,
        lastName,
        email: backendUser.email || emailOrPhone,
        phone: backendUser.phone || '',
        avatar: backendUser.avatar || '',
        address: backendUser.address || '',
        role: 'customer',
        addresses: backendUser.addresses || [],
      };

      if (token) {
        localStorage.setItem('rs_gifts_token', token);
        
      }

      setUser(loggedUser);
      return { success: true, user: loggedUser, token };
    } catch (err) {
      console.warn('Backend login failed, checking fallback:', err);
      const errMsg = err.response?.data?.message || err.message || 'Invalid credentials';
      return { success: false, error: errMsg };
    }
  };

  const register = async (formData) => {
    try {
      const fullName = `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || 'New User';
      const data = await api.post('/customer/auth/register', {
        name: fullName,
        firstName: formData.firstName?.trim() || '',
        lastName: formData.lastName?.trim() || '',
        email: formData.email?.trim(),
        password: formData.password,
        phone: formData.phone || '',
        avatar: formData.avatar || '',
        address: formData.address?.trim() || '',
      });

      const token = data.token;
      const backendUser = data.user || {};
      const nameParts = (backendUser.name || fullName).split(' ');

      const newUser = {
        id: backendUser.id || backendUser._id || `usr_${Date.now()}`,
        name: backendUser.name || fullName,
        firstName: backendUser.firstName || nameParts[0] || 'New',
        lastName: backendUser.lastName || nameParts.slice(1).join(' ') || '',
        email: backendUser.email || formData.email,
        phone: backendUser.phone || formData.phone || '',
        avatar: backendUser.avatar || formData.avatar || '',
        address: backendUser.address || formData.address || '',
        role: backendUser.role || 'customer',
        addresses: backendUser.addresses || [],
      };

      if (token) {
        localStorage.setItem('rs_gifts_token', token);
        
      }

      setUser(newUser);
      return { success: true, user: newUser, token };
    } catch (err) {
      console.warn('Backend register error:', err);
      const errMsg = err.response?.data?.message || err.message || 'Registration failed';
      return { success: false, error: errMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('rs_gifts_token');
        localStorage.removeItem('rs_gifts_user');
    setUser(null);
  };

  const updateProfile = async (updatedFields) => {
    try {
      const data = await api.put('/customer/auth/profile', updatedFields);
      if (data && data.user) {
        setUser((prev) => {
          const merged = { ...prev, ...data.user };
          localStorage.setItem('rs_gifts_user', JSON.stringify(merged));
          return merged;
        });
        return { success: true };
      }
    } catch (err) {
      console.warn('Backend profile update fallback:', err?.message || err);
    }
    setUser((prev) => {
      const merged = { ...prev, ...updatedFields };
      localStorage.setItem('rs_gifts_user', JSON.stringify(merged));
      return merged;
    });
    return { success: true };
  };

  // Address actions
  const addAddress = (newAddress) => {
    const addressWithId = {
      ...newAddress,
      id: `addr_${Date.now()}`,
      isDefault: addresses.length === 0 ? true : !!newAddress.isDefault,
    };

    setAddresses((prev) => {
      let list = prev;
      if (addressWithId.isDefault) {
        list = list.map((a) => ({ ...a, isDefault: false }));
      }
      return [addressWithId, ...list];
    });
  };

  const updateAddress = (id, updatedFields) => {
    setAddresses((prev) =>
      prev.map((addr) => {
        if (addr.id === id) {
          return { ...addr, ...updatedFields };
        }
        if (updatedFields.isDefault) {
          return { ...addr, isDefault: false };
        }
        return addr;
      })
    );
  };

  const deleteAddress = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const setDefaultAddress = (id) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  // Listen for global auth expiration events from API interceptor
  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null);
      setOrders([]);
    };
    window.addEventListener('rs_auth_expired', handleAuthExpired);
    return () => window.removeEventListener('rs_auth_expired', handleAuthExpired);
  }, []);

  // Load live customer orders from backend
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('rs_gifts_token');
    if (!token) {
      setUser(null);
      return;
    }

    const loadMyOrders = async () => {
      try {
        const data = await api.get('/customer/orders/my');
        const liveOrders = data?.orders || [];
        if (Array.isArray(liveOrders) && liveOrders.length > 0) {
          setOrders(liveOrders.map(o => ({
            id: o.orderNumber || o._id,
            _id: o._id,
            orderNumber: o.orderNumber,
            date: o.createdAt,
            formattedDate: new Date(o.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }),
            status: o.orderStatus || 'Pending',
            statusStep: o.orderStatus === 'Delivered' ? 4 : o.orderStatus === 'Shipped' ? 3 : o.orderStatus === 'Processing' ? 2 : 1,
            carrier: o.tracking?.carrier || '',
            trackingNumber: o.tracking?.trackingNumber || '',
            estimatedDelivery: o.orderStatus === 'Delivered' ? 'Delivered' : 'Estimated: 3-5 Business Days',
            items: (o.items || []).map(i => ({
              id: i.productId || i.product || i._id,
              name: i.title,
              price: i.price,
              quantity: i.quantity,
              image: i.image,
            })),
            pricing: {
              subtotal: o.subtotal,
              shipping: o.shippingFee,
              discount: o.discountAmount,
              total: o.totalAmount,
            },
            shippingAddress: o.shippingAddress,
            paymentMethod: o.paymentMethod,
            paymentStatus: o.paymentStatus,
          })));
        }
      } catch (e) {
        if (e.response?.status === 401) {
          // Token expired or invalid: reset user session and stop continuous retry
          setUser(null);
          setOrders([]);
          localStorage.removeItem('rs_gifts_token');
          localStorage.removeItem('rs_gifts_user');
          return;
        }
        console.warn('Could not load live user orders from backend:', e.message);
      }
    };
    loadMyOrders();
  }, [user]);

  // Order actions
  const addCustomerOrder = (rawOrder) => {
    const formatted = {
      id: rawOrder.orderNumber || rawOrder._id || `RS${Math.floor(10 + Math.random() * 90)}${Math.random().toString(36).substring(2, 4).toUpperCase()}`, // Strictly 6 characters
      _id: rawOrder._id,
      orderNumber: rawOrder.orderNumber,
      date: rawOrder.createdAt || new Date().toISOString(),
      formattedDate: new Date(rawOrder.createdAt || Date.now()).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      status: rawOrder.orderStatus || 'Pending',
      statusStep: 1,
      carrier: rawOrder.tracking?.carrier || '',
      trackingNumber: rawOrder.tracking?.trackingNumber || '',
      estimatedDelivery: 'Estimated: 3-5 Business Days',
      items: (rawOrder.items || []).map(i => ({
        id: i.productId || i.product || i._id,
        name: i.title || i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
      })),
      pricing: {
        subtotal: rawOrder.subtotal,
        shipping: rawOrder.shippingFee,
        discount: rawOrder.discountAmount,
        total: rawOrder.totalAmount,
      },
      shippingAddress: rawOrder.shippingAddress,
      paymentMethod: rawOrder.paymentMethod,
      paymentStatus: rawOrder.paymentStatus,
    };

    setOrders((prev) => [formatted, ...prev]);
  };

  const cancelOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: 'Cancelled', statusStep: 0 }
          : order
      )
    );
  };

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        addresses,
        orders,
        occasions: [],
        addOccasion: () => {},
        deleteOccasion: () => {},
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        addCustomerOrder,
        cancelOrder,
        authModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        setAuthModalTab,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
