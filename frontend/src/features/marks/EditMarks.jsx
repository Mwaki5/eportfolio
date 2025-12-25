import React, { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import UpdateMark from "./EditMarkModal"; // Modal component for editing marks
import DeleteMark from "./DeleteMarkModal"; // Modal component for deleting marks
import Input from "../../components/Input";
import Button from "../../components/Button";

const EditMarks = () => {
  const axios = useAxiosPrivate();
  const searchRef = useRef(null);

  const [marks, setMarks] = useState([]);
  const [selectedMark, setSelectedMark] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [error, setError] = useState(null);

  // Fetch marks (all or filtered)
  const fetchMarks = async (query = "") => {
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = query
        ? `/api/marks/search/${encodeURIComponent(query)}`
        : "/api/marks";
      const res = await axios.get(endpoint);
      setMarks(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch marks");
      toast.error("Failed to load marks");
      setMarks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarks();
  }, [axios]);

  const handleSearch = () => {
    fetchMarks(searchRef.current.value.trim());
  };

  const handleEditClick = (mark) => {
    setSelectedMark(mark);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (mark) => {
    setSelectedMark(mark);
    setDeleteModalOpen(true);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header + Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <p className="text-xs text-gray-500">
            Manage and update student marks.
          </p>
        </div>

        <div className="relative group min-w-[320px]">
          <input
            ref={searchRef}
            type="text"
            placeholder="Search by student or unit"
            className="w-full pl-10 pr-20 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-600 focus:bg-white outline-none transition-all"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600" />
          <button
            type="button"
            onClick={handleSearch}
            className="absolute right-1 top-1 bottom-1 px-4 bg-green-600 text-white text-xs font-semibold rounded-md hover:bg-green-700 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm text-sm">
          {error}
        </div>
      )}

      {/* Marks Table */}
      {isLoading && marks.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Spinner />
          <p className="mt-4 text-gray-500 text-sm animate-pulse">
            Loading marks...
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase font-bold text-gray-500 tracking-wider">
                <tr>
                  <th className="px-6 py-3">Admission no.</th>
                  <th className="px-6 py-3">Student name</th>
                  <th className="px-6 py-3">Unit</th>
                  <th className="px-6 py-3">Th1</th>
                  <th className="px-6 py-3">Th2</th>
                  <th className="px-6 py-3">Th3</th>
                  <th className="px-6 py-3">Pr1</th>
                  <th className="px-6 py-3">Pr2</th>
                  <th className="px-6 py-3">Pr3</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {marks.length === 0 && !isLoading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No marks found.
                    </td>
                  </tr>
                ) : (
                  marks.map((mark) => (
                    <tr
                      key={mark.markId}
                      className="hover:bg-green-50/30 transition-colors group"
                    >
                      <td className="px-6 py-4"> {mark.User?.userId} </td>
                      <td className="px-6 py-4">
                        {mark.User?.firstname} {mark.User?.lastname}
                      </td>
                      <td className="px-6 py-4">{mark.Unit?.unitCode}</td>
                      <td className="px-6 py-4">{mark.theory1 ?? "-"}</td>
                      <td className="px-6 py-4">{mark.theory2 ?? "-"}</td>
                      <td className="px-6 py-4">{mark.theory3 ?? "-"}</td>
                      <td className="px-6 py-4">{mark.prac1 ?? "-"}</td>
                      <td className="px-6 py-4">{mark.prac2 ?? "-"}</td>
                      <td className="px-6 py-4">{mark.prac3 ?? "-"}</td>
                      <td className="px-6 py-4 text-center flex justify-center gap-3">
                        <button
                          onClick={() => handleEditClick(mark)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(mark)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FaTrash size={16} />
                        </button>
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
      <UpdateMark
        selectedMark={selectedMark}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        marks={marks}
        setMarks={setMarks}
        editModalOpen={editModalOpen}
        setEditModalOpen={setEditModalOpen}
      />
      <DeleteMark
        selectedMark={selectedMark}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        marks={marks}
        setMarks={setMarks}
        deleteModalOpen={deleteModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
      />
    </div>
  );
};

export default EditMarks;
