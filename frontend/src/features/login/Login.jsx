import React, { useState, useContext } from "react";
import { replace, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios"; // Hook to access n
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import { yupResolver } from "@hookform/resolvers/yup";
import logo from "../../assets/logo.jpg";
import { FaPersonRays, FaLock } from "react-icons/fa6";
import FormTitle from "../../components/FormTitle";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Label from "../../components/Label";
import Alert from "../../components/Alert";
const Login = () => {
  const location = useLocation();
  const [error, setError] = useState(null);
  const { setUser, setAccessToken } = useAuth();
  const fromStaff = location.state?.from?.pathname || "/staff/dashboard";
  const fromStudent = location.state?.from?.pathname || "/student/dashboard";
  const fromAdmin = location.state?.from?.pathname || "/admin/dashboard";
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const schema = yup.object().shape({
    userId: yup.string().max(12).min(3).required(),
    password: yup.string().max(12).min(3).required(),
  });
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  if (error) {
    setTimeout(() => {
      setError(null);
    }, 5000);
  }
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        data,
        {
          headers: { "Content-type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.status == 200) {
        toast.success(res.data.message);
        setUser(res.data.data);
        console.log("Data:", res.data.data);
        setAccessToken(res.data.data.accessToken);
        if (res.data.data.role == "admin") {
          navigate(fromAdmin, { replace: true });
        } else if (res.data.data.role == "staff") {
          navigate(fromStaff, { replace: true });
        } else {
          navigate(fromStudent, { replace: true });
        }
      }
    } catch (error) {
      const res = error.response;
      setError(res.data.message);
      toast.error(res.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full h-[100vh] grid place-content-center bg-white p-4 login-page">
      <div className="fade-in">
        <form
          className="grid gap-4 sm:gap-6 border-2 border-gray-100 shadow-2xl w-[300px] md:w-[380px] rounded-2xl bg-white py-8 px-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="logo grid place-content-center w-full">
            <div className=" p-3 w-full grid place-content-center ">
              <img className="h-10 object-contain" src={logo} alt="logo" />
            </div>
            <h2 className="text-xl font-bold text-center text-green-700">
              E-Portfolio Portal
            </h2>
          </div>

          <div className="w-full">
            <Label>Username</Label>
            <div className="relative">
              <FaPersonRays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Enter your username"
                register={register}
                name="userId"
                className="pl-10"
              />
            </div>
            <p className="mt-1">
              <span className="text-red-500 text-sm">
                {errors.userId && errors.userId.message}
              </span>
            </p>
          </div>

          <div className="w-full">
            <Label>Password</Label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Enter your password"
                register={register}
                name="password"
                type="password"
                className="pl-10"
              />
            </div>
            <p className="mt-1">
              <span className="text-red-500 text-sm">
                {errors.password && errors.password.message}
              </span>
            </p>
          </div>

          {error && <Alert error={error} setError={setError} />}
          <Button isLoading={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
