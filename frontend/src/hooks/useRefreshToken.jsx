import React from "react";
import useAuth from "./useAuth";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const useRefreshToken = () => {
  const navigate = useNavigate();
  const { setUser, setAccessToken, logout } = useAuth();
  const refresh = async () => {
    try {
      const response = await axios.post(
        "/api/auth/refresh-token",
        {},
        { withCredentials: true }
      );
      setUser(response.data.user);
      setAccessToken(response.data.accessToken);
      return response.data.accessToken;
    } catch (error) {
      // Only redirect to login if refresh token doesn't match database
      // This happens when refresh token mismatch error is returned
      const errorMessage = error.response?.data?.message || "";
      if (
        errorMessage.includes("Refresh token mismatch") ||
        errorMessage.includes("Invalid or expired refresh token") ||
        error.response?.status === 401
      ) {
        // Clear auth state and redirect to login
        logout();
        navigate("/", { replace: true });
      }
      throw error; // Re-throw to let interceptor handle it
    }
  };
  return refresh;
};

export default useRefreshToken;
