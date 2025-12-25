import React from "react";
import Modal from "../../components/Modal";
import { FaExclamationTriangle, FaTrashAlt, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Button from "../../components/Button";

const DeleteMark = ({
  deleteModalOpen,
  setDeleteModalOpen,
  selectedMark,
  marks,
  setMarks,
  isLoading,
  setIsLoading,
}) => {
  const axios = useAxiosPrivate();

  const handleDeleteConfirm = async () => {
    if (!selectedMark) return;
    setIsLoading(true);
    try {
      await axios.delete(`/api/marks/${selectedMark.markId}`);
      setMarks(marks.filter((m) => m.markId !== selectedMark.markId));
      toast.success("Mark deleted successfully");
      setDeleteModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete mark");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={deleteModalOpen} setIsOpen={setDeleteModalOpen}>
      <div className="p-4 max-w-md mx-auto">
        <div className="flex items-center justify-between p-3 bg-red-50 border-b border-red-100">
          <div className="flex items-center gap-2">
            <FaExclamationTriangle className="text-red-600" />
            <h3 className="text-lg font-bold text-red-700">Delete Mark?</h3>
          </div>
          <button
            onClick={() => setDeleteModalOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete the mark of{" "}
            <strong>
              {selectedMark?.User?.firstname} {selectedMark?.User?.lastname}
            </strong>{" "}
            for <strong>{selectedMark?.Unit?.unitCode}</strong>? This action
            cannot be undone.
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner size="small" /> Deleting...
                </>
              ) : (
                <>
                  <FaTrashAlt /> Delete
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteMark;
