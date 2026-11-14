import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { getSocket } from '../services/socket';

const defaultAuthContextValue = {
  user: null,
  isAuthenticated: false,
  addresses: [],
  orders: [],
  occasions: [],
  addOccasion: () => {},
  deleteOccasion: () => {},
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
  updateProfile: async () => ({ success: false }),
  addAddress: async () => {},
  updateAddress: async () => {},
  deleteAddress: async () => {},
  setDefaultAddress: () => {},
  addCustomerOrder: async () => {},
  cancelOrder: async () => {},
  authModalOpen: false,
  authModalTab: 'login',
  openAuthModal: () => {},
  closeAuthModal: () => {},
  setAuthModalTab: () => {},
};

const AuthContext = createContext(defaultAuthContextValue);

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
          ? parsed.filter(a => a && a.id && !['addr_1', 'addr_2', 'addr_3'].includes(a.id) && !String(a.id).startsWith('addr_synth_') && !String(a.id).startsWith('addr_init_') && !String(a.id).startsWith('addr_login_') && !String(a.id).startsWith('addr_reg_') && !String(a.id).startsWith('addr_profile_'))
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

  // Auto-fetch profile and sync addresses on mount if logged in
  useEffect(() => {
    let token = null;
    try {
      token = localStorage.getItem('rs_gifts_token');
    } catch {}
    if (!token) return;

    let isMounted = true;
    const fetchUserAndAddresses = async () => {
      try {
        const data = await api.get('/customer/auth/profile');
        if (!isMounted || !data || !data.user) return;
        const u = data.user;
        const rawName = (u.name || 'User').replace(/Super Admin|Admin/gi, '').trim() || 'User';
        const nameParts = rawName.split(' ');
        const loggedUser = {
          id: u._id || u.id,
          name: rawName,
          firstName: u.firstName || nameParts[0] || 'User',
          lastName: u.lastName || nameParts.slice(1).join(' ') || '',
          email: u.email || '',
          phone: u.phone || '',
          address: u.address || '',
          gender: u.gender || '',
          birthday: u.birthday || '',
          role: 'customer',
        };
        setUser(loggedUser);

        if (u.addresses && Array.isArray(u.addresses) && u.addresses.length > 0) {
          const formattedAddrs = u.addresses.map((a) => ({
            id: a._id || a.id,
            _id: a._id,
            name: a.recipientName || rawName,
            phone: a.phone || u.phone || '',
            street: a.addressLine1 || '',
            landmark: a.addressLine2 || '',
            city: a.city || '',
            state: a.state || '',
            pincode: a.postalCode || '',
            tag: a.tag || a.addressType || 'Home',
            addressType: a.tag || a.addressType || 'Home',
            isDefault: !!a.isDefault,
          }));
          setAddresses(formattedAddrs);
        } else {
          setAddresses([]);
        }
      } catch (err) {
        console.warn('Could not sync user profile on mount:', err?.message || err);
      }
    };

    fetchUserAndAddresses();
    return () => { isMounted = false; };
  }, []);

  // Sync to localStorage with crash-proof try/catch for mobile incognito
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('rs_gifts_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('rs_gifts_user');
      }
    } catch {}
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('rs_gifts_addresses', JSON.stringify(addresses));
    } catch {}
  }, [addresses]);

  useEffect(() => {
    try {
      localStorage.setItem('rs_gifts_orders', JSON.stringify(orders));
    } catch {}
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
        dob: backendUser.dob || '',
        gender: backendUser.gender || '',
        avatar: backendUser.avatar || '',
        address: backendUser.address || '',
        role: 'customer',
        addresses: backendUser.addresses || [],
      };

      if (token) {
        localStorage.setItem('rs_gifts_token', token);
      }

      if (backendUser.addresses && Array.isArray(backendUser.addresses) && backendUser.addresses.length > 0) {
        const formattedAddrs = backendUser.addresses.map((a) => ({
          id: a._id || a.id,
          _id: a._id,
          name: a.recipientName || rawName,
          phone: a.phone || backendUser.phone || '',
          street: a.addressLine1 || '',
          landmark: a.addressLine2 || '',
          city: a.city || '',
          state: a.state || '',
          pincode: a.postalCode || '',
          tag: a.tag || a.addressType || 'Home',
          addressType: a.tag || a.addressType || 'Home',
          isDefault: !!a.isDefault,
        }));
        setAddresses(formattedAddrs);
      } else {
        setAddresses([]);
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
        dob: backendUser.dob || formData.dob || '',
        gender: backendUser.gender || formData.gender || '',
        avatar: backendUser.avatar || formData.avatar || '',
        address: backendUser.address || formData.address || '',
        role: backendUser.role || 'customer',
        addresses: backendUser.addresses || [],
      };

      if (token) {
        localStorage.setItem('rs_gifts_token', token);
      }

      if (backendUser.addresses && Array.isArray(backendUser.addresses) && backendUser.addresses.length > 0) {
        const formattedAddrs = backendUser.addresses.map((a) => ({
          id: a._id || a.id,
          _id: a._id,
          name: a.recipientName || fullName,
          phone: a.phone || formData.phone || '',
          street: a.addressLine1 || '',
          landmark: a.addressLine2 || '',
          city: a.city || '',
          state: a.state || '',
          pincode: a.postalCode || '',
          tag: a.tag || 'Home',
          isDefault: !!a.isDefault,
        }));
        setAddresses(formattedAddrs);
      } else {
        setAddresses([]);
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
    // Invalidate server-side session in MongoDB
    api.post('/customer/auth/logout').catch(() => null);
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
  const addAddress = async (newAddress) => {
    const addressWithId = {
      ...newAddress,
      id: `addr_${Date.now()}`,
      name: newAddress.name || user?.name || 'Customer',
      phone: newAddress.phone || user?.phone || '',
      tag: newAddress.tag || newAddress.addressType || 'Home',
      addressType: newAddress.tag || newAddress.addressType || 'Home',
      isDefault: false,
    };

    setAddresses((prev) => [addressWithId, ...prev]);

    const token = localStorage.getItem('rs_gifts_token');
    if (token) {
      try {
        const res = await api.post('/customer/auth/addresses', {
          recipientName: newAddress.name || user?.name || 'Customer',
          phone: newAddress.phone || user?.phone || '',
          addressLine1: newAddress.street || '',
          addressLine2: newAddress.landmark || '',
          city: newAddress.city || '',
          state: newAddress.state || '',
          postalCode: newAddress.pincode || '',
          country: 'India',
          tag: newAddress.tag || newAddress.addressType || 'Home',
          addressType: newAddress.tag || newAddress.addressType || 'Home',
          isDefault: false,
        });
        if (res?.addresses && Array.isArray(res.addresses)) {
          const synced = res.addresses.map((a) => ({
            id: a._id || a.id,
            _id: a._id,
            name: a.recipientName || newAddress.name || user?.name || 'Customer',
            phone: a.phone || newAddress.phone || user?.phone || '',
            street: a.addressLine1 || '',
            landmark: a.addressLine2 || '',
            city: a.city || '',
            state: a.state || '',
            pincode: a.postalCode || '',
            tag: a.tag || a.addressType || 'Home',
            addressType: a.tag || a.addressType || 'Home',
            isDefault: false,
          }));
          setAddresses(synced);
        }
      } catch (err) {
        console.warn('Backend address sync notice:', err?.message || err);
      }
    }
  };

  const updateAddress = async (id, updatedFields) => {
    // Optimistic UI update
    setAddresses((prev) =>
      prev.map((addr) => {
        if (addr.id === id || addr._id === id) {
          return {
            ...addr,
            ...updatedFields,
            tag: updatedFields.tag || updatedFields.addressType || addr.tag || 'Home',
            addressType: updatedFields.tag || updatedFields.addressType || addr.tag || 'Home',
            isDefault: false,
          };
        }
        return addr;
      })
    );

    const token = localStorage.getItem('rs_gifts_token');
    const backendId = !String(id).startsWith('addr_') ? id : null;
    if (token && backendId) {
      try {
        const res = await api.put(`/customer/auth/addresses/${backendId}`, {
          recipientName: updatedFields.name || updatedFields.recipientName,
          phone: updatedFields.phone,
          addressLine1: updatedFields.street || updatedFields.addressLine1,
          addressLine2: updatedFields.landmark || updatedFields.addressLine2 || '',
          city: updatedFields.city,
          state: updatedFields.state,
          postalCode: updatedFields.pincode || updatedFields.postalCode,
          tag: updatedFields.tag || updatedFields.addressType || 'Home',
          addressType: updatedFields.tag || updatedFields.addressType || 'Home',
          isDefault: false,
        });
        if (res?.addresses && Array.isArray(res.addresses)) {
          const synced = res.addresses.map((a) => ({
            id: a._id || a.id,
            _id: a._id,
            name: a.recipientName || updatedFields.name || 'Customer',
            phone: a.phone || updatedFields.phone || '',
            street: a.addressLine1 || '',
            landmark: a.addressLine2 || '',
            city: a.city || '',
            state: a.state || '',
            pincode: a.postalCode || '',
            tag: a.tag || a.addressType || 'Home',
            addressType: a.tag || a.addressType || 'Home',
            isDefault: false,
          }));
          setAddresses(synced);
        }
      } catch (err) {
        console.warn('Backend address update notice:', err?.message || err);
      }
    }
  };

  const setDefaultAddress = async (id) => {
    // Optimistic UI update
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id || addr._id === id,
      }))
    );

    const token = localStorage.getItem('rs_gifts_token');
    const backendId = !String(id).startsWith('addr_') ? id : null;
    if (token && backendId) {
      try {
        const res = await api.put(`/customer/auth/addresses/${backendId}/default`);
        if (res?.addresses && Array.isArray(res.addresses)) {
          const synced = res.addresses.map((a) => ({
            id: a._id || a.id,
            _id: a._id,
            name: a.recipientName || 'Customer',
            phone: a.phone || '',
            street: a.addressLine1 || '',
            landmark: a.addressLine2 || '',
            city: a.city || '',
            state: a.state || '',
            pincode: a.postalCode || '',
            tag: a.tag || a.addressType || 'Home',
            addressType: a.tag || a.addressType || 'Home',
            isDefault: !!a.isDefault,
          }));
          setAddresses(synced);
        }
      } catch (err) {
        console.warn('Backend setDefaultAddress notice:', err?.message || err);
      }
    }
  };

  const deleteAddress = async (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id && a._id !== id));
    const token = localStorage.getItem('rs_gifts_token');
    if (token && id && !String(id).startsWith('addr_')) {
      try {
        await api.delete(`/customer/auth/addresses/${id}`);
      } catch (err) {
        console.warn('Backend delete address notice:', err?.message || err);
      }
    }
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

  const userId = user?.id || user?._id;

  // Load live customer orders from backend (only when logged in user ID changes)
  useEffect(() => {
    if (!userId) return;
    const token = localStorage.getItem('rs_gifts_token');
    if (!token) {
      setUser(null);
      return;
    }

    let isMounted = true;
    const loadMyOrders = async () => {
      try {
        const [data, profileData] = await Promise.all([
          api.get('/customer/orders/my').catch(() => null),
          api.get('/customer/auth/profile').catch(() => null)
        ]);

        if (!isMounted) return;

        if (profileData?.user?.addresses && Array.isArray(profileData.user.addresses) && profileData.user.addresses.length > 0) {
          const formattedProfileAddrs = profileData.user.addresses.map((a) => ({
            id: a._id || a.id,
            _id: a._id,
            name: a.recipientName || (profileData.user.name || 'User').replace(/Super Admin|Admin/gi, '').trim(),
            phone: a.phone || profileData.user.phone || '',
            street: a.addressLine1 || '',
            landmark: a.addressLine2 || '',
            city: a.city || '',
            state: a.state || '',
            pincode: a.postalCode || '',
            tag: a.tag || a.addressType || 'Home',
            addressType: a.tag || a.addressType || 'Home',
            isDefault: !!a.isDefault,
          }));
          setAddresses(formattedProfileAddrs);
        }

        if (profileData?.user) {
          setUser((prev) => {
            if (!prev) return profileData.user;
            if (
              prev.gender === profileData.user.gender &&
              prev.dob === profileData.user.dob &&
              prev.name === profileData.user.name &&
              prev.phone === profileData.user.phone &&
              prev.address === profileData.user.address
            ) {
              return prev;
            }
            const merged = { ...prev, ...profileData.user };
            localStorage.setItem('rs_gifts_user', JSON.stringify(merged));
            return merged;
          });
        }
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

    // Fast backup sync every 15 seconds to ensure orders never stay stale
    const pollTimer = setInterval(() => {
      if (isMounted && localStorage.getItem('rs_gifts_token')) {
        loadMyOrders();
      }
    }, 15000);

    return () => {
      isMounted = false;
      clearInterval(pollTimer);
    };
  }, [userId]);

  // Real-time WebSocket listener for order status changes & tracking
  useEffect(() => {
    let socket;
    try {
      socket = getSocket();
    } catch (e) {
      return;
    }

    const handleLiveOrderUpdate = (data) => {
      if (!data) return;
      const targetId = String(data.orderId || data._id || '');
      const targetNum = String(data.orderNumber || '');

      setOrders((prev) =>
        prev.map((order) => {
          const match =
            (targetId && (String(order._id) === targetId || String(order.id) === targetId)) ||
            (targetNum && (String(order.orderNumber) === targetNum || String(order.id) === targetNum));

          if (!match) return order;

          const newStatus = data.orderStatus || data.status || order.status;
          const newStep =
            newStatus === 'Delivered' ? 4 :
            newStatus === 'Shipped' ? 3 :
            newStatus === 'Processing' ? 2 :
            newStatus === 'Cancelled' ? 0 : 1;

          return {
            ...order,
            status: newStatus,
            statusStep: newStep,
            statusHistory: data.statusHistory || order.statusHistory,
            carrier: data.tracking?.carrier !== undefined ? data.tracking.carrier : order.carrier,
            trackingNumber: data.tracking?.trackingNumber !== undefined ? data.tracking.trackingNumber : order.trackingNumber,
            estimatedDelivery: newStatus === 'Delivered' ? 'Delivered' : order.estimatedDelivery,
          };
        })
      );
    };

    socket.on('order_status_updated', handleLiveOrderUpdate);
    socket.on('order_tracking_updated', handleLiveOrderUpdate);
    socket.on('order_updated', handleLiveOrderUpdate);

    return () => {
      socket.off('order_status_updated', handleLiveOrderUpdate);
      socket.off('order_tracking_updated', handleLiveOrderUpdate);
      socket.off('order_updated', handleLiveOrderUpdate);
    };
  }, []);

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
  return context || defaultAuthContextValue;
};

export default AuthContext;
