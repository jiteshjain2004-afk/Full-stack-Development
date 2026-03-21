import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,  setUser]  = useState(() => { try { return JSON.parse(localStorage.getItem('social_user')); } catch { return null; } });
  const [token, setToken] = useState(() => localStorage.getItem('social_token'));

  const save = (t, u) => {
    localStorage.setItem('social_token', t);
    localStorage.setItem('social_user', JSON.stringify(u));
    setToken(t); setUser(u);
  };

  const login    = useCallback(async (email, password) => { const r = await api.post('/auth/login', { email, password }); save(r.data.token, r.data.user); return r.data.user; }, []);
  const register = useCallback(async (data) => { const r = await api.post('/auth/register', data); save(r.data.token, r.data.user); return r.data.user; }, []);
  const logout   = useCallback(() => { localStorage.removeItem('social_token'); localStorage.removeItem('social_user'); setToken(null); setUser(null); }, []);
  const updateUser = useCallback((u) => { localStorage.setItem('social_user', JSON.stringify(u)); setUser(u); }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateUser, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
