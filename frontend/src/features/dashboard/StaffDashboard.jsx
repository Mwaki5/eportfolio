import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import Spinner from "../../components/Spinner";
import {
  FaBook,
  FaGraduationCap,
  FaFileUpload,
  FaChartLine,
  FaUserGraduate,
  FaListAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const StaffDashboard = () => {
  const axios = useAxiosPrivate();
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({
    myUnits: 0,
    totalEnrollments: 0,
    studentsInMyUnits: 0,
    totalMarks: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!user?.userId) return;

      try {
        const [units, enrollments, marks] = await Promise.all([
          axios.get("/api/units"),
          axios.get("/api/enrollments"),
          axios.get("/api/marks"),
        ]);

        const myUnits =
          units.data.data?.filter((unit) => unit.staffId === user.userId) || [];

        const unitCodes = myUnits.map((u) => u.unitCode);
        const myEnrollments =
          enrollments.data.data?.filter((e) =>
            unitCodes.includes(e.unitCode)
          ) || [];

        const myMarks =
          marks.data.data?.filter((m) => unitCodes.includes(m.unitCode)) || [];

        const uniqueStudents = new Set(myEnrollments.map((e) => e.studentId));

        setMetrics({
          myUnits: myUnits.length,
          totalEnrollments: myEnrollments.length,
          studentsInMyUnits: uniqueStudents.size,
          totalMarks: myMarks.length,
        });
      } catch (error) {
        console.error("Failed to fetch metrics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [axios, user?.userId]);

  const cards = [
    {
      title: "My Units",
      value: metrics.myUnits,
      icon: FaBook,
      color: "bg-blue-500",
      link: "/admin/unit/view",
    },
    {
      title: "Total Enrollments",
      value: metrics.totalEnrollments,
      icon: FaGraduationCap,
      color: "bg-green-500",
      link: "/admin/enrollment/view",
    },
    {
      title: "Students in My Units",
      value: metrics.studentsInMyUnits,
      icon: FaUserGraduate,
      color: "bg-purple-500",
      link: "/admin/student/view",
    },
    {
      title: "Marks Entered",
      value: metrics.totalMarks,
      icon: FaChartLine,
      color: "bg-orange-500",
      link: "/staff/mark/view",
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
          Staff Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back, {user?.firstname}! Here's your overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <div className={`${card.color} p-4 rounded-lg text-white`}>
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
              to="/staff/unit/add"
              className="block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center transition-colors"
            >
              Add New Unit
            </Link>
            <Link
              to="/staff/enrollment/add"
              className="block px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-center transition-colors"
            >
              Enroll Student
            </Link>
            <Link
              to="/staff/mark/add"
              className="block px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-center transition-colors"
            >
              Register Marks
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            My Units
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your units and view student progress.
          </p>
          <Link
            to="/admin/unit/view"
            className="mt-4 inline-block px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            View All Units
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
