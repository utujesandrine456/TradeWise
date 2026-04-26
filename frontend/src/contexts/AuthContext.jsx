/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import backendApi from "../utils/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      backendApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete backendApi.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  const signup = async (userData) => {
    try {
      const response = await backendApi.post('/auth/register', userData);
      if (response.status === 201 || response.status === 200) {
        const { token, user: newUser, trader } = response.data;
        if (token) setToken(token);
        setUser(newUser || response.data.user || trader || response.data.trader || response.data);
        return { success: true, response };
      }
      return { success: false };
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const login = async (userData) => {
    try {
      const response = await backendApi.post('/auth/login', userData);
      if (response.status === 200 || response.status === 201) {
        const { token, user: newUser, trader } = response.data;
        if (token) setToken(token);
        setUser(newUser || response.data.user || trader || response.data.trader || response.data);
        return { success: true, response };
      }
      return { success: false };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await backendApi.post('/auth/logout');
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      setUser(null);
      setToken(null);
    }
  };

  const getUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await backendApi.get('/auth');
      if (response.status === 200 || response.status === 201) {
        setUser(response.data);
        return { success: true, response };
      }
    } catch (error) {
      console.error("Get user error:", error);
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <AuthContext.Provider value={{
      login,
      logout,
      signup,
      getUser,
      user,
      User: user, // compatibility
      token,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
