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

  // Auto-fetch profile and sync addresses on mount if logged in
  useEffect(() => {
    const token = localStorage.getItem('rs_gifts_token');
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
            tag: a.tag || 'Home',
            isDefault: !!a.isDefault,
          }));
          setAddresses(formattedAddrs);
        } else if (u.address && u.address.trim()) {
          setAddresses((prev) => {
            if (prev.length > 0) return prev;
            return [{
              id: `addr_init_${Date.now()}`,
              name: rawName,
              phone: u.phone || '',
              street: u.address.trim(),
              landmark: '',
              city: 'Hyderabad',
              state: 'Telangana',
              pincode: '500001',
              tag: 'Home',
              isDefault: true,
            }];
          });
        }
      } catch (err) {
        console.warn('Could not sync user profile on mount:', err?.message || err);
      }
    };

    fetchUserAndAddresses();
    return () => { isMounted = false; };
  }, []);

  // Auto-synthesize default address if user has user.address but addresses list is empty
  useEffect(() => {
    if (user && user.address && user.address.trim() && addresses.length === 0) {
      const synthAddr = {
        id: `addr_synth_${Date.now()}`,
        name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'My Address',
        phone: user.phone || '',
        street: user.address.trim(),
        landmark: '',
        city: user.city || 'Hyderabad',
        state: user.state || 'Telangana',
        pincode: user.pincode || '500001',
        tag: 'Home',
        isDefault: true,
      };
      setAddresses([synthAddr]);
    }
  }, [user, addresses.length]);

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
          tag: a.tag || 'Home',
          isDefault: !!a.isDefault,
        }));
        setAddresses(formattedAddrs);
      } else if (backendUser.address && backendUser.address.trim()) {
        const initialAddr = {
          id: `addr_login_${Date.now()}`,
          name: rawName,
          phone: backendUser.phone || '',
          street: backendUser.address.trim(),
          landmark: '',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500001',
          tag: 'Home',
          isDefault: true,
        };
        setAddresses([initialAddr]);
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
      } else if (formData.address && formData.address.trim()) {
        const initialAddr = {
          id: `addr_reg_${Date.now()}`,
          name: fullName,
          phone: formData.phone || '',
          street: formData.address.trim(),
          landmark: '',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500001',
          tag: 'Home',
          isDefault: true,
        };
        setAddresses([initialAddr]);
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

        if (updatedFields.address && updatedFields.address.trim()) {
          setAddresses((prev) => {
            if (prev.length > 0) return prev;
            return [{
              id: `addr_profile_${Date.now()}`,
              name: updatedFields.name || data.user.name || 'My Address',
              phone: updatedFields.phone || data.user.phone || '',
              street: updatedFields.address.trim(),
              landmark: '',
              city: updatedFields.city || 'Hyderabad',
              state: updatedFields.state || 'Telangana',
              pincode: updatedFields.pincode || '500001',
              tag: 'Home',
              isDefault: true,
            }];
          });
        }

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

    if (updatedFields.address && updatedFields.address.trim()) {
      setAddresses((prev) => {
        if (prev.length > 0) return prev;
        return [{
          id: `addr_profile_${Date.now()}`,
          name: updatedFields.name || user?.name || 'My Address',
          phone: updatedFields.phone || user?.phone || '',
          street: updatedFields.address.trim(),
          landmark: '',
          city: updatedFields.city || 'Hyderabad',
          state: updatedFields.state || 'Telangana',
          pincode: updatedFields.pincode || '500001',
          tag: 'Home',
          isDefault: true,
        }];
      });
    }

    return { success: true };
  };

  // Address actions
  const addAddress = async (newAddress) => {
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
          tag: newAddress.tag || 'Home',
          isDefault: addressWithId.isDefault,
        });
        if (res?.addresses && Array.isArray(res.addresses)) {
          const synced = res.addresses.map((a) => ({
            id: a._id || a.id,
            _id: a._id,
            name: a.recipientName,
            phone: a.phone,
            street: a.addressLine1,
            landmark: a.addressLine2 || '',
            city: a.city,
            state: a.state,
            pincode: a.postalCode,
            tag: a.tag || 'Home',
            isDefault: !!a.isDefault,
          }));
          setAddresses(synced);
        }
      } catch (err) {
        console.warn('Backend address sync notice:', err?.message || err);
      }
    }
  };

  const updateAddress = (id, updatedFields) => {
    setAddresses((prev) =>
      prev.map((addr) => {
        if (addr.id === id || addr._id === id) {
          return { ...addr, ...updatedFields };
        }
        if (updatedFields.isDefault) {
          return { ...addr, isDefault: false };
        }
        return addr;
      })
    );
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
            name: a.recipientName,
            phone: a.phone,
            street: a.addressLine1,
            landmark: a.addressLine2 || '',
            city: a.city,
            state: a.state,
            pincode: a.postalCode,
            tag: a.tag || 'Home',
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

    return () => {
      isMounted = false;
    };
  }, [userId]);

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
