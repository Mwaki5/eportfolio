import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

import Spinner from "../../components/Spinner";
import FormTitle from "../../components/FormTitle";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Label from "../../components/Label";
import Alert from "../../components/Alert";

import logo from "../../assets/logo.jpg";
import { FaPersonRays, FaLock } from "react-icons/fa6";

/* ---------------- Validation Schema ---------------- */
const schema = yup.object({
  userId: yup.string().min(3).max(20).required("Username is required"),
  password: yup.string().min(3).max(12).required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setAccessToken } = useAuth();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  /* -------- Clear error after 5 seconds -------- */
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 5000);
    return () => clearTimeout(timer);
  }, [error]);

  /* ---------------- Submit ---------------- */
  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.post("/api/auth/login", data, {
        withCredentials: true,
      });

      if (res.status === 200) {
        const userData = res.data.data;

        toast.success(res.data.message);
        setUser(userData);
        setAccessToken(userData.accessToken);

        const redirectMap = {
          admin: "/admin/dashboard",
          staff: "/staff/dashboard",
          student: "/student/dashboard",
        };

        const redirectTo =
          location.state?.from?.pathname || redirectMap[userData.role] || "/";

        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="w-full h-[100vh] grid place-content-center bg-white p-4 login-page">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-6 border-2 border-gray-100 shadow-2xl w-[300px] md:w-[380px] rounded-2xl bg-white py-8 px-6"
      >
        <div className="grid place-content-center gap-2">
          <img className="h-10 object-contain" src={logo} alt="logo" />
          <h2 className="text-xl font-bold text-center text-green-700">
            E-Portfolio Portal
          </h2>
        </div>

        {/* Username */}
        <div>
          <Label>Username</Label>
          <div className="relative">
            <FaPersonRays className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              name="userId"
              register={register}
              placeholder="Enter your username"
              className="pl-10"
            />
          </div>
          {errors.userId && (
            <p className="text-red-500 text-sm mt-1">{errors.userId.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <Label>Password</Label>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="password"
              name="password"
              register={register}
              placeholder="Enter your password"
              className="pl-10"
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {error && <Alert error={error} setError={setError} />}

        <Button isLoading={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
};

export default Login;
