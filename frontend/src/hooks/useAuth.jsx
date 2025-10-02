import { useState, useEffect, useContext, createContext } from 'react';
import backendApi from '../utils/axiosInstance.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [trader, setTrader] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = () => {
    try {
      const isAuth = localStorage.getItem('isAuthenticated');
      const traderData = localStorage.getItem('trader');

      if (isAuth === 'true' && traderData) {
        setTrader(JSON.parse(traderData));
        setIsAuthenticated(true);
      } else {
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

  const login = async (credentials) => {
    try {
      const response = await backendApi.post('/auth/login', credentials);
      const data = response.data;

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('trader', JSON.stringify(data));

      setTrader(data);
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
      localStorage.removeItem('trader');
      localStorage.setItem('isAuthenticated', 'false');
      setTrader(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    isAuthenticated,
    trader,
    loading,
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