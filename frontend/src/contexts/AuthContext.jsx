<<<<<<< HEAD
import { createContext, useContext, useState } from "react";
import backendApi from "../utils/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [User, setUser] = useState(null);

  const useSignup = async (userData) => {
    try {
      const response = await backendApi.post('/auth/register', userData);

      if (response.status === 201 || response.status === 200) {
        setUser(response.data.user);
        return { success: true, response: response };
      }
      throw error(response);
    } catch (error) {
      throw error;
    }
  };

  const useLogin = async (userData) => {
    try {
      const response = await backendApi.post('/auth/login', userData);
      if (response.status === 200 || response.status === 201) {
        setUser(response.data.user);
        return { success: true, response: response };
      }

      throw error(response);
    } catch (error) {
      throw error;
    }
  };

  const useLogout = async () => {
    try {
      const response = await backendApi.post('/auth/logout');
      if (response.status === 200 || response.status === 201) {
        setUser(null);
        return { success: true, response: response };
      }
      throw error(response);
    } catch (error) {
      throw error;
    }
  };

  const getUser = async () => {
    try {
      const response = await backendApi.get('/auth', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200 || response.status === 201) {
        setUser(response.data);
        return { success: true, response: response };
      }
      throw response;
    } catch (error) {
      throw error;
    }
  }

  return (
    <AuthContext.Provider value={{ useLogin, useLogout, useSignup, getUser, User }}>
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
=======
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Set token in axios headers whenever it changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const signup = async (formData) => {
    const response = await axios.post("http://localhost:2009/api/auth/signup", formData);
    const { token, user } = response.data;
    if (token) {
      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);
      return true;
    }
    return false;
  };

  const login = async (credentials) => {
    const response = await axios.post("http://localhost:2009/api/auth/login", credentials);
    const { token, user } = response.data;
    if (token) {
      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, signup, login, logout }}>
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
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
