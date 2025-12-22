import React, { useState } from "react";
import logo from "../assets/logo.jpg";
import {
  FaArchway,
  FaBook,
  FaGraduationCap,
  FaUserGraduate,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import { Link, Outlet } from "react-router-dom";
import { toast } from "react-toastify";

const Trainer = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { email, profilePic } = user || {};

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="h-16 bg-white shadow-lg flex justify-between items-center px-4 md:px-6 w-full z-20 fixed top-0 left-0">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden text-gray-700 hover:text-green-600 transition-colors p-2 rounded-lg hover:bg-green-50"
        >
          {sidebarOpen ? (
            <FaTimes className="text-2xl" />
          ) : (
            <FaBars className="text-2xl" />
          )}
        </button>
        <h1 className="text-xl font-bold text-green-700 hidden sm:block">
          Dashboard
        </h1>

        <div className="logo grid place-content-center">
          <img className="h-12 object-contain" src={logo} alt="logo" />
        </div>
        <div className="user flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-gray-700">{email}</p>
            <p className="text-xs text-gray-500">Student</p>
          </div>
          <div className="rounded-full">
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={`http://localhost:3400/${profilePic}`}
              alt="profile"
            />
          </div>
        </div>
      </header>

      <div className="flex pt-14">
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col h-[calc(100vh-4rem)] fixed left-0 top-16 z-40 transform transition-transform duration-300 ease-in-out shadow-2xl ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        >
          <div className="flex items-center justify-center h-20 border-b border-gray-700/50 px-4">
            <FaArchway className="text-xl mr-2" />
            <span className="font-bold text-lg text-white">Student Panel</span>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <Link
              to="/student/dashboard"
              className="flex items-center px-2 py-2 rounded hover:bg-gray-800 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <FaArchway className="mr-3" />
              Dashboard
            </Link>

            {/* Profile Management */}
            <details className="group">
              <summary className="flex items-center cursor-pointer px-2 py-2 rounded hover:bg-gray-800 transition-colors">
                <FaUserGraduate className="mr-3" />
                My Profile
              </summary>
              <div className="ml-8 mt-2 space-y-1">
                <Link
                  to="/student/profile/view"
                  className="block px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  View Profile
                </Link>
                <Link
                  to="/student/profile/edit"
                  className="block px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  Edit Profile
                </Link>
              </div>
            </details>

            {/* Evidence Management */}
            <details className="group">
              <summary className="flex items-center cursor-pointer px-2 py-2 rounded hover:bg-gray-800 transition-colors">
                <FaArchway className="mr-3" />
                Evidence
              </summary>
              <div className="ml-8 mt-2 space-y-1">
                <Link
                  to="/student/evidence/add"
                  className="block px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  Add Evidence
                </Link>
                <Link
                  to="/student/evidence/view"
                  className="block px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  View My Evidence
                </Link>
              </div>
            </details>

            {/* Marks */}
            <Link
              to="/student/marks/view"
              className="flex items-center px-2 py-2 rounded hover:bg-gray-800 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <FaGraduationCap className="mr-3" />
              View My Marks
            </Link>

            {/* Enrollments */}
            <Link
              to="/student/enrollments/view"
              className="flex items-center px-2 py-2 rounded hover:bg-gray-800 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <FaBook className="mr-3" />
              My Enrolled Units
            </Link>
          </nav>

          {/* Logout Button at Bottom */}
          <div className="border-t border-gray-700/50 p-4 bg-gray-900/50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl text-white font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 ml-0 lg:ml-64 p-6 justify-center text-gray-700 w-full min-h-[calc(100vh-4rem)]">
          <div className="max-w-[1000px] mx-auto fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Trainer;
