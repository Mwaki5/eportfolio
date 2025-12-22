import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import { FaFile, FaEdit, FaTrash, FaDownload } from "react-icons/fa";
import { Link } from "react-router-dom";
import Modal from "../../components/Modal";

const ViewAllEvidence = () => {
  const axios = useAxiosPrivate();
  const [evidence, setEvidence] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);

  useEffect(() => {
    const fetchEvidence = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get("/api/evidence");
        setEvidence(res.data.data || []);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch evidence");
        toast.error("Failed to load evidence");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvidence();
  }, [axios]);

  const handleDeleteClick = (item) => {
    setSelectedEvidence(item);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEvidence) return;

    try {
      await axios.delete(`/api/evidence/${selectedEvidence.id}`);
      toast.success("Evidence deleted successfully");
      setEvidence(evidence.filter((e) => e.id !== selectedEvidence.id));
      setDeleteModalOpen(false);
      setSelectedEvidence(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete evidence");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getFileUrl = (filename) => {
    return `http://localhost:3400/${filename}`;
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          All Evidence
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View and manage all submitted evidence
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {evidence.length === 0 && !isLoading ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
          <FaFile className="text-5xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            No Evidence Found
          </h3>
          <p className="text-gray-600">
            No evidence has been submitted yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Student ID</th>
                <th scope="col" className="px-6 py-3">Student Name</th>
                <th scope="col" className="px-6 py-3">Unit Code</th>
                <th scope="col" className="px-6 py-3">File Name</th>
                <th scope="col" className="px-6 py-3">Description</th>
                <th scope="col" className="px-6 py-3">Uploaded Date</th>
                <th scope="col" className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {evidence.map((item) => (
                <tr
                  key={item.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {item.studentId}
                  </td>
                  <td className="px-6 py-4">
                    {item.User
                      ? `${item.User.firstname} ${item.User.lastname}`
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">{item.unitCode}</td>
                  <td className="px-6 py-4">
                    <a
                      href={getFileUrl(item.filename)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <FaDownload /> {item.originalname}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    {item.description || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {formatDate(item.uploadedAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/staff/evidence/edit?id=${item.id}`}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <FaEdit /> Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(item)}
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
            Are you sure you want to delete this evidence? This action cannot be
            undone.
          </p>
          {selectedEvidence && (
            <div className="mb-4 p-2 bg-gray-100 rounded">
              <p>
                <strong>Student ID:</strong> {selectedEvidence.studentId}
              </p>
              <p>
                <strong>Unit Code:</strong> {selectedEvidence.unitCode}
              </p>
              <p>
                <strong>File:</strong> {selectedEvidence.originalname}
              </p>
            </div>
          )}
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedEvidence(null);
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

export default ViewAllEvidence;

