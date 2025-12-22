import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import FormTitle from "../../components/FormTitle";
import Label from "../../components/Label";
import Input from "../../components/Input";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import Spinner from "../../components/Spinner";
import Alert from "../../components/Alert";

const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  firstname: yup.string().required("First name is required"),
  lastname: yup.string().required("Last name is required"),
  gender: yup.string().required("Gender is required"),
  department: yup.string().required("Department is required"),
  level: yup.string(),
  profilePic: yup.mixed(),
});

const EditMyProfile = () => {
  const axios = useAxiosPrivate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.userId) return;

      setFetching(true);
      try {
        const res = await axios.get(`/api/students/${user.userId}`);
        const profile = res.data.data;
        reset({
          email: profile.email,
          firstname: profile.firstname,
          lastname: profile.lastname,
          gender: profile.gender,
          department: profile.department,
          level: profile.level || "",
        });
      } catch (error) {
        toast.error("Failed to fetch profile");
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, [axios, user?.userId, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("firstname", data.firstname);
      formData.append("lastname", data.lastname);
      formData.append("gender", data.gender);
      formData.append("department", data.department);
      if (data.level) {
        formData.append("level", data.level);
      }
      if (data.profilePic && data.profilePic[0]) {
        formData.append("profilePic", data.profilePic[0]);
      }

      const res = await axios.put(`/api/students/${user.userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message || "Profile updated successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <form
        className="w-full grid gap-6 p-2 shadow-sm"
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
      >
        <FormTitle>Edit My Profile</FormTitle>

        <div className="wrapper grid sm:grid-cols-1 md:grid-cols-2 gap-6 p-2">
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

          {/* First Name */}
          <div>
            <Label
              label="First Name"
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
              label="Last Name"
              error={errors.lastname?.message}
              htmlFor="lastname"
            />
            <Input
              type="text"
              name="lastname"
              register={register}
              placeholder="Doe"
            />
          </div>

          {/* Gender */}
          <div>
            <Label label="Gender" error={errors.gender?.message} htmlFor="gender" />
            <select
              className="bg-white border-1 border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-200 p-3 w-full"
              {...register("gender")}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
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
              className="bg-white border-1 border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-200 p-3 w-full"
              {...register("department")}
            >
              <option value="">Select Department</option>
              <option value="ICT">ICT</option>
              <option value="Food and Beverage">Food and Beverage</option>
            </select>
          </div>

          {/* Level */}
          <div>
            <Label label="Level" error={errors.level?.message} htmlFor="level" />
            <select
              className="bg-white border-1 border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-200 p-3 w-full"
              {...register("level")}
            >
              <option value="">Select Level</option>
              <option value="Level 3">Level 3</option>
              <option value="Level 4">Level 4</option>
              <option value="Level 5">Level 5</option>
            </select>
          </div>

          {/* Profile Picture */}
          <div>
            <Label
              label="Profile Picture (Optional)"
              error={errors.profilePic?.message}
              htmlFor="profilePic"
            />
            <input
              type="file"
              id="profilePic"
              className="bg-white border-1 border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-200 p-3 w-full"
              accept="image/jpeg,image/png,image/webp,image/gif"
              {...register("profilePic")}
            />
          </div>
        </div>

        {error && <Alert error={error} setError={setError} />}

        <div className="logo flex justify-center mt-5">
          <button
            type="submit"
            disabled={isLoading}
            className={`flex items-center justify-center gap-2 text-white ${
              isLoading
                ? "bg-green-500 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-800"
            } focus:ring-4 focus:outline-none focus:ring-green-300
              font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5
              text-center dark:bg-green-600 dark:hover:bg-green-700
              dark:focus:ring-green-800`}
          >
            {isLoading ? (
              <>
                <Spinner size="small" color="white" />
                <span>Updating...</span>
              </>
            ) : (
              "Update Profile"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMyProfile;

