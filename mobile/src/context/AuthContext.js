import React, { createContext, useContext, useState } from 'react';
import api, { setAuthToken } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
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

  const [token, setTokenState] = useState('');

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        setTokenState(res.data.token);
        setAuthToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const switchRole = (newRole) => {
    setUser((prev) => ({ ...prev, role: newRole }));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
