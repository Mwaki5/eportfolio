import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Alert from "../../components/Alert";
import FormTitle from "../../components/FormTitle";
import { registerSchema } from "../../schema/RegisterSchema";
import Label from "../../components/Label";
import Input from "../../components/Input";
import { FaUserPlus, FaImage, FaTrashAlt } from "react-icons/fa";
import DataList from "../../components/DataList";

const Addstudent = () => {
  const axios = useAxiosPrivate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const {
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onTouched",
  });

  // Watch profilePic to generate a preview
  const profilePicFile = watch("profilePic");

  useEffect(() => {
    if (profilePicFile && profilePicFile.length > 0) {
      const objectUrl = URL.createObjectURL(profilePicFile[0]);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setPreview(null);
  }, [profilePicFile]);

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
      setPreview(null);
    } catch (err) {
      const errMsg = err.response?.data?.message || "Execution not done.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = (err) => `
    bg-gray-50 border ${err ? "border-red-500" : "border-gray-300"} 
    text-sm rounded-lg focus:ring-green-500 focus:border-green-500 
    block w-full p-2.5 outline-none transition-all
  `;

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <FormTitle>Add New Student</FormTitle>
      <form
        className="pt-2"
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {/* Admission No */}
          <div className="space-y-1">
            <Label
              label="Admission No"
              error={errors.userId?.message}
              htmlFor="userId"
            />
            <Input
              type="text"
              name="userId"
              error={errors.userId}
              register={register}
              placeholder="BS13/00/21"
              className={errors.userId ? "border-red-500" : ""}
            />
          </div>

          <input type="hidden" value="student" {...register("role")} />

          {/* First Name */}
          <div className="space-y-1">
            <Label
              label="First name"
              error={errors.firstname?.message}
              htmlFor="firstname"
            />
            <Input
              error={errors.firstname}
              type="text"
              name="firstname"
              register={register}
              placeholder="John"
            />
          </div>

          {/* Last Name */}
          <div className="space-y-1">
            <Label
              label="Last name"
              error={errors.lastname?.message}
              htmlFor="lastname"
            />
            <Input
              type="text"
              name="lastname"
              error={errors.lastname}
              register={register}
              placeholder="Masika"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label
              label="Email"
              error={errors.email?.message}
              htmlFor="email"
            />
            <Input
              type="email"
              name="email"
              error={errors.email}
              register={register}
              placeholder="student@gmail.com"
            />
          </div>

          {/* Level */}
          <div className="space-y-1">
            <Label
              label="Level"
              error={errors.level?.message}
              htmlFor="level"
            />
            <select className={inputStyle(errors.level)} {...register("level")}>
              <option value="">Select Level</option>
              <option value="Level 3">Level 3</option>
              <option value="Level 4">Level 4</option>
              <option value="Level 5">Level 5</option>
            </select>
          </div>

          {/* Department */}
          <div className="space-y-1">
            <Label
              label="Department"
              error={errors.department?.message}
              htmlFor="department"
            />

            {/* The visible input field */}
            <DataList
              placeholder="Type to search department..."
              name="department"
              register={register}
              options={[
                "ICT",
                "Food and Beverage",
                "Computer Science",
                "Electrical Engineering",
              ]}
              required={true}
              error={errors.department}
            />
          </div>

          {/* Gender */}
          <div className="space-y-1">
            <Label
              label="Gender"
              error={errors.gender?.message}
              htmlFor="gender"
            />
            <select
              className={inputStyle(errors.gender)}
              {...register("gender")}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Profile Pic & Preview */}
          <div className="space-y-1 md:col-span-1">
            <Label
              label="Profile picture"
              error={errors.profilePic?.message}
              htmlFor="profilePic"
            />
            <div className="flex items-center gap-4">
              <div className="relative group w-14 h-14 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaImage className="text-gray-400" />
                )}
              </div>
              <input
                type="file"
                id="profilePic"
                className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
                accept="image/*"
                {...register("profilePic")}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <Alert error={error} setError={setError} />

          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                reset();
                setPreview(null);
              }}
              className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FaTrashAlt size={14} /> Clear
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-10 py-2.5 text-sm font-medium text-white bg-[#00966d] hover:bg-[#007a58] rounded-lg shadow-sm disabled:opacity-70 transition-all"
            >
              {isLoading ? <Spinner /> : "Register Student"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Addstudent;
