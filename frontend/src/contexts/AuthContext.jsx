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
