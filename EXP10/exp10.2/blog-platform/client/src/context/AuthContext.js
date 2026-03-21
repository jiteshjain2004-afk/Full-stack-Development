import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,  setUser]  = useState(() => { try { return JSON.parse(localStorage.getItem('blog_user')); } catch { return null; } });
  const [token, setToken] = useState(() => localStorage.getItem('blog_token'));

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: t, user: u } = res.data;
    localStorage.setItem('blog_token', t);
    localStorage.setItem('blog_user', JSON.stringify(u));
    setToken(t); setUser(u);
    return u;
  }, []);

  const register = useCallback(async (data) => {
    const res = await api.post('/auth/register', data);
    const { token: t, user: u } = res.data;
    localStorage.setItem('blog_token', t);
    localStorage.setItem('blog_user', JSON.stringify(u));
    setToken(t); setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('blog_token');
    localStorage.removeItem('blog_user');
    setToken(null); setUser(null);
  }, []);

  const updateUser = useCallback((u) => {
    localStorage.setItem('blog_user', JSON.stringify(u));
    setUser(u);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateUser, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
