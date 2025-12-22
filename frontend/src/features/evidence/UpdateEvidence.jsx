import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import FormTitle from "../../components/FormTitle";
import Label from "../../components/Label";
import Input from "../../components/Input";
import TextArea from "../../components/TextArea";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Spinner from "../../components/Spinner";

const validationSchema = yup.object().shape({
  studentId: yup.string().required("Student ID is required"),
  unitCode: yup.string().required("Unit code is required"),
  description: yup.string(),
  file: yup.mixed(),
});

const UpdateEvidence = () => {
  const axios = useAxiosPrivate();
  const [searchParams] = useSearchParams();
  const evidenceId = searchParams.get("id");
  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [evidence, setEvidence] = useState(null);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    const fetchEvidence = async () => {
      if (!evidenceId) return;

      setFetching(true);
      try {
        const res = await axios.get("/api/evidence");
        const found = res.data.data.find(
          (e) => e.id.toString() === evidenceId
        );
        if (found) {
          setEvidence(found);
          reset({
            studentId: found.studentId,
            unitCode: found.unitCode,
            description: found.description || "",
          });
        } else {
          toast.error("Evidence not found");
        }
      } catch (error) {
        toast.error("Failed to fetch evidence");
      } finally {
        setFetching(false);
      }
    };

    fetchEvidence();
  }, [evidenceId, axios, reset]);

  const onSubmit = async (formData) => {
    if (!evidenceId) {
      toast.error("Evidence ID is required");
      return;
    }

    setIsLoading(true);
    try {
      const data = new FormData();
      data.append("studentId", formData.studentId);
      data.append("unitCode", formData.unitCode);
      if (formData.description) {
        data.append("description", formData.description);
      }
      if (formData.file && formData.file[0]) {
        data.append("file", formData.file[0]);
      }

      const res = await axios.put(`/api/evidence/${evidenceId}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(res.data.message || "Evidence updated successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update evidence"
      );
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

  if (!evidenceId) {
    return (
      <div className="w-full">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Please provide an evidence ID in the URL query parameter.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="personal grid gap-6 rounded-sm shadow-sm">
          <FormTitle>Update Evidence</FormTitle>
          <div className="wrapper grid sm:grid-cols-1 md:grid-cols-2 gap-6 p-2">
            {/* Student ID */}
            <div>
              <Label
                label="Student ID"
                error={errors.studentId?.message}
                htmlFor="studentId"
              />
              <input
                type="text"
                id="studentId"
                {...register("studentId")}
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 placeholder:text-gray-400 focus:border-blue-500 block w-full p-2.5"
                placeholder="Student ID"
              />
            </div>

            {/* Unit Code */}
            <div>
              <Label
                label="Unit Code"
                error={errors.unitCode?.message}
                htmlFor="unitCode"
              />
              <input
                type="text"
                id="unitCode"
                {...register("unitCode")}
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 placeholder:text-gray-400 focus:border-blue-500 block w-full p-2.5"
                placeholder="e.g., CS101"
              />
            </div>

            {/* File Upload */}
            <div>
              <Label
                label="Evidence File (Optional - leave empty to keep current file)"
                error={errors.file?.message}
                htmlFor="file"
              />
              <input
                type="file"
                id="file"
                {...register("file")}
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              {evidence && (
                <p className="text-sm text-gray-500 mt-1">
                  Current file: {evidence.originalname}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
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
                <p>Update Evidence</p>
              ) : (
                <>
                  <Spinner size="small" color="white" />
                  <span>Updating...</span>
                </>
              )}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default UpdateEvidence;

