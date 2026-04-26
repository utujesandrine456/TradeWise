/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useContext, createContext } from 'react';
import backendApi, { backendGqlApi } from '../utils/axiosInstance.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [trader, setTrader] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = () => {
    try {
      const isAuth = localStorage.getItem('isAuthenticated');
      const traderData = localStorage.getItem('trader');
      const token = localStorage.getItem('token');

      if (isAuth === 'true' && traderData && token) {
        backendApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        backendGqlApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setTrader(JSON.parse(traderData));
        setIsAuthenticated(true);
      } else {
        delete backendApi.defaults.headers.common["Authorization"];
        delete backendGqlApi.defaults.headers.common["Authorization"];
        setIsAuthenticated(false);
        setTrader(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setTrader(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const signup = async (payload) => {
    try {
      const response = await backendApi.post('/auth/register', payload);
      const { token, user: newUser, trader } = response.data;
      const traderInfo = newUser || trader || response.data;

      if (token) {
        localStorage.setItem('token', token);
        backendApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        backendGqlApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('trader', JSON.stringify(traderInfo));

      setTrader(traderInfo);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      logout();
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const response = await backendApi.post('/auth/login', credentials);
      const { token, user: newUser, trader } = response.data;
      const traderInfo = newUser || trader || response.data;

      if (token) {
        localStorage.setItem('token', token);
        backendApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        backendGqlApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('trader', JSON.stringify(traderInfo));

      setTrader(traderInfo);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      logout();
      throw error;
    }
  };

  const logout = async () => {
    try {
      await backendApi.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      delete backendApi.defaults.headers.common["Authorization"];
      delete backendGqlApi.defaults.headers.common["Authorization"];
      localStorage.removeItem('token');
      localStorage.removeItem('trader');
      localStorage.setItem('isAuthenticated', 'false');
      setTrader(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    isAuthenticated,
    trader,
    user: trader,
    loading,
    signup,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};