import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "./api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const token = localStorage.getItem("cyberdesk_access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await api.get("/auth/me");
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem("cyberdesk_access_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/auth/admin/login", { email, password });
    localStorage.setItem("cyberdesk_access_token", response.data.accessToken);
    setUser(response.data.user);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("cyberdesk_access_token");
    setUser(null);
    window.location.href = "/login";
  };

  const value = useMemo(
    () => ({ user, loading, login, logout, refresh: loadUser }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
