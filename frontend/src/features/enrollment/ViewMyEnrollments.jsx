import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";

const ViewMyEnrollments = () => {
  const axios = useAxiosPrivate();
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!user?.userId) return;
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `/api/enrollments/student/${encodeURIComponent(user.userId)}`
        );
        setEnrollments(res.data.data || []);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to fetch enrollments"
        );
        toast.error("Failed to load enrollments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrollments();
  }, [axios, user?.userId]);

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
          My Enrolled Units
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View all units you are enrolled in
        </p>
      </div>

      {error && (
        <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {enrollments.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-green-200 rounded-2xl p-12 text-center max-w-2xl mx-auto">
          <p className="text-gray-600">You have no enrolled units yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">Unit Code</th>
                <th className="px-4 py-3">Session</th>
                <th className="px-4 py-3">Instructor ID</th>
                <th className="px-4 py-3">Enrolled On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {enrollments.map((enrollment) => (
                <tr
                  key={enrollment.enrollmentId}
                  className="hover:bg-green-50/30 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {enrollment.Unit?.unitCode || enrollment.unitCode}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {enrollment.session}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {enrollment.Unit?.firstname || "N/A"}{" "}
                    {enrollment.Unit?.lastname || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatDate(enrollment.createdAt)}
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

export default ViewMyEnrollments;
