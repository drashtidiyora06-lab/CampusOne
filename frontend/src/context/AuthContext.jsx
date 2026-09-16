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
        try {
          const demoRes = await api.post('/auth/demo-token?role=student');
          if (demoRes.data.success) {
            localStorage.setItem('campusone_token', demoRes.data.token);
            setToken(demoRes.data.token);
            setUser(demoRes.data.user);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Demo token generation failed, falling back to local user object');
        }

        setUser({
          _id: 'default_student_101',
          name: 'Alex Johnson',
          email: 'student@college.edu',
          role: 'student',
          branch: 'Computer Science',
          year: '3rd Year',
          rollNumber: 'CS2026-104',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          bio: 'CS Undergrad passionate about WebDev & AI.'
        });
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.warn('Auth check failed, retaining fallback session');
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const login = async (identifier, password) => {
    try {
      const res = await api.post('/auth/login', { identifier, password, email: identifier });
      if (res.data.success) {
        localStorage.setItem('campusone_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Invalid credentials' };
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
