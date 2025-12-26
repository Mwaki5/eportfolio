import React, { useState, useEffect, useCallback } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaPlus, FaTimes, FaSearch } from "react-icons/fa";
import FormTitle from "../../components/FormTitle";
import UpdateEnrollment from "./UpdateEnrollmentModal";
import DeleteEnrollment from "./DeleteEnrollmentModal";
import { FaFilter } from "react-icons/fa6";

const FilterEnrollment = () => {
  const axios = useAxiosPrivate();
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  // Filter States
  const [activeFilters, setActiveFilters] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("studentName");
  const [currentValue, setCurrentValue] = useState("");

  // Define filter options
  const schemaOptions = {
    unitCode: [],
    level: ["Level 4", "Level 5", "Level 6"],
    semester: ["2025/2026 April", "Summer", "Fall"],
  };

  /** Fetch enrollments based on active filters */
  const fetchEnrollments = useCallback(
    async (filters = []) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        filters.forEach((f) => {
          if (f.value) params.append(f.category, f.value);
        });

        const res = await axios.get(
          `/api/enrollments/filter?${params.toString()}`
        );
        setEnrollments(res.data.data || []);
        console.log(enrollments);
      } catch (error) {
        console.error("Error fetching enrollments:", error);
        toast.error("Error fetching enrollments");
      } finally {
        setIsLoading(false);
      }
    },
    [axios]
  );

  useEffect(() => {
    fetchEnrollments(activeFilters);
  }, [activeFilters, fetchEnrollments]);

  /** Delete enrollment */
  const handleDeleteConfirm = async () => {
    if (!selectedEnrollment) return;
    setIsLoading(true);
    try {
      await axios.delete(`/api/enrollments/${selectedEnrollment.id}`);
      toast.success("Enrollment removed successfully");
      setEnrollments((prev) =>
        prev.filter((e) => e.id !== selectedEnrollment.id)
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

  /** Add filter */
  const addFilter = () => {
    if (!currentValue) return;
    const newFilter = { category: currentCategory, value: currentValue };
    const filtered = activeFilters.filter(
      (f) => f.category !== currentCategory
    );
    setActiveFilters([...filtered, newFilter]);
    setCurrentValue("");
  };

  /** Remove filter */
  const removeFilter = (category) => {
    setActiveFilters(activeFilters.filter((f) => f.category !== category));
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm mt-4">
          <div className="flex flex-row items-end gap-2">
            {/* Filter Category */}
            <div className="flex flex-col w-32">
              <label className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider flex items-center gap-1">
                <FaFilter size={8} /> Filter By
              </label>
              <select
                value={currentCategory}
                onChange={(e) => {
                  setCurrentCategory(e.target.value);
                  setCurrentValue("");
                }}
                className="h-9 border border-gray-300 rounded-md text-xs px-2 bg-gray-50 outline-none focus:ring-1 focus:ring-green-500"
              >
                {Object.keys(schemaOptions).map((key) => (
                  <option key={key} value={key}>
                    {key.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Value */}
            <div className="flex flex-col flex-1">
              <label className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider flex items-center gap-1">
                <FaSearch size={8} /> SEARCH VALUE
              </label>
              <div className="flex gap-2">
                <input
                  list="enrollment-datalist"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(e.target.value)}
                  placeholder={`Search by ${currentCategory}...`}
                  className="h-9 w-full border border-gray-300 rounded-md text-xs px-3 outline-none focus:ring-1 focus:ring-green-500"
                />
                <datalist id="enrollment-datalist">
                  {schemaOptions[currentCategory]?.map((opt) => (
                    <option key={opt} value={opt} />
                  ))}
                </datalist>
                <button
                  onClick={addFilter}
                  className="h-9 px-6 bg-[#00966d] hover:bg-[#007a58] text-white rounded-md flex items-center justify-center transition-all shadow-sm"
                >
                  <FaPlus size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
              {activeFilters.map((filter) => (
                <div
                  key={filter.category}
                  className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200 text-[11px] font-medium"
                >
                  <span className="text-gray-400 font-normal">
                    {filter.category}:{" "}
                  </span>
                  {filter.value}
                  <button
                    onClick={() => removeFilter(filter.category)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <FaTimes size={10} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setActiveFilters([])}
                className="text-[10px] text-red-500 hover:underline ml-1 font-semibold uppercase tracking-tighter"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Enrollment Table */}
      {isLoading && enrollments.length === 0 ? (
        <div className="py-20 flex justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm bg-white">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold border-b">
              <tr>
                <th className="px-6 py-4">Admission No.</th>
                <th className="px-6 py-4">Unit Name</th>
                <th className="px-6 py-4">Level</th>
                <th className="px-6 py-4">Semester</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {enrollments.map((enrollment) => (
                <tr
                  key={enrollment.enrollmentId}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {enrollment.User?.userId}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {enrollment.Unit?.unitName}
                  </td>
                  <td className="px-6 py-4 italic text-gray-600">
                    {enrollment.User.level}
                  </td>
                  <td className="px-6 py-4">{enrollment.session}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FilterEnrollment;
