import { createContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { setAccessToken } from "../api/axios";

export const AuthContext = createContext(null);

const BACKEND_URL = "http://localhost:5000";
const USER_STORAGE_KEY = "ticketmaster_user";
const TOKEN_STORAGE_KEY = "ticketmaster_token";
const VITE_STRIPE_PUBLISHABLE_KEY= "pk_test_51T0UDZDqZDVEZDcpUxxygy8EPIDAUSTISYpjX8KLMQGAThE0jD25zs1JMFz7M9jLweKIjPF6iRcAq9ytHfKL4bwt003e7K4hvr";

const parseStoredUser = (value) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error("Failed to parse stored user", error);
    return null;
  }
};

const getInitialUser = () => {
  if (typeof window === "undefined") return null;
  return parseStoredUser(window.localStorage.getItem(USER_STORAGE_KEY));
};

const getInitialToken = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialUser);
  const [token, setToken] = useState(getInitialToken);

  useEffect(() => {
    if (!token) {
      delete axios.defaults.headers.common["Authorization"];
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
      return;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      }
      return;
    }

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  const login = (userData, accessToken) => {
    setUser(userData || null);
    setToken(accessToken || null);
    setAccessToken(accessToken || null);
  };

  const logout = async () => {
    try {
      await axios.get(`${BACKEND_URL}/api/auth/logout`, { withCredentials: true });
    } catch (error) {
      console.error(error);
    } finally {
      setUser(null);
      setToken(null);
    }
  };

  const contextValue = useMemo(
    () => ({
      BACKEND_URL,
      user,
      token,
      login,
      logout,
      setUser,
      setToken,
      VITE_STRIPE_PUBLISHABLE_KEY,
    }),
    [user, token]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
