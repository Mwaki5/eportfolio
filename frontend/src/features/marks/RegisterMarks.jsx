import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import FormTitle from "../../components/FormTitle";
import Label from "../../components/Label";
import Input from "../../components/Input";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Spinner from "../../components/Spinner";

const validationSchema = yup.object().shape({
  studentId: yup.string().required("Student ID is required"),
  unitCode: yup.string().required("Unit code is required"),
  assessmentType: yup.string().required("Assessment type is required"),
  assessmentNumber: yup.string().required("Assessment number is required"),
  marks: yup
    .number()
    .min(0, "Marks cannot be negative")
    .max(100, "Marks cannot exceed 100")
    .required("Marks is required"),
});

const RegisterMarks = () => {
  const axios = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState(false);
  const [units, setUnits] = useState([]);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const assessmentType = watch("assessmentType");
  const assessmentNumber = watch("assessmentNumber");

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
      // Map assessment type and number to the correct field
      const markField =
        data.assessmentType === "theory"
          ? `theory${data.assessmentNumber}`
          : `prac${data.assessmentNumber}`;

      const payload = {
        studentId: data.studentId,
        unitCode: data.unitCode,
        [markField]: parseFloat(data.marks),
      };

      const res = await axios.post("/api/marks", payload);
      toast.success(
        res.data.message ||
          `${data.assessmentType === "theory" ? "Theory" : "Practical"} ${data.assessmentNumber} marks registered successfully`
      );
      reset({
        studentId: data.studentId,
        unitCode: data.unitCode,
        assessmentType: "",
        assessmentNumber: "",
        marks: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to register marks"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form
        className="w-full grid gap-6 p-2 shadow-sm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormTitle>Register Individual Marks</FormTitle>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> You can register marks individually. If marks
            already exist for this student and unit, they will be updated.
          </p>
        </div>

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
              placeholder="Enter student ID"
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
              className="bg-white border-1 border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-200 p-3 w-full"
              {...register("unitCode")}
            >
              <option value="">Select Unit</option>
              {units.map((unit) => (
                <option key={unit.unitCode} value={unit.unitCode}>
                  {unit.unitCode} - {unit.unitName}
                </option>
              ))}
            </select>
          </div>

          {/* Assessment Type */}
          <div>
            <Label
              label="Assessment Type"
              error={errors.assessmentType?.message}
              htmlFor="assessmentType"
            />
            <select
              className="bg-white border-1 border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-200 p-3 w-full"
              {...register("assessmentType")}
            >
              <option value="">Select Type</option>
              <option value="theory">Theory</option>
              <option value="practical">Practical</option>
            </select>
          </div>

          {/* Assessment Number */}
          <div>
            <Label
              label="Assessment Number"
              error={errors.assessmentNumber?.message}
              htmlFor="assessmentNumber"
            />
            <select
              className="bg-white border-1 border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-200 p-3 w-full"
              {...register("assessmentNumber")}
              disabled={!assessmentType}
            >
              <option value="">Select Number</option>
              {assessmentType && (
                <>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </>
              )}
            </select>
          </div>

          {/* Marks */}
          <div>
            <Label
              label="Marks (0-100)"
              error={errors.marks?.message}
              htmlFor="marks"
            />
            <Input
              type="number"
              name="marks"
              register={register}
              placeholder="Enter marks (0-100)"
              min="0"
              max="100"
            />
          </div>
        </div>

        {/* Preview */}
        {assessmentType && assessmentNumber && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Preview:</strong> Registering{" "}
              <span className="font-semibold text-green-600">
                {assessmentType === "theory" ? "Theory" : "Practical"}{" "}
                {assessmentNumber}
              </span>{" "}
              marks for the selected student and unit.
            </p>
          </div>
        )}

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
                <span>Registering...</span>
              </>
            ) : (
              "Register Marks"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterMarks;
