import React, { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import UpdateStudent from "./EditStudentModal";
import DeleteStudent from "./DeleteStudentModal";

const EditStudent = () => {
  const axios = useAxiosPrivate();
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const searchRef = useRef(null);

  // Optimized Fetching
  const fetchStudents = async (query = "") => {
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = query
        ? `/api/students/search/${encodeURIComponent(query)}`
        : "/api/students";
      const res = await axios.get(endpoint);
      setStudents(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch students");
      toast.error("Failed to load records");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [axios]);

  const handleSearch = () => {
    fetchStudents(searchRef.current.value.trim());
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    setDeleteModalOpen(true);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <p className="text-xs text-gray-500 mt-1">
            Manage and update student academic profiles.
          </p>
        </div>

        <div className="relative group min-w-[320px]">
          <input
            ref={searchRef}
            type="text"
            placeholder="Search by Adm no or email..."
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

      {/* Main Content Area */}
      {isLoading && students.length === 0 ? (
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
                  <th className="px-6 py-4">Identification</th>
                  <th className="px-6 py-4">Full Name</th>
                  <th className="px-6 py-4">Academic Info</th>
                  <th className="px-6 py-4">Gender</th>
                  <th className="px-6 py-4 text-center">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {students.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No students found matching the criteria.
                    </td>
                  </tr>
                )}
                {students.map((student) => (
                  <tr
                    key={student.userId}
                    className="hover:bg-green-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {student.userId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-[#00966d] flex items-center justify-center font-bold text-xs">
                          {student.firstname[0]}
                          {student.lastname[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-800">
                            {student.firstname} {student.lastname}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            {student.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-gray-700">
                          {student.department}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          Level: {student.level || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 w-fit font-bold uppercase">
                          {student.gender}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={() => handleEditClick(student)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors tooltip"
                          title="Edit Details"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(student)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Record"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <UpdateStudent
        isLoading={isLoading}
        setStudents={setStudents}
        students={students}
        selectedStudent={selectedStudent}
        setEditModalOpen={setEditModalOpen}
        editModalOpen={editModalOpen}
        setIsLoading={setIsLoading}
      />
      <DeleteStudent
        setStudents={setStudents}
        students={students}
        isLoading={isLoading}
        selectedStudent={selectedStudent}
        setDeleteModalOpen={setDeleteModalOpen}
        deleteModalOpen={deleteModalOpen}
        setIsLoading={setIsLoading}
      />
    </div>
  );
};

export default EditStudent;
