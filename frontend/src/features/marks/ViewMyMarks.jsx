import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";

const ViewStudentMarks = () => {
  const axios = useAxiosPrivate();
  const { user } = useAuth();

  const [records, setRecords] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ===================== HELPERS ===================== */
  const average = (...values) => {
    const valid = values.filter(
      (v) => v !== null && v !== undefined && !isNaN(v)
    );
    if (valid.length === 0) return "-";
    return (valid.reduce((a, b) => a + Number(b), 0) / valid.length).toFixed(1);
  };

  /* ===================== FETCH ALL MARKS ===================== */
  const fetchAllMarks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        `/api/marks/${encodeURIComponent(user.userId)}`
      );
      setRecords(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load marks");
      toast.error("Failed to fetch marks");
    } finally {
      setIsLoading(false);
    }
  };

  /* ===================== FETCH MARKS BY SESSION ===================== */
  const fetchMarksBySession = async (session) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        `/api/marks/student/${encodeURIComponent(
          user.userId
        )}/session/${encodeURIComponent(session)}`
      );
      setRecords(res.data.data || []);
    } catch (err) {
      setError("Failed to load marks for session");
      toast.error("Failed to fetch session marks");
    } finally {
      setIsLoading(false);
    }
  };

  /* ===================== FETCH SESSIONS ===================== */
  const fetchSessions = async () => {
    try {
      const res = await axios.get(
        `/api/enrollments/sessions/${encodeURIComponent(user.userId)}`
      );
      setSessions(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load sessions");
    }
  };

  /* ===================== EFFECTS ===================== */
  useEffect(() => {
    if (user?.userId) {
      fetchAllMarks();
      fetchSessions();
    }
  }, [user?.userId]);

  /* ===================== HANDLERS ===================== */
  const handleSessionChange = (e) => {
    const session = e.target.value;
    setSelectedSession(session);

    if (!session) {
      fetchAllMarks();
    } else {
      fetchMarksBySession(session);
    }
  };

  /* ===================== UI ===================== */
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <p className="text-xs text-gray-500">
          Student theory and practical performance overview.
        </p>

        {/* Session Filter */}
        <select
          value={selectedSession}
          onChange={handleSessionChange}
          className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00966d]"
        >
          <option value="">All Sessions</option>
          {sessions.map((s, idx) => (
            <option key={idx} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="flex flex-col items-center py-20 bg-white rounded-xl border">
          <Spinner />
          <p className="mt-4 text-gray-500 text-sm">Loading records...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b text-[10px] uppercase font-bold text-gray-500">
              <tr>
                <th className="px-4 py-4">Adm No</th>
                <th className="px-4 py-4">Unit</th>

                <th className="px-4 py-4">T1</th>
                <th className="px-4 py-4">T2</th>
                <th className="px-4 py-4">T3</th>
                <th className="px-4 py-4">Theory Avg</th>

                <th className="px-4 py-4">P1</th>
                <th className="px-4 py-4">P2</th>
                <th className="px-4 py-4">P3</th>
                <th className="px-4 py-4">Prac Avg</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {records.length === 0 && (
                <tr>
                  <td
                    colSpan="10"
                    className="px-6 py-6 text-center text-gray-500"
                  >
                    No records found.
                  </td>
                </tr>
              )}

              {records.map((r) => (
                <tr
                  key={r.markId}
                  className="hover:bg-green-50/30 transition-colors"
                >
                  <td className="px-4 py-3 text-xs font-mono font-semibold">
                    {user?.userId}
                  </td>

                  <td className="px-4 py-3 text-sm font-semibold">
                    {r.Unit?.unitCode} — {r.Unit?.unitName}
                  </td>

                  <td className="px-4 py-3">{r.theory1}</td>
                  <td className="px-4 py-3">{r.theory2}</td>
                  <td className="px-4 py-3">{r.theory3}</td>
                  <td className="px-4 py-3 font-bold text-red-600">
                    {average(r.theory1, r.theory2, r.theory3)}
                  </td>

                  <td className="px-4 py-3">{r.prac1}</td>
                  <td className="px-4 py-3">{r.prac2}</td>
                  <td className="px-4 py-3">{r.prac3}</td>
                  <td className="px-4 py-3 font-bold text-red-600">
                    {average(r.prac1, r.prac2, r.prac3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewStudentMarks;
