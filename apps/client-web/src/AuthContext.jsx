import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "./api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const token = localStorage.getItem("cyberdesk_client_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/auth/client/me");
      setUser(response.data.customer || response.data.user);
    } catch (error) {
      localStorage.removeItem("cyberdesk_client_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (emailOrPhone, password, cafeId) => {
    const response = await api.post("/auth/client/login", {
      emailOrPhone,
      password,
      cafeId,
    });
    localStorage.setItem("cyberdesk_client_token", response.data.accessToken);
    setUser(response.data.customer);
    return response.data;
  };

  const signup = async (name, phone, email, password, cafeId) => {
    const response = await api.post("/auth/client/signup", {
      name,
      phone,
      email,
      password,
      cafeId,
    });
    localStorage.setItem("cyberdesk_client_token", response.data.accessToken);
    setUser(response.data.customer);
    return response.data;
  };

  const qrLogin = async (qrToken, cafeId) => {
    const response = await api.post("/auth/client/qr-login", {
      qrToken,
      cafeId,
    });
    localStorage.setItem("cyberdesk_client_token", response.data.accessToken);
    setUser(response.data.customer);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("cyberdesk_client_token");
    setUser(null);
    window.location.href = "/login";
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      signup,
      qrLogin,
      logout,
      refresh: loadUser,
    }),
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
