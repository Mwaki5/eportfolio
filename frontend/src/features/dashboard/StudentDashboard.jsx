import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import Spinner from "../../components/Spinner";
import {
  FaBook,
  FaGraduationCap,
  FaFileUpload,
  FaChartLine,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  const axios = useAxiosPrivate();
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({
    enrolledUnits: 0,
    totalEvidence: 0,
    totalMarks: 0,
    averageGrade: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!user?.userId) return;

      try {
        const [enrollments, evidence, marks] = await Promise.all([
          axios.get(
            `/api/enrollments/search/${encodeURIComponent(user.userId)}`
          ),
          axios.get(
            `/api/evidences/student/${encodeURIComponent(user.userId)}`
          ),
          axios.get(`/api/marks/${encodeURIComponent(user.userId)}`),
        ]);

        const enrollmentsData = enrollments.data.data || [];
        const evidenceData = evidence.data.data || [];
        const marksData = marks.data.data || [];

        // Calculate average grade
        let totalScore = 0;
        let count = 0;
        marksData.forEach((mark) => {
          const theoryTotal =
            (mark.theory1 || 0) + (mark.theory2 || 0) + (mark.theory3 || 0);
          const pracTotal =
            (mark.prac1 || 0) + (mark.prac2 || 0) + (mark.prac3 || 0);
          const total = theoryTotal + pracTotal;
          if (total > 0) {
            totalScore += total;
            count++;
          }
        });

        const averageGrade = count > 0 ? (totalScore / count).toFixed(1) : 0;

        // Count total evidence (sum of images and videos)
        let totalEvidenceCount = 0;
        evidenceData.forEach((unit) => {
          totalEvidenceCount +=
            (unit.images?.length || 0) + (unit.videos?.length || 0);
        });

        setMetrics({
          enrolledUnits: enrollmentsData.length,
          totalEvidence: totalEvidenceCount,
          totalMarks: marksData.length,
          averageGrade: parseFloat(averageGrade),
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
      title: "Enrolled Units",
      value: metrics.enrolledUnits,
      icon: FaBook,
      color: "bg-blue-500",
      link: "/student/view-enrollments",
    },
    {
      title: "Total Evidence",
      value: metrics.totalEvidence,
      icon: FaFileUpload,
      color: "bg-green-500",
      link: "/student/view-evidence",
    },
    {
      title: "Units with Marks",
      value: metrics.totalMarks,
      icon: FaGraduationCap,
      color: "bg-purple-500",
      link: "/student/view-marks",
    },
    {
      title: "Average Grade",
      value: metrics.averageGrade > 0 ? metrics.averageGrade : "N/A",
      icon: FaChartLine,
      color: "bg-orange-500",
      link: "/student/view-marks",
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
          Student Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back, {user?.firstname}! Here's your academic overview.
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
              to="/student/evidence/add"
              className="block px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-center transition-colors"
            >
              Upload Evidence
            </Link>
            <Link
              to="/student/evidence/view"
              className="block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center transition-colors"
            >
              View My Evidence
            </Link>
            <Link
              to="/student/marks/view"
              className="block px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-center transition-colors"
            >
              View My Marks
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            My Progress
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Track your academic progress and achievements.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Enrolled Units:
              </span>
              <span className="font-bold">{metrics.enrolledUnits}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Evidence Uploaded:
              </span>
              <span className="font-bold">{metrics.totalEvidence}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Marks Available:
              </span>
              <span className="font-bold">{metrics.totalMarks}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
