import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import { FaGraduationCap, FaChartLine, FaClipboardList, FaAward } from "react-icons/fa";

const ViewMyMarks = () => {
  const axios = useAxiosPrivate();
  const { user } = useAuth();
  const [marks, setMarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarks = async () => {
      if (!user?.userId) return;

      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/marks/student/${user.userId}`);
        setMarks(res.data.data || []);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch marks");
        toast.error("Failed to load marks");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarks();
  }, [axios, user?.userId]);

  const calculateTotal = (mark) => {
    const theoryTotal =
      (mark.theory1 || 0) + (mark.theory2 || 0) + (mark.theory3 || 0);
    const pracTotal = (mark.prac1 || 0) + (mark.prac2 || 0) + (mark.prac3 || 0);
    return theoryTotal + pracTotal;
  };

  const getGrade = (total) => {
    if (total >= 70) return { grade: "A", color: "text-green-600" };
    if (total >= 60) return { grade: "B", color: "text-blue-600" };
    if (total >= 50) return { grade: "C", color: "text-yellow-600" };
    if (total >= 40) return { grade: "D", color: "text-orange-600" };
    return { grade: "F", color: "text-red-600" };
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
          My Marks
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View all your marks and grades
        </p>
      </div>

      {error && (
        <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {marks.length === 0 && !isLoading ? (
        <div className="bg-white border-2 border-dashed border-green-200 rounded-2xl p-12 text-center max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
              <FaClipboardList className="text-5xl text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            No Marks Available Yet
          </h3>
          <p className="text-gray-600 mb-6 text-lg">
            Your marks will appear here once your instructors have recorded them. Keep checking back to track your academic progress!
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 rounded-xl border border-green-200">
            <FaAward className="text-green-600" />
            <span className="text-green-700 font-medium">Marks will be updated by your instructors</span>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">What to expect?</p>
            <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-600">
              <span className="px-3 py-1 bg-green-50 rounded-full">📝 Theory Marks</span>
              <span className="px-3 py-1 bg-green-50 rounded-full">🔬 Practical Marks</span>
              <span className="px-3 py-1 bg-green-50 rounded-full">📊 Overall Grades</span>
              <span className="px-3 py-1 bg-green-50 rounded-full">🏆 Performance</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {marks.map((mark) => {
            const total = calculateTotal(mark);
            const { grade, color } = getGrade(total);
            return (
              <div
                key={mark.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 card-hover"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                      <FaChartLine className="text-green-600 dark:text-green-400 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                        {mark.Unit?.unitCode || mark.unitCode}
                      </h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${color}`}>{grade}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Total: {total}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Theory 1
                    </p>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {mark.theory1 ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Theory 2
                    </p>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {mark.theory2 ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Theory 3
                    </p>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {mark.theory3 ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Practical 1
                    </p>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {mark.prac1 ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Practical 2
                    </p>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {mark.prac2 ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Practical 3
                    </p>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {mark.prac3 ?? "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ViewMyMarks;

