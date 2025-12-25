import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { FaTrashAlt, FaPlusCircle } from "react-icons/fa";

import FormTitle from "../../components/FormTitle";
import Label from "../../components/Label";
import Input from "../../components/Input";
import Spinner from "../../components/Spinner";
import Alert from "../../components/Alert";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const validationSchema = yup.object().shape({
  unitCode: yup.string().required("Unit code is required"),
  unitName: yup.string().required("Unit name is required"),
  staffId: yup.string().required("Trainer ID is required"),
});

const AddUnit = () => {
  const axios = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data) => {
    setError(null);
    setIsLoading(true);

    try {
      const res = await axios.post("/api/units", data);
      toast.success(res.data.message || "Unit registered successfully");
      reset();
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to register unit.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <FormTitle>Register New Unit</FormTitle>

      <form onSubmit={handleSubmit(onSubmit)} className="pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {/* Unit Code */}
          <div className="space-y-1">
            <Label
              label="Unit Code"
              error={errors.unitCode?.message}
              htmlFor="unitCode"
            />
            <Input
              type="text"
              name="unitCode"
              register={register}
              error={errors.unitCode}
              placeholder="e.g. BIT201"
            />
            <p className="text-[11px] text-gray-400 italic">
              Example: COM110, ACC201
            </p>
          </div>

          {/* Trainer ID */}
          <div className="space-y-1">
            <Label
              label="Trainer No."
              error={errors.staffId?.message}
              htmlFor="staffId"
            />
            <Input
              type="text"
              name="staffId"
              register={register}
              error={errors.staffId}
              placeholder="TRN-001"
            />
          </div>

          {/* Unit Name */}
          <div className="space-y-1 md:col-span-2">
            <Label
              label="Unit Full Name"
              error={errors.unitName?.message}
              htmlFor="unitName"
            />
            <Input
              type="text"
              name="unitName"
              register={register}
              error={errors.unitName}
              placeholder="Object Oriented Programming"
            />
          </div>
        </div>

        {/* Footer Actions */}
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
              {isLoading ? <Spinner /> : "Register Unit"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddUnit;
