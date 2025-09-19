import { createContext, useContext } from "react";
import { useAuth } from "../hooks/useAuth.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const auth = useAuth(); // all values from your hook
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth anywhere
export const useAuthContext = () => useContext(AuthContext);