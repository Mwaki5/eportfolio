import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import { FaUser, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import Modal from "../../components/Modal";
import SearchBar from "../../components/SearchBar";
import Input from "../../components/Input";
import Button from "../../components/Button";

const ViewStudents = () => {
  const axios = useAxiosPrivate();
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchTerm = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get("/api/students");
        setStudents(res.data.data || []);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch students");
        toast.error("Failed to load students");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [axios]);

  const handleSearch = async (query) => {
    if (!query.length) {
      // Reload all students if search is empty
      try {
        const res = await axios.get("/api/students");
        setStudents(res.data.data || []);
      } catch (error) {
        toast.error("Failed to load students");
      }
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.get(`/api/students/search?userId=${query}`);
      setStudents(res.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Search failed");
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedStudent) return;

    try {
      await axios.delete(`/api/students/${selectedStudent.userId}`);
      toast.success("Student deleted successfully");
      setStudents(students.filter((s) => s.userId !== selectedStudent.userId));
      setDeleteModalOpen(false);
      setSelectedStudent(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete student");
    }
  };

  if (isLoading && students.length === 0) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col justify-between items-center flex-wrap ">
        <div className="flex ">
          <Input
            name="searchTerm"
            onChange={handleSearchTerm}
            placeholder="Search by ID, name, or email..."
          />
          <Button onClick={(setSearchQuery) => handleSearch(setSearchQuery)}>
            {" "}
            Search
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {students.length === 0 && !isLoading ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
          <FaUser className="text-5xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            No Students Found
          </h3>
          <p className="text-gray-600 mb-6">
            Get started by adding your first student.
          </p>
          <Link
            to="/staff/add-student"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            Add Student
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Student ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Department
                </th>
                <th scope="col" className="px-6 py-3">
                  Gender
                </th>
                <th scope="col" className="px-6 py-3">
                  Level
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student.userId}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {student.userId}
                  </td>
                  <td className="px-6 py-4">
                    {student.firstname} {student.lastname}
                  </td>
                  <td className="px-6 py-4">{student.email}</td>
                  <td className="px-6 py-4">{student.department}</td>
                  <td className="px-6 py-4">{student.gender}</td>
                  <td className="px-6 py-4">{student.level || "N/A"}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/staff/student/edit/details?studentId=${student.userId}`}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <FaEdit /> Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(student)}
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
            Are you sure you want to delete student{" "}
            <strong>
              {selectedStudent?.firstname} {selectedStudent?.lastname}
            </strong>{" "}
            ({selectedStudent?.userId})? This action cannot be undone.
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedStudent(null);
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

export default ViewStudents;
