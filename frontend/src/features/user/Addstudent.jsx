import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import React, { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Alert from "../../components/Alert";
import FormTitle from "../../components/FormTitle";
import { registerSchema } from "../../schema/RegisterSchema";
import Label from "../../components/Label";
import Input from "../../components/Input";

const Addstudent = () => {
  const axios = useAxiosPrivate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data) => {
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === "profilePic") {
          formData.append("profilePic", data.profilePic[0]);
        } else {
          formData.append(key, data[key]);
        }
      });

      const res = await axios.post("/api/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message);
      reset();
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response.data.message);
        toast.error(err.response.data.message);
        console.log(err.response.data.message);
      } else {
        setError(err.response.data.message);
        toast.error("Execution not done.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="w-full grid gap-6  p-2 shadow-sm"
      onSubmit={handleSubmit(onSubmit)}
      encType="multipart/form-data"
    >
      <FormTitle>Add New Student</FormTitle>

      <div className="wrapper  grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6  p-2">
        {/* Admission No */}
        <div>
          <Label
            label="Admission No"
            error={errors.userId?.message}
            htmlFor="userId"
          />
          <Input
            type="text"
            name="userId"
            register={register}
            placeholder="BS13/00/21"
          />
        </div>

        {/* Role (Hidden) */}
        <input type="hidden" value="student" {...register("role")} />

        {/* First Name */}
        <div>
          <Label
            label="First name"
            error={errors.firstname?.message}
            htmlFor="firstname"
          />
          <Input
            type="text"
            name="firstname"
            register={register}
            placeholder="John"
          />
        </div>

        {/* Last Name */}
        <div>
          <Label
            label="Last name"
            error={errors.lastname?.message}
            htmlFor="lastname"
          />
          <Input
            type="text"
            name="lastname"
            register={register}
            placeholder="Masika"
          />
        </div>

        {/* Email */}
        <div>
          <Label label="Email" error={errors.email?.message} htmlFor="email" />
          <Input
            type="email"
            name="email"
            register={register}
            placeholder="student@gmail.com"
          />
        </div>

        {/* Level */}
        <div>
          <Label label="Level" error={errors.level?.message} htmlFor="level" />
          <select
            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
            dark:bg-gray-700 dark:border-gray-600 dark:text-white
            dark:focus:ring-blue-500 dark:focus:border-blue-500"
            {...register("level")}
          >
            <option value=""></option>
            <option value="Level 3">Level 3</option>
            <option value="Level 4">Level 4</option>
            <option value="Level 5">Level 5</option>
          </select>
        </div>

        {/* Department */}
        <div>
          <Label
            label="Department"
            error={errors.department?.message}
            htmlFor="department"
          />
          <select
            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
            dark:bg-gray-700 dark:border-gray-600 dark:text-white
            dark:focus:ring-blue-500 dark:focus:border-blue-500"
            {...register("department")}
          >
            <option value=""></option>
            <option value="ICT">ICT</option>
            <option value="Food and Beverage">Food and Beverage</option>
          </select>
        </div>

        {/* Gender */}
        <div>
          <Label
            label="Gender"
            error={errors.gender?.message}
            htmlFor="gender"
          />
          <select
            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
            dark:bg-gray-700 dark:border-gray-600 dark:text-white
            dark:focus:ring-blue-500 dark:focus:border-blue-500"
            {...register("gender")}
          >
            <option value=""></option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Profile Pic */}
        <div>
          <Label
            label="Profile picture"
            error={errors.profilePic?.message}
            htmlFor="profilePic"
          />
          <input
            type="file"
            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full
            dark:bg-gray-700 dark:border-gray-600 dark:text-white
            dark:focus:ring-blue-500 dark:focus:border-blue-500"
            accept="image/jpeg,image/png,image/webp,image/gif"
            {...register("profilePic")}
          />
        </div>
      </div>

      <Alert error={error} setError={setError} />

      <div className="logo flex justify-center mt-5">
        <button
          type="submit"
          className="block text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300
          font-medium rounded-lg text-sm w-full sm:w-auto px-4 py-2 text-center
          dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          disabled={isLoading}
        >
          {isLoading ? <Spinner /> : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default Addstudent;
