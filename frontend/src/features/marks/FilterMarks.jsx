import React, { useState, useEffect, useCallback } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaFilter,
  FaSearch,
  FaPrint,
} from "react-icons/fa";
import { toast } from "react-toastify";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Spinner from "../../components/Spinner";
import FormTitle from "../../components/FormTitle";

const ViewMarks = () => {
  const axios = useAxiosPrivate();
  const [marks, setMarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Multilevel Filter States
  const [activeFilters, setActiveFilters] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("unitCode");
  const [currentValue, setCurrentValue] = useState("");

  const schemaOptions = {
    unitCode: [],
    session: ["2023/2024", "2024/2025"],
    userId: [],
    trainer: [],
  };

  const fetchMarks = useCallback(
    async (filters = []) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        filters.forEach((f) => {
          if (f.value) params.append(f.category, f.value);
        });
        const res = await axios.get(`/api/marks?${params.toString()}`);
        setMarks(res.data.data || []);
      } catch (error) {
        toast.error("Error fetching filtered marks");
      } finally {
        setIsLoading(false);
      }
    },
    [axios]
  );

  useEffect(() => {
    fetchMarks(activeFilters);
  }, [activeFilters, fetchMarks]);

  const addFilter = () => {
    if (!currentValue) return;
    const newFilter = { category: currentCategory, value: currentValue };
    setActiveFilters([
      ...activeFilters.filter((f) => f.category !== currentCategory),
      newFilter,
    ]);
    setCurrentValue("");
  };

  const removeFilter = (category) => {
    setActiveFilters(activeFilters.filter((f) => f.category !== category));
  };

  const MarkCell = ({ val }) => (
    <td className="px-4 py-3 text-center">
      {val !== null ? (
        <span
          className={`font-mono font-bold ${
            val < 40 ? "text-red-500" : "text-gray-700"
          }`}
        >
          {val}
        </span>
      ) : (
        <span className="text-gray-300">-</span>
      )}
    </td>
  );

  /** PRINT TABLE */
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full space-y-4">
      {/* FILTER BUILDER */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm no-print">
        <div className="flex flex-col md:flex-row items-end gap-3">
          <div className="flex flex-col w-full md:w-40">
            <label className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider flex items-center gap-1">
              <FaFilter size={8} /> Filter By
            </label>
            <select
              value={currentCategory}
              onChange={(e) => {
                setCurrentCategory(e.target.value);
                setCurrentValue("");
              }}
              className="h-10 border border-gray-200 rounded-lg text-xs px-3 bg-gray-50 outline-none focus:ring-2 focus:ring-green-500/20"
            >
              <option value="unitCode">Unit Code</option>
              <option value="session">Session</option>
              <option value="userId">Trainer ID</option>
            </select>
          </div>

          <div className="flex flex-col flex-1 w-full">
            <label className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider flex items-center gap-1">
              <FaSearch size={8} /> Search Value
            </label>
            <div className="flex gap-2">
              <input
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addFilter()}
                placeholder={`Search ${currentCategory}...`}
                className="h-10 w-full border border-gray-200 rounded-lg text-xs px-4 outline-none focus:ring-2 focus:ring-green-500/20 shadow-sm"
              />
              <button
                onClick={addFilter}
                className="h-10 px-5 bg-green-700 hover:bg-green-800 text-white rounded-lg flex items-center justify-center transition-all shadow-md active:scale-95"
              >
                <FaPlus size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* FILTER CHIPS */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-50">
            {activeFilters.map((filter) => (
              <div
                key={filter.category}
                className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-100 text-[11px] font-semibold"
              >
                <span className="opacity-60 uppercase text-[9px]">
                  {filter.category}:
                </span>
                {filter.value}
                <button
                  onClick={() => removeFilter(filter.category)}
                  className="hover:text-red-500 transition-colors ml-1"
                >
                  <FaTimes size={10} />
                </button>
              </div>
            ))}
            <button
              onClick={() => setActiveFilters([])}
              className="text-[10px] text-red-500 hover:underline px-2 font-bold uppercase tracking-tight"
            >
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* MARKS TABLE */}
      {!isLoading && marks.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handlePrint}
            className="h-10 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center justify-center gap-2 transition-all shadow-sm no-print"
          >
            <FaPrint size={14} /> Print Table
          </button>
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading && marks.length === 0 ? (
          <div className="py-20 flex justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table id="printable-table" className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] font-black border-b tracking-widest">
                <tr>
                  <th className="px-6 py-4">Student & Unit</th>
                  <th className="px-4 py-4 text-center bg-blue-50/30">T1</th>
                  <th className="px-4 py-4 text-center bg-blue-50/30">T2</th>
                  <th className="px-4 py-4 text-center bg-blue-50/30">T3</th>
                  <th className="px-4 py-4 text-center bg-green-50/30">P1</th>
                  <th className="px-4 py-4 text-center bg-green-50/30">P2</th>
                  <th className="px-4 py-4 text-center bg-green-50/30">P3</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {marks.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No marks found.
                    </td>
                  </tr>
                ) : (
                  marks.map((mark) => (
                    <tr
                      key={mark.markId}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-800 capitalize">
                          {mark.User?.firstname} {mark.User?.lastname}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono">
                          {mark.Unit?.unitCode} •{" "}
                          <span className="text-blue-500">{mark.session}</span>
                        </div>
                      </td>
                      <MarkCell val={mark.theory1} />
                      <MarkCell val={mark.theory2} />
                      <MarkCell val={mark.theory3} />
                      <MarkCell val={mark.prac1} />
                      <MarkCell val={mark.prac2} />
                      <MarkCell val={mark.prac3} />
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewMarks;
