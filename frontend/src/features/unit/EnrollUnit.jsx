import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import FormTitle from "../../components/FormTitle";
import Label from "../../components/Label";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import Spinner from "../../components/Spinner";
import Input from "../../components/Input";

const validationSchema = yup.object().shape({
  studentId: yup.string().required("Student ID is required"),
  unitCode: yup.string().required("Unit code is required"),
  session: yup.string().required("Session is required"),
});

const EnrollUnit = () => {
  const axios = useAxiosPrivate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [units, setUnits] = useState([]);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      studentId: user?.userId || "",
    },
  });

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await axios.get("/api/units");
        setUnits(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch units:", error);
      }
    };
    fetchUnits();
  }, [axios]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.post("/api/enrollments", data);
      toast.success(res.data.message || "Enrollment created successfully");
      reset();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create enrollment"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <form
        className="w-full grid gap-6 p-2 shadow-sm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormTitle>Enroll Student in Unit</FormTitle>

        <div className="wrapper grid sm:grid-cols-1 md:grid-cols-2 gap-6 p-2">
          {/* Student ID */}
          <div>
            <Label
              label="Student ID"
              error={errors.studentId?.message}
              htmlFor="studentId"
            />
            <Input
              type="text"
              name="studentId"
              register={register}
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
            <select
              className="bg-gray-50 border border-gray-300 text-sm rounded-lg
                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                dark:bg-gray-700 dark:border-gray-600 dark:text-white
                dark:focus:ring-blue-500 dark:focus:border-blue-500"
              {...register("unitCode")}
            >
              <option value="">Select Unit</option>
              {units.map((unit) => (
                <option key={unit.unitCode} value={unit.unitCode}>
                  {unit.unitCode}
                </option>
              ))}
            </select>
          </div>

          {/* Session */}
          <div>
            <Label
              label="Session"
              error={errors.session?.message}
              htmlFor="session"
            />
            <Input
              type="text"
              name="session"
              register={register}
              placeholder="e.g., 2024/2025"
            />
          </div>
        </div>

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
                <span>Enrolling...</span>
              </>
            ) : (
              "Enroll"
            )}
          </button>
        </div>
      </form>
    </React.Fragment>
  );
};

export default EnrollUnit;
