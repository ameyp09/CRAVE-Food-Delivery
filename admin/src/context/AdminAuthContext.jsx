import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('crave_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('crave_admin_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAdminSession = async () => {
      const storedToken = localStorage.getItem('crave_admin_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data?.success && res.data.user?.role === 'admin') {
            setAdminUser(res.data.user);
            localStorage.setItem('crave_admin_user', JSON.stringify(res.data.user));
          } else {
            adminLogout(false);
          }
        } catch (err) {
          adminLogout(false);
        }
      }
      setLoading(false);
    };

    verifyAdminSession();
  }, []);

  const adminLogin = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.success) {
        const { token: newToken, user } = res.data;

        if (user.role !== 'admin') {
          toast.error('Access denied. Administrator privileges required.');
          return { success: false, message: 'Not an administrator' };
        }

        setToken(newToken);
        setAdminUser(user);
        localStorage.setItem('crave_admin_token', newToken);
        localStorage.setItem('crave_admin_user', JSON.stringify(user));
        toast.success(`Welcome to CRAVE Operations, ${user.name}! 🛡️`);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Admin login failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const adminLogout = (showToast = true) => {
    setAdminUser(null);
    setToken(null);
    localStorage.removeItem('crave_admin_token');
    localStorage.removeItem('crave_admin_user');
    if (showToast) {
      toast.success('Logged out of Admin Portal');
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        token,
        loading,
        isAdminAuthenticated: !!adminUser && adminUser.role === 'admin',
        adminLogin,
        adminLogout
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
