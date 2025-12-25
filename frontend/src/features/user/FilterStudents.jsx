import React, { useState, useEffect, useCallback } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaPlus, FaTimes, FaPrint } from "react-icons/fa";

import FormTitle from "../../components/FormTitle";
import UpdateStudent from "./EditStudentModal";
import DeleteStudent from "./DeleteStudentModal";

const EditStudent = () => {
  const axios = useAxiosPrivate();
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Filter states
  const [activeFilters, setActiveFilters] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("department");
  const [currentValue, setCurrentValue] = useState("");

  const schemaOptions = {
    email: [],
    firstname: [],
    lastname: [],
    department: [
      "Computer Science",
      "Engineering",
      "Mathematics",
      "Business",
      "Accounting",
    ],
    level: ["100", "200", "300", "400", "500"],
    gender: ["Male", "Female"],
    role: ["student", "staff", "admin"],
  };

  /** FETCH STUDENTS */
  const fetchStudents = useCallback(
    async (filters = []) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        filters.forEach((f) => {
          if (f.value) params.append(f.category, f.value);
        });

        const url =
          params.toString() === ""
            ? `/api/students`
            : `/api/students/filter?${params.toString()}`;
        const res = await axios.get(url);
        setStudents(res.data.data || []);
      } catch (error) {
        toast.error("Error fetching filtered results");
      } finally {
        setIsLoading(false);
      }
    },
    [axios]
  );

  useEffect(() => {
    fetchStudents(activeFilters);
  }, [activeFilters, fetchStudents]);

  /** DELETE STUDENT */
  const handleDeleteConfirm = async () => {
    if (!selectedStudent) return;
    setIsLoading(true);
    try {
      await axios.delete(`/api/students/${selectedStudent.userId}`);
      toast.success("Student record removed successfully");
      setStudents((prev) =>
        prev.filter((s) => s.userId !== selectedStudent.userId)
      );
      setDeleteModalOpen(false);
      setSelectedStudent(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete student");
    } finally {
      setIsLoading(false);
    }
  };

  /** FILTER FUNCTIONS */
  const addFilter = () => {
    if (!currentValue) return;
    const newFilter = { category: currentCategory, value: currentValue };
    setActiveFilters((prev) => [
      ...prev.filter((f) => f.category !== currentCategory),
      newFilter,
    ]);
    setCurrentValue("");
  };

  const removeFilter = (category) => {
    setActiveFilters((prev) => prev.filter((f) => f.category !== category));
  };

  /** PRINT FUNCTION */
  const handlePrint = () => {
    window.print(); // Uses CSS media query to hide everything except table
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        {/* FILTER BUILDER */}
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm mt-4">
          <div className="flex flex-row items-end gap-2">
            <div className="flex flex-col w-32">
              <label className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">
                Field
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

            <div className="flex flex-col flex-1">
              <label className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">
                Value
              </label>
              <div className="flex gap-2">
                <input
                  list="multilevel-datalist"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(e.target.value)}
                  placeholder={`Search by ${currentCategory}...`}
                  className="h-9 w-full border border-gray-300 rounded-md text-xs px-3 outline-none focus:ring-1 focus:ring-green-500"
                />
                <datalist id="multilevel-datalist">
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

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
              {activeFilters.map((filter) => (
                <div
                  key={filter.category}
                  className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200 text-[11px] font-medium"
                >
                  <span className="text-gray-400 font-normal">
                    {filter.category}:
                  </span>{" "}
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

      {/* PRINT BUTTON */}
      {!isLoading && students.length > 0 && (
        <div className="flex justify-end mb-2">
          <button
            onClick={handlePrint}
            className="h-9 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <FaPrint size={14} /> Print Table
          </button>
        </div>
      )}

      {/* DATA TABLE */}
      {isLoading && students.length === 0 ? (
        <div className="py-20 flex justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm bg-white">
          <table id="printable-table" className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold border-b">
              <tr>
                <th className="px-6 py-4">Admission No.</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Level</th>
                <th className="px-6 py-4">Gender</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No students found matching the criteria.
                  </td>
                </tr>
              )}
              {students.map((student) => (
                <tr
                  key={student.userId}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">{student.userId}</td>
                  <td className="px-6 py-4">
                    {student.firstname} {student.lastname}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {student.department}
                  </td>
                  <td className="px-6 py-4 italic text-gray-600">
                    {student.level}
                  </td>
                  <td className="px-6 py-4">{student.gender}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EditStudent;
