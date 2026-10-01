import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialUserData, initialAddresses, initialOrders, initialOccasions } from '../data/mockUserData';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Load state from localStorage or initial mock data
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('rs_gifts_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) {
          if (parsed.avatar) delete parsed.avatar;
          if (parsed.role === 'admin' || parsed.email === 'admin@rsgifts.com') {
            parsed.name = 'RS Gifts';
            parsed.firstName = 'RS';
            parsed.lastName = 'Gifts';
          } else {
            if (parsed.name) parsed.name = parsed.name.replace(/Super Admin|Admin/gi, '').trim();
            if (parsed.lastName) parsed.lastName = parsed.lastName.replace(/Super Admin|Admin/gi, '').trim();
          }
          parsed.role = parsed.role === 'admin' ? 'admin' : 'customer';
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
      return saved ? JSON.parse(saved) : initialAddresses;
    } catch {
      return initialAddresses;
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('rs_gifts_orders');
      return saved ? JSON.parse(saved) : initialOrders;
    } catch {
      return initialOrders;
    }
  });

  const [occasions, setOccasions] = useState(() => {
    try {
      const saved = localStorage.getItem('rs_gifts_occasions');
      return saved ? JSON.parse(saved) : initialOccasions;
    } catch {
      return initialOccasions;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register'

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

  useEffect(() => {
    localStorage.setItem('rs_gifts_occasions', JSON.stringify(occasions));
  }, [occasions]);

  // Auth actions
  const login = async (emailOrPhone, password) => {
    try {
      const data = await api.post('/customer/auth/login', {
        email: emailOrPhone.trim(),
        password,
      });

      const token = data.token;
      const backendUser = data.user || {};
      const rawName = (backendUser.role === 'admin' || backendUser.email === 'admin@rsgifts.com')
        ? 'RS Gifts'
        : (backendUser.name || 'User').replace(/Super Admin|Admin/gi, '').trim() || 'User';
      const nameParts = rawName.split(' ');
      const firstName = nameParts[0] || (backendUser.role === 'admin' ? 'RS' : 'User');
      const lastName = nameParts.slice(1).join(' ') || (backendUser.role === 'admin' ? 'Gifts' : '');

      const loggedUser = {
        id: backendUser.id || backendUser._id || `usr_${Date.now()}`,
        name: rawName,
        firstName,
        lastName,
        email: backendUser.email || emailOrPhone,
        phone: backendUser.phone || '',
        role: backendUser.role === 'admin' ? 'admin' : 'customer',
        addresses: backendUser.addresses || [],
      };

      if (token) {
        localStorage.setItem('rs_gifts_token', token);
        if (loggedUser.role === 'admin') {
          localStorage.setItem('rs_admin_token', token);
        }
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
        email: formData.email?.trim(),
        password: formData.password,
        phone: formData.phone || '',
      });

      const token = data.token;
      const backendUser = data.user || {};
      const nameParts = (backendUser.name || fullName).split(' ');

      const newUser = {
        id: backendUser.id || backendUser._id || `usr_${Date.now()}`,
        name: backendUser.name || fullName,
        firstName: nameParts[0] || 'New',
        lastName: nameParts.slice(1).join(' ') || '',
        email: backendUser.email || formData.email,
        phone: backendUser.phone || formData.phone || '',
        role: backendUser.role || 'customer',
        addresses: backendUser.addresses || [],
      };

      if (token) {
        localStorage.setItem('rs_gifts_token', token);
        if (backendUser.role === 'admin') {
          localStorage.setItem('rs_admin_token', token);
        }
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
    localStorage.removeItem('rs_admin_token');
    localStorage.removeItem('rs_gifts_user');
    setUser(null);
  };

  const updateProfile = (updatedFields) => {
    setUser((prev) => ({
      ...prev,
      ...updatedFields,
    }));
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

  // Order actions
  const cancelOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: 'Cancelled', statusStep: 0 }
          : order
      )
    );
  };

  // Occasions actions
  const addOccasion = (occasion) => {
    setOccasions((prev) => [
      { ...occasion, id: `occ_${Date.now()}` },
      ...prev,
    ]);
  };

  const deleteOccasion = (id) => {
    setOccasions((prev) => prev.filter((o) => o.id !== id));
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
        occasions,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        cancelOrder,
        addOccasion,
        deleteOccasion,
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
