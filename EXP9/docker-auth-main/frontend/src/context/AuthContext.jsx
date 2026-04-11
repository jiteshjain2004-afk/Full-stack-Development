import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, setAuthHeader } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setAuthHeader(token);
  }, [token]);

  async function signup(payload) {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/signup", payload);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function login(payload) {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", payload);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
    setAuthHeader("");
  }

  const value = useMemo(
    () => ({ token, user, loading, error, setError, signup, login, logout }),
    [token, user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
