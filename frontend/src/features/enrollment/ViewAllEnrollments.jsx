import React, { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaSearch, FaBook } from "react-icons/fa";
import { Link } from "react-router-dom";
import UpdateEnrollment from "./UpdateEnrollmentModal";
import DeleteEnrollment from "./DeleteEnrollmentModal";

const EditEnrollment = () => {
  const axios = useAxiosPrivate();
  const searchRef = useRef();

  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [enrollmentToDelete, setEnrollmentToDelete] = useState(null);

  const fetchEnrollments = async (query = "") => {
    setIsLoading(true);

    setError(null);
    try {
      const url = query
        ? `/api/enrollments/search/${encodeURIComponent(query)}`
        : "/api/enrollments";
      const res = await axios.get(url);
      setEnrollments(res.data.data || []);
    } catch (err) {
      console.error("Error fetching enrollments:", err);
      setError(err.response?.data?.message || "Failed to fetch enrollments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
    console.log(enrollments);
  }, []);

  const handleSearch = () => {
    const query = searchRef.current?.value?.trim() || "";
    fetchEnrollments(query);
  };

  const handleUpdateClick = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setUpdateModalOpen(true);
  };

  const handleDeleteClick = (enrollment) => {
    setEnrollmentToDelete(enrollment);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!enrollmentToDelete) return;
    try {
      await axios.delete(`/api/enrollments/${enrollmentToDelete.enrollmentId}`);
      toast.success("Enrollment deleted successfully");
      setEnrollments((prev) =>
        prev.filter((e) => e.enrollmentId !== enrollmentToDelete.enrollmentId)
      );
    } catch (err) {
      toast.error("Failed to delete enrollment");
    } finally {
      setEnrollmentToDelete(null);
      setDeleteModalOpen(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Search Header - Matched to EditStudent/Image */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500 font-medium">
          Manage and update unit enrollment.
        </p>

        <div className="relative group min-w-[350px]">
          <input
            ref={searchRef}
            type="text"
            placeholder="Search unit code or admission no..."
            className="w-full pl-10 pr-24 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00966d] focus:bg-white outline-none transition-all"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00966d]" />
          <button
            onClick={handleSearch}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-5 bg-[#00966d] text-white text-xs font-bold rounded-lg hover:bg-[#007a58] transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Main Table Content */}
      {isLoading && enrollments.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Spinner />
          <p className="mt-4 text-gray-500 text-sm animate-pulse">
            Loading assignments...
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white border-b border-gray-50 text-[10px] uppercase font-bold text-gray-400 tracking-[0.15em]">
                <tr>
                  <th className="px-8 py-5">Unit Code</th>
                  <th className="px-8 py-5"> Name</th>
                  <th className="px-8 py-5">Unit Name</th>
                  <th className="px-8 py-5">Session</th>
                  <th className="px-8 py-5 text-right">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {enrollments.length > 0 ? (
                  enrollments.map((e) => (
                    <tr
                      key={e.enrollmentId}
                      className="hover:bg-green-50/20 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-md font-mono text-xs font-bold uppercase tracking-wider">
                          {e.Unit?.unitCode || "CODE 2"}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-green-100 text-[#00966d] flex items-center justify-center font-bold text-xs uppercase">
                            {e.Staff?.firstname?.[0] || "A"}
                            {e.Staff?.lastname?.[0] || "M"}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-800">
                              {e.Staff
                                ? `${e.Staff.firstname} ${e.Staff.lastname}`
                                : "Ainea Mwaki"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-semibold text-gray-700">
                          {e.Unit?.unitName || "Computer Hardwares"}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-semibold text-gray-700">
                          {e.session || "N/A"}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end items-center gap-4">
                          <button
                            onClick={() => handleUpdateClick(e)}
                            className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-all"
                          >
                            <FaEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(e)}
                            className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                          >
                            <FaTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-8 py-6 text-center text-gray-500"
                    >
                      No enrollment found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <UpdateEnrollment
        updateModalOpen={updateModalOpen}
        setIsLoading={setIsLoading}
        enrollments={enrollments}
        setUpdateModalOpen={setUpdateModalOpen}
        selectedEnrollment={selectedEnrollment}
        setEnrollments={setEnrollments}
      />
      <DeleteEnrollment
        deleteModalOpen={deleteModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        handleDeleteConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default EditEnrollment;
