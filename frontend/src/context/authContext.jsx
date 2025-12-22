import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "../api/axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false)


  const logout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { 
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setAccessToken(null);
      setUser(null);
      navigate('/', { replace: true });
    }
  };

  // Memoize context value for performance and clarity
  const value = {
    accessToken,
    isAuthenticated: !!accessToken,
    setAccessToken,
    setUser,
    logout,
    user,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export { AuthContext };
export default AuthProvider;

