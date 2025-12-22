import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import { FaBook, FaCalendarAlt, FaPlusCircle, FaGraduationCap } from "react-icons/fa";
import { Link } from "react-router-dom";

const ViewMyEnrollments = () => {
  const axios = useAxiosPrivate();
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!user?.userId) return;

      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/enrollments/student/${user.userId}`);
        setEnrollments(res.data.data || []);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch enrollments");
        toast.error("Failed to load enrollments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrollments();
  }, [axios, user?.userId]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

      {enrollments.length === 0 && !isLoading ? (
        <div className="bg-white border-2 border-dashed border-green-200 rounded-2xl p-12 text-center max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
              <FaBook className="text-5xl text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            No Enrolled Units Yet
          </h3>
          <p className="text-gray-600 mb-6 text-lg">
            You haven't been enrolled in any units yet. Contact your academic advisor or wait for enrollment to be processed by the administration.
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 rounded-xl border border-green-200">
            <FaGraduationCap className="text-green-600" />
            <span className="text-green-700 font-medium">Enrollment is managed by staff</span>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">Once enrolled, you'll see:</p>
            <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-600">
              <span className="px-3 py-1 bg-green-50 rounded-full">📚 Unit Details</span>
              <span className="px-3 py-1 bg-green-50 rounded-full">📅 Session Info</span>
              <span className="px-3 py-1 bg-green-50 rounded-full">👨‍🏫 Instructor Info</span>
              <span className="px-3 py-1 bg-green-50 rounded-full">📝 Course Materials</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrollments.map((enrollment) => (
            <div
              key={enrollment.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 card-hover"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                    <FaBook className="text-green-600 dark:text-green-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                      {enrollment.Unit?.unitCode || enrollment.unitCode}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <FaCalendarAlt className="mr-2" />
                  <span className="font-medium">Session:</span>
                  <span className="ml-2">{enrollment.session}</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Enrolled on:</span>{" "}
                  {formatDate(enrollment.createdAt)}
                </div>
                {enrollment.Unit?.staffId && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Instructor ID:</span>{" "}
                    {enrollment.Unit.staffId}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewMyEnrollments;

