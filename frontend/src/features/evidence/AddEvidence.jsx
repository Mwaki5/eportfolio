import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import Alert from "../../components/Alert";
import FormTitle from "../../components/FormTitle";
import Label from "../../components/Label";
import Input from "../../components/Input";
import FileUpload from "../../components/FileUpload";
import ProgressBar from "../../components/ProgressBar";

const validationSchema = yup.object().shape({
  studentId: yup.string().required("Student ID is required"),
  unitCode: yup.string().required("Unit code is required"),
  description: yup.string(),
  file: yup.mixed().required("Evidence file is required"),
});

const AddEvidence = () => {
  const axios = useAxiosPrivate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [units, setUnits] = useState([]);
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      studentId: user?.userId || "",
    },
  });

  const onSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    setUploadProgress(0);
    try {
      const data = new FormData();
      data.append("studentId", formData.studentId);
      data.append("unitCode", formData.unitCode);
      if (formData.description) {
        data.append("description", formData.description);
      }
      if (formData.file[0]) {
        data.append("file", formData.file[0]);
      }

      const res = await axios.post("/api/evidences", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });
      toast.success(res.data.message || "Evidence uploaded successfully");
      reset();
      setUploadProgress(0);
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Failed to upload evidence";
      toast.error(errorMessage);
      setError(errorMessage);
      setUploadProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUnits = async () => {
      if (!user?.userId) return;
      try {
        const res = await axios.get(
          `/api/enrollments/student/${encodeURIComponent(user.userId)}`
        );
        setUnits([res.data.data[0].Unit] || []);
      } catch (error) {
        console.log("Failed to fetch enrolled units:", error);
      }
    };
    fetchUnits();
  }, [axios, user?.userId]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 10000);
    }
  }, [error]);

  return (
    <div className="w-full">
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="personal grid gap-6 rounded-sm shadow-sm p-2">
          <FormTitle>Upload Evidence</FormTitle>

          {/* Unit Code */}

          <div>
            <Label
              label="Unit Code"
              error={errors.unitCode?.message}
              htmlFor="unitCode"
            />

            <select
              className="bg-white border-1 border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-200 p-3 w-full"
              {...register("unitCode")}
            >
              <option value="">Select Unit</option>
              {units.map((unit) => (
                <option key={unit.unitCode} value={unit.unitCode}>
                  {unit.unitName}
                </option>
              ))}
            </select>
          </div>

          {/* File Upload - Full Width */}
          <div className="p-2">
            <Label
              label="Evidence File (Image or Video)"
              error={errors.file?.message}
              htmlFor="file"
            />
            <FileUpload
              name="file"
              register={register}
              accept="image/*,video/*"
              required
            />
            {isLoading && uploadProgress > 0 && (
              <div className="mt-4 w-[80%] mx-auto">
                <ProgressBar progress={uploadProgress} />
              </div>
            )}
          </div>

          <div className="wrapper grid sm:grid-cols-1 gap-6 p-2">
            {/* Description */}
            <div>
              <Label
                label="Description (Optional)"
                error={errors.description?.message}
                htmlFor="description"
              />
              <textarea
                id="description"
                {...register("description")}
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 placeholder:text-gray-400 focus:border-blue-500 block w-full p-2.5"
                placeholder="Describe the evidence..."
                rows="3"
              />
            </div>
          </div>

          {error && <Alert error={error} />}

          {/* Submit Button */}
          <div className="logo flex justify-center mb-5">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center justify-center gap-2 text-white ${
                isLoading
                  ? "bg-green-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-800"
              } focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-4 py-2 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800`}
            >
              {!isLoading ? (
                <p>Upload Evidence</p>
              ) : (
                <>
                  <Spinner size="small" color="white" />
                  <span>Uploading...</span>
                </>
              )}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default AddEvidence;
