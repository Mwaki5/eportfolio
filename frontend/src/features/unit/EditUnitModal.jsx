import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Modal from "../../components/Modal";
import Spinner from "../../components/Spinner";
import FormTitle from "../../components/FormTitle";
import Label from "../../components/Label";
import Input from "../../components/Input";

const UpdateUnitModal = ({
  editModalOpen,
  setEditModalOpen,
  selectedUnit,
  isLoading,
  setIsLoading,
  setUnits,
  units,
}) => {
  const axios = useAxiosPrivate();

  // Keep original unitCode to handle updates
  const originalUnitCode = useRef(selectedUnit?.unitCode);

  // Validation schema
  const validationSchema = yup.object().shape({
    newUnitCode: yup.string().required("Unit code is required"),
    newUnitName: yup.string().required("Unit name is required"),
    newStaffId: yup.string().required("Staff ID is required"),
  });

  // React Hook Form
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Reset form values when selectedUnit changes
  useEffect(() => {
    if (selectedUnit) {
      reset({
        newUnitCode: selectedUnit.unitCode || "",
        newUnitName: selectedUnit.unitName || "",
        newStaffId: selectedUnit.Staff?.userId || "",
      });
      originalUnitCode.current = selectedUnit.unitCode; // update originalUnitCode
    }
  }, [selectedUnit, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.put(
        `/api/units/${originalUnitCode.current}`,
        data
      );

      // Update local units list using originalUnitCode
      const updatedUnits = units.map((unit) =>
        unit.unitCode === originalUnitCode.current
          ? {
              ...unit,
              unitCode: data.newUnitCode,
              unitName: data.newUnitName,
              Staff: {
                ...unit.Staff,
                userId: data.newStaffId,
              },
            }
          : unit
      );
      setUnits(updatedUnits);

      toast.success(res.data.message || "Unit updated successfully");
      setEditModalOpen(false);
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update unit");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={editModalOpen} setIsOpen={setEditModalOpen}>
      <div className="p-4">
        <form
          className="min-w-sm grid gap-6 p-2 shadow-sm"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormTitle>Update Unit - {selectedUnit?.unitCode || ""}</FormTitle>

          <div className="wrapper grid gap-y-6 p-2">
            {/* Unit Code */}
            <div>
              <Label
                label="Unit Code"
                error={errors.newUnitCode?.message}
                htmlFor="newUnitCode"
              />
              <Input
                type="text"
                name="newUnitCode"
                readOnly={true}
                register={register}
                placeholder="e.g., CS101"
              />
            </div>

            {/* Unit Name */}
            <div>
              <Label
                label="Unit Name"
                error={errors.newUnitName?.message}
                htmlFor="newUnitName"
              />
              <Input
                type="text"
                name="newUnitName"
                register={register}
                placeholder="e.g., Introduction to Computer Science"
              />
            </div>

            {/* Staff ID */}
            <div>
              <Label
                label="Trainer ID"
                error={errors.newStaffId?.message}
                htmlFor="newStaffId"
              />
              <Input
                type="text"
                name="newStaffId"
                register={register}
                placeholder="Trainer ID"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-5">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center justify-center gap-2 text-white ${
                isLoading
                  ? "bg-green-500 cursor-not-allowed"
                  : "bg-green-700 hover:bg-green-800"
              } focus:ring-4 focus:outline-none focus:ring-green-300
                font-medium rounded-lg text-sm px-5 py-2.5`}
            >
              {isLoading ? <Spinner size="small" color="white" /> : "Update"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UpdateUnitModal;
