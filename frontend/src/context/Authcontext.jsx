import { createContext, useState } from "react";
import axios from "axios";

// Create context
export const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const BACKEND_URL="http://localhost:5000"

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async() => {
    try {
        const response= await axios.get(`${BACKEND_URL}/api/auth/logout`);
        console.log(response);
    } catch (error) {
        console.error(error);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user,setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
