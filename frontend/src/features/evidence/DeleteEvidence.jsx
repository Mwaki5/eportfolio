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
  evidenceId: yup.string().required("Evidence ID is required"),
});

const DeleteEvidence = () => {
  const axios = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState(false);
  const [evidence, setEvidence] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const evidenceId = watch("evidenceId");

  useEffect(() => {
    const fetchEvidence = async () => {
      if (!evidenceId || evidenceId.length < 1) {
        setEvidence(null);
        return;
      }

      try {
        const res = await axios.get("/api/evidence");
        const found = res.data.data.find((e) => e.id.toString() === evidenceId);
        setEvidence(found || null);
      } catch (error) {
        setEvidence(null);
      }
    };

    const timeoutId = setTimeout(fetchEvidence, 500);
    return () => clearTimeout(timeoutId);
  }, [evidenceId, axios]);

  const onSubmit = async (data) => {
    if (!evidence) {
      toast.error("Please enter a valid evidence ID");
      return;
    }
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!evidence) return;

    setIsLoading(true);
    try {
      await axios.delete(`/api/evidence/${evidence.id}`);
      toast.success("Evidence deleted successfully");
      setEvidence(null);
      setDeleteModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete evidence");
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
        <FormTitle>Delete Evidence</FormTitle>

        <div className="wrapper grid sm:grid-cols-1 md:grid-cols-2 gap-6 p-2">
          <div>
            <Label
              label="Evidence ID"
              error={errors.evidenceId?.message}
              htmlFor="evidenceId"
            />
            <Input
              type="text"
              name="evidenceId"
              register={register}
              placeholder="Enter evidence ID"
            />
          </div>
        </div>

        {evidence && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Evidence Details:</h3>
            <p className="text-blue-800">
              <strong>Student ID:</strong> {evidence.studentId}
            </p>
            <p className="text-blue-800">
              <strong>Unit Code:</strong> {evidence.unitCode}
            </p>
            <p className="text-blue-800">
              <strong>File Name:</strong> {evidence.originalname}
            </p>
            {evidence.description && (
              <p className="text-blue-800">
                <strong>Description:</strong> {evidence.description}
              </p>
            )}
          </div>
        )}

        {!evidence && evidenceId && evidenceId.length >= 1 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Evidence not found</p>
          </div>
        )}

        <div className="logo flex justify-center mt-5">
          <button
            type="submit"
            disabled={isLoading || !evidence}
            className={`flex items-center justify-center gap-2 text-white ${
              isLoading || !evidence
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
              "Delete Evidence"
            )}
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModalOpen} setIsOpen={setDeleteModalOpen}>
        <div className="p-4">
          <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
          <p className="mb-4">
            Are you sure you want to delete this evidence? This action cannot be
            undone.
          </p>
          {evidence && (
            <div className="mb-4 p-2 bg-gray-100 rounded">
              <p>
                <strong>Student ID:</strong> {evidence.studentId}
              </p>
              <p>
                <strong>Unit Code:</strong> {evidence.unitCode}
              </p>
              <p>
                <strong>File:</strong> {evidence.originalname}
              </p>
            </div>
          )}
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

export default DeleteEvidence;

