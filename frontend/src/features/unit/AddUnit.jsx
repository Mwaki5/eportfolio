import React, { useState } from "react";
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
  unitCode: yup.string().required("Unit code is required"),
  unitName: yup.string().required("Unit name is required"),
  staffId: yup.string().required("Staff ID is required"),
});

const AddUnit = () => {
  const axios = useAxiosPrivate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.post("/api/units", data);
      toast.success(res.data.message || "Unit created successfully");
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create unit");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <form
        className="w-full grid gap-6  p-2 shadow-sm"
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
      >
        <FormTitle>Register unit</FormTitle>

        <div className="wrapper  grid sm:grid-cols-1 md:grid-cols-2 gap-6  p-2">
          {/* Unit Code */}
          <div>
            <Label
              label="Unit code"
              error={errors.unitCode?.message}
              htmlFor="unitCode"
            />
            <Input
              type="text"
              name="unitCode"
              register={register}
              placeholder="e.g., CS101"
            />
          </div>
          {/* Unit Name */}
          <div>
            <Label
              label="Unit Name"
              error={errors.unitName?.message}
              htmlFor="unitName"
            />
            <Input
              type="text"
              name="unitName"
              register={register}
              placeholder="e.g., Introduction to Computer Science"
            />
          </div>
          {/* Staff ID */}
          <div>
            <Label
              label="Trainer id"
              error={errors.staffId?.message}
              htmlFor="staffId"
            />
            <Input
              type="text"
              name="staffId"
              register={register}
              placeholder="Unit trainer no."
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
                <span>Creating...</span>
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
    </React.Fragment>
  );
};

export default AddUnit;
