import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialUserData, initialAddresses, initialOrders, initialOccasions } from '../data/mockUserData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Load state from localStorage or initial mock data
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('rs_gifts_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.avatar) {
          delete parsed.avatar;
          localStorage.setItem('rs_gifts_user', JSON.stringify(parsed));
        }
        return parsed;
      }
      return initialUserData;
    } catch {
      return initialUserData;
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
  const login = (emailOrPhone, password) => {
    const loggedUser = {
      ...initialUserData,
      email: emailOrPhone.includes('@') ? emailOrPhone : 'user@example.com',
      phone: !emailOrPhone.includes('@') ? emailOrPhone : initialUserData.phone,
    };
    setUser(loggedUser);
    setAuthModalOpen(false);
    return { success: true };
  };

  const register = (formData) => {
    const newUser = {
      ...initialUserData,
      id: `usr_${Date.now()}`,
      firstName: formData.firstName || 'New',
      lastName: formData.lastName || 'User',
      email: formData.email,
      phone: formData.phone || '+91 98765 00000',
    };
    setUser(newUser);
    setAuthModalOpen(false);
    return { success: true };
  };

  const logout = () => {
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
