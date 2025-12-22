import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import { FaBook, FaUser, FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Modal from "../../components/Modal";

const ViewUnits = () => {
  const axios = useAxiosPrivate();
  const [units, setUnits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  useEffect(() => {
    const fetchUnits = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get("/api/units");
        setUnits(res.data.data || []);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch units");
        toast.error("Failed to load units");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnits();
  }, [axios]);

  const handleDeleteClick = (unit) => {
    setSelectedUnit(unit);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUnit) return;

    try {
      await axios.delete(`/api/units/${selectedUnit.unitCode}`);
      toast.success("Unit deleted successfully");
      setUnits(units.filter((u) => u.unitCode !== selectedUnit.unitCode));
      setDeleteModalOpen(false);
      setSelectedUnit(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete unit");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            All Units
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View and manage all units
          </p>
        </div>
        <Link
          to="/staff/add-unit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaBook /> Add Unit
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {units.length === 0 && !isLoading ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
          <FaBook className="text-5xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            No Units Found
          </h3>
          <p className="text-gray-600 mb-6">
            Get started by adding your first unit.
          </p>
          <Link
            to="/staff/add-unit"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            Add Unit
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Unit Code</th>
                <th scope="col" className="px-6 py-3">Unit Name</th>
                <th scope="col" className="px-6 py-3">Staff ID</th>
                <th scope="col" className="px-6 py-3">Staff Name</th>
                <th scope="col" className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {units.map((unit, index) => (
                <tr
                  key={unit.unitCode}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {unit.unitCode}
                  </td>
                  <td className="px-6 py-4">{unit.unitName}</td>
                  <td className="px-6 py-4">{unit.staffId}</td>
                  <td className="px-6 py-4">
                    {unit.Staff
                      ? `${unit.Staff.firstname} ${unit.Staff.lastname}`
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/staff/admin/unit/edit?unitCode=${unit.unitCode}`}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <FaEdit /> Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(unit)}
                        className="text-red-600 hover:text-red-800 flex items-center gap-1"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModalOpen} setIsOpen={setDeleteModalOpen}>
        <div className="p-4">
          <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
          <p className="mb-4">
            Are you sure you want to delete unit{" "}
            <strong>{selectedUnit?.unitCode}</strong>? This action cannot be
            undone.
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedUnit(null);
              }}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ViewUnits;

