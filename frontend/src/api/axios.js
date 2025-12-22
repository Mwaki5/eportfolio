import axios from "axios";
import { useState } from "react";
import useAuth from "./../hooks/useAuth";

export default axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});
export const axiosPrivate = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});
