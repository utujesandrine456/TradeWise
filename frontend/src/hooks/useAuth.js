import { useState, useEffect, useCallback } from 'react';
import backendApi from '../utils/axiosInstance.js';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [trader, setTrader] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load auth info from localStorage
  const checkAuth = useCallback(() => {
    const isAuthenticated = JSON.parse(localStorage.getItem('isAuthenticated'));

    if (isAuthenticated) {
      try {
        const traderData = localStorage.getItem('trader');
        const parsedtrader = JSON.parse(traderData);

        setTrader(parsedtrader);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Invalid trader data:', error);
        logout();
      }
    } else {
      setIsAuthenticated(false);
      setTrader(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const signup = async (traderData) => {
    try {
      const response = await backendApi.post('/auth/register', traderData);
      const data = await response.data;

      localStorage.setItem('isAuthenticated', true);
      localStorage.setItem('trader', JSON.stringify(data));

      setTrader(data);
      setIsAuthenticated(true);

      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      logout();
      return false;
    }
  };

  // Login function
  const login = async (traderData) => {
    try {
      const response = await backendApi.post('/auth/login', traderData);
      const data = await response.data;

      localStorage.setItem('isAuthenticated', true);
      localStorage.setItem('trader', JSON.stringify(data));

      setTrader(data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      logout();
    }
  };

  // Logout function
  const logout = async () => {
    try {   
      await backendApi.post('/auth/logout');
      localStorage.removeItem('trader');
      localStorage.setItem('isAuthenticated', false);
  
      setTrader(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Update trader info
  const updatetrader = async (traderData) => {
    try {
      const response = await backendApi.put('/auth/profile', { traderData });
      const data = await response.data;
      
      localStorage.setItem('trader', JSON.stringify(data));
      setTrader(data);
    } catch (error) {
      console.error('Update trader failed:', error);
    }
  };

  return {
    isAuthenticated,
    trader,
    loading,
    signup,
    login,
    logout,
    updatetrader,
    checkAuth
  };
};
