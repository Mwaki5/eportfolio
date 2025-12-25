import axios from "axios";
import { useState } from "react";
import useAuth from "./../hooks/useAuth";

export default axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
});
export const axiosPrivate = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
});
