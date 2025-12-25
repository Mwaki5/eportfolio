import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { FaTrashAlt, FaCheckCircle } from "react-icons/fa";

import FormTitle from "../../components/FormTitle";
import Label from "../../components/Label";
import Input from "../../components/Input";
import Alert from "../../components/Alert";
import Spinner from "../../components/Spinner";
import DataList from "../../components/DataList";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";

const validationSchema = yup.object().shape({
  studentId: yup.string().required("Student ID is required"),
  unitCode: yup.string().required("Unit is required"),
  session: yup.string().required("Academic session is required"),
});

const EnrollUnit = () => {
  const axios = useAxiosPrivate();
  const { user } = useAuth();

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
    defaultValues: {
      studentId: user?.userId || "",
      session: "2024/2025",
    },
  });

  const selectedUnitCode = watch("unitCode");
  const currentUnit = units.find((u) => u.unitCode === selectedUnitCode);

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
      const res = await axios.post("/api/enrollments", data);
      toast.success(res.data.message || "Student enrolled successfully");

      reset({
        studentId: "",
        unitCode: "",
        session: "2024/2025",
      });
    } catch (err) {
      const errMsg = err.response?.data?.message || "Enrollment failed";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <FormTitle>Enroll Student to Unit</FormTitle>

      <form onSubmit={handleSubmit(onSubmit)} className="pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {/* Student ID */}
          <div className="space-y-1">
            <Label
              label="Student Admission No"
              error={errors.studentId?.message}
            />
            <Input
              name="studentId"
              register={register}
              error={errors.studentId}
              placeholder="BS13/001/21"
            />
          </div>

          {/* Academic Session */}
          <div className="space-y-1">
            <Label label="Academic Session" error={errors.session?.message} />
            <Input
              name="session"
              register={register}
              error={errors.session}
              placeholder="2024/2025"
            />
          </div>

          {/* Unit */}
          <div className="space-y-1 md:col-span-2">
            <Label label="Unit" error={errors.unitCode?.message} />
            <DataList
              name="unitCode"
              register={register}
              error={errors.unitCode}
              placeholder="Type to search unit..."
              options={units.map((u) => u.unitCode)}
              required
            />

            {/* Unit Preview */}
            {currentUnit && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-blue-600 uppercase">
                    Selected Unit
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {currentUnit.unitName}
                  </p>
                </div>
                <div className="text-[11px] text-gray-500">
                  Trainer ID:{" "}
                  <span className="font-mono">{currentUnit.staffId}</span>
                </div>
              </div>
            )}
          </div>
        </div>

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
              {isLoading ? <Spinner /> : "Confirm Enrollment"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EnrollUnit;
