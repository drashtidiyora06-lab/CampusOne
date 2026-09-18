import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('campusone_token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          localStorage.removeItem('campusone_token');
          setToken('');
          setUser(null);
        }
      } catch (err) {
        console.warn('Auth check failed, clearing invalid session');
        localStorage.removeItem('campusone_token');
        setToken('');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const login = async (identifier, password) => {
    try {
      const res = await api.post('/auth/login', { identifier, password, email: identifier });
      if (res.data && res.data.success) {
        localStorage.setItem('campusone_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
      return { success: false, message: res.data?.message || 'Invalid credentials' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Authentication failed. Please try again.'
      };
    }
  };


  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data.success) {
        localStorage.setItem('campusone_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('campusone_token');
    setToken('');
    setUser(null);
  };

  const switchRole = async (newRole) => {
    try {
      const res = await api.post(`/auth/demo-token?role=${newRole}`);
      if (res.data.success) {
        localStorage.setItem('campusone_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return;
      }
    } catch (err) {
      console.warn('Failed to fetch role demo token, updating state only');
    }

    if (user) {
      setUser({ ...user, role: newRole });
    }
  };


  const updateProfile = async (updatedData) => {
    try {
      if (token) {
        const res = await api.put('/auth/profile', updatedData);
        if (res.data.success) {
          setUser(res.data.user);
        }
      } else {
        setUser((prev) => ({ ...prev, ...updatedData }));
      }
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Update failed' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        switchRole,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
