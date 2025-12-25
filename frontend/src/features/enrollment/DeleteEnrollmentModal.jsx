import React, { useState, useEffect } from "react";
import * as yup from "yup";

import { toast } from "react-toastify";

import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Spinner from "../../components/Spinner";
import Modal from "../../components/Modal";

const DeleteEnrollmentModal = ({
  deleteModalOpen,
  setDeleteModalOpen,
  isLoading,
  setEnrollments,
  enrollments,
  setIsLoading,
  selectedEnrollment,
  setSelectedEnrollment,
}) => {
  const axios = useAxiosPrivate();

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    if (!selectedEnrollment) return;

    try {
      await axios.delete(`/api/enrollments/${selectedEnrollment.enrollmentId}`);
      toast.success("Enrollment deleted successfully");
      setEnrollments(
        enrollments.filter(
          (e) => e.enrollmentId !== selectedEnrollment.enrollmentId
        )
      );
      setDeleteModalOpen(false);
      setSelectedEnrollment(null);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete enrollment"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={deleteModalOpen} setIsOpen={setDeleteModalOpen}>
      <div className="p-4">
        <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
        <p className="mb-4">
          Are you sure you want to delete this enrollment? This action cannot be
          undone.
        </p>
        {selectedEnrollment && (
          <div className="mb-4 p-2 bg-gray-100 rounded">
            <p>
              <strong>Student:</strong> {selectedEnrollment.studentId}
            </p>
            <p>
              <strong>Unit:</strong> {selectedEnrollment.unitCode}
            </p>
            <p>
              <strong>Session:</strong> {selectedEnrollment.session}
            </p>
          </div>
        )}
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              setDeleteModalOpen(false);
              setSelectedEnrollment(null);
            }}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            Cancel
          </button>
          <button
            disabled={isLoading}
            onClick={handleDeleteConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Delete {isLoading ? "..." : ""}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteEnrollmentModal;
