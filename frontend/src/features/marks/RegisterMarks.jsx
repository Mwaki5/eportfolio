import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { FaCheckCircle, FaTrashAlt } from "react-icons/fa";

import FormTitle from "../../components/FormTitle";
import Label from "../../components/Label";
import Input from "../../components/Input";
import Alert from "../../components/Alert";
import Spinner from "../../components/Spinner";
import DataList from "../../components/DataList";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const validationSchema = yup.object().shape({
  studentId: yup.string().required("Student ID is required"),
  unitCode: yup.string().required("Please select a unit"),
  assessmentType: yup.string().required("Select assessment type"),
  assessmentNumber: yup.string().required("Select assessment number"),
  marks: yup
    .number()
    .typeError("Must be a number")
    .min(0, "Minimum is 0")
    .max(100, "Maximum is 100")
    .required("Marks are required"),
});

const RegisterMarks = () => {
  const axios = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [units, setUnits] = useState([]);

  const {
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onTouched",
  });

  const watchType = watch("assessmentType");
  const watchNum = watch("assessmentNumber");
  const watchUnit = watch("unitCode");

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await axios.get("/api/units");
        setUnits(res.data.data || []);
      } catch {
        toast.error("Failed to load units");
      }
    };
    fetchUnits();
  }, [axios]);

  const onSubmit = async (data) => {
    setError(null);
    setIsLoading(true);

    try {
      const markField =
        data.assessmentType === "theory"
          ? `theory${data.assessmentNumber}`
          : `prac${data.assessmentNumber}`;

      const payload = {
        studentId: data.studentId,
        unitCode: data.unitCode,
        [markField]: Number(data.marks),
      };

      await axios.post("/api/marks", payload);

      toast.success(`Registered ${data.marks}% for ${data.studentId}`);

      reset({
        studentId: data.studentId,
        unitCode: data.unitCode,
        assessmentType: data.assessmentType,
        assessmentNumber: "",
        marks: "",
      });
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to register marks";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const selectStyle = (err) => `
    bg-gray-50 border ${err ? "border-red-500" : "border-gray-300"}
    text-sm rounded-lg focus:ring-green-500 focus:border-green-500
    block w-full p-2.5 outline-none transition-all
  `;

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <FormTitle>Register Student Marks</FormTitle>

      <form onSubmit={handleSubmit(onSubmit)} className="pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {/* Student ID */}
          <div className="space-y-1">
            <Label label="Student ID" error={errors.studentId?.message} />
            <Input
              name="studentId"
              register={register}
              error={errors.studentId}
              placeholder="BS13/00/21"
            />
          </div>

          {/* Unit */}
          <div className="space-y-1">
            <Label label="Unit" error={errors.unitCode?.message} />
            <DataList
              name="unitCode"
              register={register}
              error={errors.unitCode}
              placeholder="Type to search unit..."
              options={units.map((u) => u.unitCode)}
              required
            />
          </div>

          {/* Assessment Type */}
          <div className="space-y-1">
            <Label
              label="Assessment Type"
              error={errors.assessmentType?.message}
            />
            <select
              {...register("assessmentType")}
              className={selectStyle(errors.assessmentType)}
            >
              <option value="">Select Type</option>
              <option value="theory">Theory</option>
              <option value="practical">Practical</option>
            </select>
          </div>

          {/* Assessment Number */}
          <div className="space-y-1">
            <Label
              label="Assessment No"
              error={errors.assessmentNumber?.message}
            />
            <select
              {...register("assessmentNumber")}
              className={selectStyle(errors.assessmentNumber)}
            >
              <option value="">Select</option>
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* Marks */}
          <div className="space-y-1 md:col-span-1">
            <Label label="Marks (0–100)" error={errors.marks?.message} />
            <Input
              type="number"
              name="marks"
              register={register}
              error={errors.marks}
              placeholder="Enter marks"
            />
          </div>
        </div>

        {/* Dynamic Target Badge */}
        {watchType && watchNum && watchUnit && (
          <div className="mt-6 flex justify-center">
            <div className="px-4 py-2 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-full flex items-center gap-2">
              <FaCheckCircle />
              {watchUnit.toUpperCase()} • {watchType.toUpperCase()} {watchNum}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <Alert error={error} setError={setError} />

          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FaTrashAlt size={14} />
              Clear
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-10 py-2.5 text-sm font-medium text-white bg-[#00966d] hover:bg-[#007a58] rounded-lg shadow-sm disabled:opacity-70 transition-all"
            >
              {isLoading ? <Spinner /> : "Register Marks"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterMarks;
