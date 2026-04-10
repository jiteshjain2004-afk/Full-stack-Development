import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api';

const AuthContext = createContext(null);

const ROLE_HIERARCHY = { user: 1, moderator: 2, admin: 3 };
const persistSession = (token, user) => {
  localStorage.setItem('rbac_token', token);
  localStorage.setItem('rbac_user', JSON.stringify(user));
};

export const AuthProvider = ({ children }) => {
  const [user,  setUser]  = useState(() => { try { return JSON.parse(localStorage.getItem('rbac_user')); } catch { return null; } });
  const [token, setToken] = useState(() => localStorage.getItem('rbac_token'));

  const login = useCallback(async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    const { token: t, user: u } = res.data;
    persistSession(t, u);
    setToken(t); setUser(u);
    return u;
  }, []);

  const register = useCallback(async ({ username, email, password }) => {
    const res = await api.post('/auth/register', { username, email, password });
    const { token: t, user: u } = res.data;
    persistSession(t, u);
    setToken(t); setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('rbac_token');
    localStorage.removeItem('rbac_user');
    setToken(null); setUser(null);
  }, []);

  // Check if user has at least the required role level
  const hasRole    = useCallback((...roles) => roles.includes(user?.role), [user]);
  const hasMinRole = useCallback((minRole) => (ROLE_HIERARCHY[user?.role] || 0) >= (ROLE_HIERARCHY[minRole] || 0), [user]);

  return (
    <AuthContext.Provider value={{
      user, token, login, register, logout,
      isAuthenticated: !!token,
      hasRole, hasMinRole,
      isAdmin:     user?.role === 'admin',
      isModerator: user?.role === 'moderator' || user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
