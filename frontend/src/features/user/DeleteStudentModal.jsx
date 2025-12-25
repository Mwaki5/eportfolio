import React from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import { FaExclamationTriangle, FaTrashAlt } from "react-icons/fa";
import Modal from "../../components/Modal";

const DeleteStudent = ({
  students,
  setStudents,
  isLoading,
  selectedStudent,
  setDeleteModalOpen,
  deleteModalOpen,
  setIsLoading,
}) => {
  const axios = useAxiosPrivate();

  const handleDeleteConfirm = async () => {
    if (!selectedStudent) return;

    setIsLoading(true);
    try {
      await axios.delete(
        `/api/students/${encodeURIComponent(selectedStudent.userId)}`
      );

      toast.success(
        `${selectedStudent.firstname}'s record has been deleted successfully.`
      );

      setStudents(students.filter((s) => s.userId !== selectedStudent.userId));
      setDeleteModalOpen(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete student record."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={deleteModalOpen} setIsOpen={setDeleteModalOpen}>
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 p-6 bg-red-50 border-b border-red-100">
          <div className="p-3 bg-red-100 text-red-600 rounded-xl">
            <FaExclamationTriangle size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Confirm Student Deletion
            </h3>
            <p className="text-xs text-red-600">
              This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            You are about to permanently remove the following student from the
            system:
          </p>

          {/* Student Summary */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-800">
                {selectedStudent?.firstname} {selectedStudent?.lastname}
              </span>
              <span className="text-xs text-gray-500 font-mono mt-1">
                ID: {selectedStudent?.userId}
              </span>
              <span className="text-xs text-gray-400 mt-1 italic">
                {selectedStudent?.department} • {selectedStudent?.level}
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            All related academic and enrollment data will also be removed.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 p-6 bg-gray-50 border-t border-gray-100">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => setDeleteModalOpen(false)}
            className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={handleDeleteConfirm}
            className={`flex items-center justify-center gap-2 px-6 py-2 text-sm font-bold text-white rounded-lg shadow-sm transition-all min-w-[140px]
              ${
                isLoading
                  ? "bg-red-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 hover:shadow-md"
              }`}
          >
            {isLoading ? (
              <Spinner size="small" />
            ) : (
              <>
                <FaTrashAlt size={14} />
                Delete Student
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteStudent;
