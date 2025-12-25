import React, { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaSearch, FaBook } from "react-icons/fa";
import { Link } from "react-router-dom";

import UpdateUnit from "./EditUnitModal";
import DeleteUnit from "./DeleteUnitModal";

const EditUnit = () => {
  const axios = useAxiosPrivate();
  const [units, setUnits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);

  // Combined state for edit modal
  const [editModalData, setEditModalData] = useState({
    open: false,
    unit: null,
  });

  // Delete modal state
  const [deleteModalData, setDeleteModalData] = useState({
    open: false,
    unit: null,
  });

  // Fetch units
  const fetchUnits = async (query = "") => {
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = query ? `/api/units/search/${query}` : "/api/units";
      const res = await axios.get(endpoint);
      setUnits(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch units");
      toast.error("Failed to load records");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, [axios]);

  const handleSearch = () => fetchUnits(searchRef.current.value.trim());

  const handleEditClick = (unit) => {
    setEditModalData({ open: true, unit });
  };

  const handleDeleteClick = (unit) => {
    setDeleteModalData({ open: true, unit });
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <p className="text-xs text-gray-500 mt-1">
            Manage and update unit details.
          </p>
        </div>
        <div className="relative group min-w-[320px]">
          <input
            ref={searchRef}
            type="text"
            placeholder="Search by unit code..."
            className="w-full pl-10 pr-20 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#00966d] focus:bg-white outline-none transition-all"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00966d]" />
          <button
            onClick={handleSearch}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-[#00966d] text-white text-xs font-semibold rounded-md hover:bg-[#007a58] transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm text-sm">
          {error}
        </div>
      )}

      {/* Main Table */}
      {isLoading && units.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Spinner />
          <p className="mt-4 text-gray-500 text-sm animate-pulse">
            Loading records...
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Unit Code</th>
                  <th className="px-6 py-4">Trainer</th>
                  <th className="px-6 py-4">Unit Name</th>
                  <th className="px-6 py-4 text-center">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {units.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-sm text-gray-500" // Updated class name
                    >
                      No units found.
                    </td>
                  </tr>
                ) : (
                  units.map((unit) => (
                    <tr
                      key={unit.unitCode}
                      className="hover:bg-green-50/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {unit.unitCode}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 text-[#00966d] flex items-center justify-center font-bold text-xs">
                            {unit.Staff?.firstname?.[0] || "U"}
                            {unit.Staff?.lastname?.[0] || "N"}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-800">
                              {unit.Staff
                                ? `${unit.Staff.firstname} ${unit.Staff.lastname}`
                                : "Unknown Staff"}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              {unit.Staff?.email || "example@mail.com"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-gray-700">
                          {unit.unitName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-3">
                          <button
                            onClick={() => handleEditClick(unit)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors tooltip"
                            title="Edit Unit"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(unit)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Unit"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <UpdateUnit
        isLoading={isLoading}
        setUnits={setUnits}
        units={units}
        selectedUnit={editModalData.unit}
        editModalOpen={editModalData.open}
        setEditModalOpen={(open) =>
          setEditModalData((prev) => ({ ...prev, open }))
        }
        setIsLoading={setIsLoading}
      />

      <DeleteUnit
        setUnits={setUnits}
        units={units}
        isLoading={isLoading}
        selectedUnit={deleteModalData.unit}
        deleteModalOpen={deleteModalData.open}
        setDeleteModalOpen={(open) =>
          setDeleteModalData((prev) => ({ ...prev, open }))
        }
        setIsLoading={setIsLoading}
      />
    </div>
  );
};

export default EditUnit;
