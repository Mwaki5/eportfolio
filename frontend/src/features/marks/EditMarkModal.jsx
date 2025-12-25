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

const validationSchema = yup.object().shape({
  theory1: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .min(0, "Must be at least 0")
    .max(100, "Cannot exceed 100")
    .nullable(),
  theory2: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .min(0, "Must be at least 0")
    .max(100, "Cannot exceed 100")
    .nullable(),
  theory3: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .min(0, "Must be at least 0")
    .max(100, "Cannot exceed 100")
    .nullable(),
  prac1: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .min(0, "Must be at least 0")
    .max(100, "Cannot exceed 100")
    .nullable(),
  prac2: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .min(0, "Must be at least 0")
    .max(100, "Cannot exceed 100")
    .nullable(),
  prac3: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .min(0, "Must be at least 0")
    .max(100, "Cannot exceed 100")
    .nullable(),
});

const UpdateMarkModal = ({
  editModalOpen,
  setEditModalOpen,
  selectedMark,
  marks,
  setMarks,
  isLoading,
  setIsLoading,
}) => {
  const axios = useAxiosPrivate();
  const originalMarkId = useRef(selectedMark?.markId);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (selectedMark) {
      reset({
        theory1: selectedMark.theory1 ?? "",
        theory2: selectedMark.theory2 ?? "",
        theory3: selectedMark.theory3 ?? "",
        prac1: selectedMark.prac1 ?? "",
        prac2: selectedMark.prac2 ?? "",
        prac3: selectedMark.prac3 ?? "",
      });
      originalMarkId.current = selectedMark.markId;
    }
  }, [selectedMark, reset]);

  const onSubmit = async (data) => {
    if (!selectedMark) return;
    setIsLoading(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, v === "" ? null : v])
      );
      const res = await axios.put(
        `/api/marks/${originalMarkId.current}`,
        payload
      );

      // Update local marks list
      setMarks(
        marks.map((m) =>
          m.markId === originalMarkId.current ? { ...m, ...payload } : m
        )
      );

      toast.success(res.data.message || "Marks updated successfully");
      setEditModalOpen(false);
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update marks");
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
          <FormTitle>
            Update Marks - {selectedMark?.User?.firstname}{" "}
            {selectedMark?.User?.lastname} ({selectedMark?.Unit?.unitCode})
          </FormTitle>

          <div className="wrapper grid gap-6 p-2">
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Theory Marks */}
              {["theory1", "theory2", "theory3"].map((field, idx) => (
                <div key={field}>
                  <Label
                    label={`Theory ${idx + 1}`}
                    error={errors[field]?.message}
                    htmlFor={field}
                  />
                  <Input
                    type="number"
                    name={field}
                    register={register}
                    placeholder="0-100"
                    min="0"
                    max="100"
                    required={false}
                    className="w-full"
                  />
                </div>
              ))}

              {/* Practical Marks */}
              {["prac1", "prac2", "prac3"].map((field, idx) => (
                <div key={field}>
                  <Label
                    label={`Practical ${idx + 1}`}
                    error={errors[field]?.message}
                    htmlFor={field}
                  />
                  <Input
                    type="number"
                    name={field}
                    register={register}
                    placeholder="0-100"
                    min="0"
                    required={false}
                    max="100"
                    className="w-full"
                  />
                </div>
              ))}
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
              } focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5`}
            >
              {isLoading ? <Spinner size="small" color="white" /> : "Update"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UpdateMarkModal;
