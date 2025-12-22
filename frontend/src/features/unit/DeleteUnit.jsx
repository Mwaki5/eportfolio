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
import Modal from "../../components/Modal";

const validationSchema = yup.object().shape({
  unitCode: yup.string().required("Unit code is required"),
});

const DeleteUnit = () => {
  const axios = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState(false);
  const [unit, setUnit] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const unitCode = watch("unitCode");

  useEffect(() => {
    const fetchUnit = async () => {
      if (!unitCode || unitCode.length < 2) {
        setUnit(null);
        return;
      }

      try {
        const res = await axios.get(`/api/units/${unitCode}`);
        setUnit(res.data.data);
      } catch (error) {
        setUnit(null);
      }
    };

    const timeoutId = setTimeout(fetchUnit, 500);
    return () => clearTimeout(timeoutId);
  }, [unitCode, axios]);

  const onSubmit = async (data) => {
    if (!unit) {
      toast.error("Please enter a valid unit code");
      return;
    }
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!unit) return;

    setIsLoading(true);
    try {
      await axios.delete(`/api/units/${unit.unitCode}`);
      toast.success("Unit deleted successfully");
      setUnit(null);
      setDeleteModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete unit");
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
        <FormTitle>Delete Unit</FormTitle>

        <div className="wrapper grid sm:grid-cols-1 md:grid-cols-2 gap-6 p-2">
          <div>
            <Label
              label="Unit Code"
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
        </div>

        {unit && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Unit Details:</h3>
            <p className="text-blue-800">
              <strong>Code:</strong> {unit.unitCode}
            </p>
            <p className="text-blue-800">
              <strong>Name:</strong> {unit.unitName}
            </p>
            <p className="text-blue-800">
              <strong>Staff ID:</strong> {unit.staffId}
            </p>
          </div>
        )}

        {!unit && unitCode && unitCode.length >= 2 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Unit not found</p>
          </div>
        )}

        <div className="logo flex justify-center mt-5">
          <button
            type="submit"
            disabled={isLoading || !unit}
            className={`flex items-center justify-center gap-2 text-white ${
              isLoading || !unit
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            } focus:ring-4 focus:outline-none focus:ring-red-300
              font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5
              text-center`}
          >
            {isLoading ? (
              <>
                <Spinner size="small" color="white" />
                <span>Deleting...</span>
              </>
            ) : (
              "Delete Unit"
            )}
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModalOpen} setIsOpen={setDeleteModalOpen}>
        <div className="p-4">
          <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
          <p className="mb-4">
            Are you sure you want to delete unit{" "}
            <strong>{unit?.unitCode}</strong> ({unit?.unitName})? This action
            cannot be undone.
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:bg-gray-400"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DeleteUnit;
