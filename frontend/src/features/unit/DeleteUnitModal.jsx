import React from "react";
import { FaExclamationTriangle, FaTrashAlt, FaTimes } from "react-icons/fa";
import Modal from "../../components/Modal";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const DeleteUnit = ({
  deleteModalOpen,
  setDeleteModalOpen,
  selectedUnit,
  isLoading,
  setIsLoading,
  setUnits, // pass setUnits from parent to remove deleted unit
  units, // pass current units list
}) => {
  const axios = useAxiosPrivate();

  const handleDeleteConfirm = async () => {
    if (!selectedUnit) return;
    setIsLoading(true);

    try {
      await axios.delete(
        `/api/units/${encodeURIComponent(selectedUnit.unitCode)}`
      );
      toast.success("Unit deleted successfully");

      // Remove deleted unit from parent state immediately
      setUnits(units.filter((unit) => unit.unitCode !== selectedUnit.unitCode));

      setDeleteModalOpen(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to delete unit");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={deleteModalOpen} setIsOpen={setDeleteModalOpen}>
      <div className="max-w-md mx-auto overflow-hidden">
        {/* Warning Header */}
        <div className="flex items-center justify-between p-5 bg-red-50 border-b border-red-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <FaExclamationTriangle size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Remove Unit?</h3>
          </div>
          <button
            onClick={() => setDeleteModalOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          <p className="text-sm text-gray-600 leading-relaxed">
            Are you sure you want to remove this unit from the system? This will
            dissociate all data related to:
          </p>
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
                {selectedUnit?.unitCode}
              </span>
              <span className="text-base font-semibold text-gray-800">
                {selectedUnit?.unitName}
              </span>
              {selectedUnit?.staffId && (
                <span className="text-xs text-gray-500 mt-2 italic">
                  Assigned Trainer: {selectedUnit.staffId}
                </span>
              )}
            </div>
          </div>
          <div className="mt-5 flex items-start gap-2 text-[11px] text-gray-400">
            <span className="font-bold text-red-400 uppercase">Warning:</span>
            <span>
              This action cannot be undone and may affect student enrollment
              records.
            </span>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-end gap-3 p-5 bg-gray-50 border-t border-gray-100">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => setDeleteModalOpen(false)}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-all disabled:opacity-50"
          >
            No, Keep Unit
          </button>
          <button
            type="button"
            onClick={handleDeleteConfirm}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-70 min-w-[120px]"
          >
            {isLoading ? (
              <>
                <Spinner size="small" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <FaTrashAlt size={14} />
                <span>Confirm Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteUnit;
