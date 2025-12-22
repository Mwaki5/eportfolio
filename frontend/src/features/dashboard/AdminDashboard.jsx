import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Spinner from "../../components/Spinner";
import {
  FaUsers,
  FaBook,
  FaGraduationCap,
  FaFileUpload,
  FaChartLine,
  FaUserGraduate,
  FaListAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const axios = useAxiosPrivate();
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    totalUnits: 0,
    totalEnrollments: 0,
    totalEvidence: 0,
    totalMarks: 0,
    totalStaff: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [students, units, enrollments, evidence, marks, staff] =
          await Promise.all([
            axios.get("/api/students"),
            axios.get("/api/units"),
            axios.get("/api/enrollments"),
            axios.get("/api/evidence"),
            axios.get("/api/marks"),
            axios.get("/api/students").catch(() => ({ data: { data: [] } })),
          ]);

        setMetrics({
          totalStudents: students.data.data?.length || 0,
          totalUnits: units.data.data?.length || 0,
          totalEnrollments: enrollments.data.data?.length || 0,
          totalEvidence: evidence.data.data?.length || 0,
          totalMarks: marks.data.data?.length || 0,
          totalStaff: 0, // You may need to add a staff endpoint
        });
      } catch (error) {
        console.error("Failed to fetch metrics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [axios]);

  const cards = [
    {
      title: "Total Students",
      value: metrics.totalStudents,
      icon: FaUsers,
      color: "bg-blue-500",
      link: "/admin/student/view",
    },
    {
      title: "Total Units",
      value: metrics.totalUnits,
      icon: FaBook,
      color: "bg-green-500",
      link: "/admin/unit/view",
    },
    {
      title: "Total Enrollments",
      value: metrics.totalEnrollments,
      icon: FaGraduationCap,
      color: "bg-purple-500",
      link: "/admin/enrollment/view",
    },
    {
      title: "Total Evidence",
      value: metrics.totalEvidence,
      icon: FaFileUpload,
      color: "bg-orange-500",
      link: "/admin/evidence/view",
    },
    {
      title: "Total Marks",
      value: metrics.totalMarks,
      icon: FaChartLine,
      color: "bg-red-500",
      link: "/staff/mark/view",
    },
    {
      title: "Total Staff",
      value: metrics.totalStaff,
      icon: FaUserGraduate,
      color: "bg-indigo-500",
      link: "#",
    },
  ];

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Overview of system statistics and metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link
              key={index}
              to={card.link}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">
                    {card.value}
                  </p>
                </div>
                <div
                  className={`${card.color} p-4 rounded-lg text-white`}
                >
                  <Icon className="text-2xl" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="space-y-2">
            <Link
              to="/staff/add-student"
              className="block px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-center transition-colors"
            >
              Add New Student
            </Link>
            <Link
              to="/staff/add-unit"
              className="block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center transition-colors"
            >
              Add New Unit
            </Link>
            <Link
              to="/staff/enroll-new"
              className="block px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-center transition-colors"
            >
              Create Enrollment
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Recent Activity
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Activity logs and recent updates will appear here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

