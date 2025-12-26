import React, { useState } from "react";
import logo from "../assets/logo.jpg";
import {
  FaArchway,
  FaUserGraduate,
  FaBook,
  FaListAlt,
  FaChalkboardTeacher,
  FaBuilding,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ProfileAvatar from "../components/ProfileAvator";

const admin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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
            <p className="text-xs text-gray-500">Staff</p>
          </div>
         <div className="rounded-full h-10 w-10 overflow-hidden">
            <ProfileAvatar
              profilePic={profilePic}
              rounded={true}
              className="border border-gray-200 h-full w-full"
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
            <span className="font-bold text-lg text-white">Staff Panel</span>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <Link
              to="/staff/dashboard"
              className="flex items-center px-2 py-2 rounded hover:bg-gray-800 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <FaArchway className="mr-3" />
              Dashboard
            </Link>
            {/* Manage Department */}
            <details className="group">
              <summary className="flex items-center cursor-pointer px-2 py-2 rounded hover:bg-gray-800 transition-colors">
                <FaUserGraduate className="mr-3" />
                Manage Students
              </summary>
              <div className="ml-8 mt-2 space-y-1">
                <Link
                  to="/staff/student/add"
                  className="block px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  Add Students
                </Link>
                <Link
                  to="/staff/student/edit/details"
                  className="block px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  Edit Student
                </Link>
                <Link
                  to="/staff/student/filter/details"
                  className="block px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  Filter Students
                </Link>
              </div>
            </details>
            <details className="group">
              <summary className="flex items-center cursor-pointer px-2 py-2 rounded hover:bg-gray-800 transition-colors">
                <FaListAlt className="mr-3" />
                Manage Units
              </summary>

              <div className="ml-8 mt-2 space-y-1">
                <Link
                  to="/staff/unit/add"
                  className="block px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  Add Unit
                </Link>

                <Link
                  to="/staff/unit/edit"
                  className="block px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  Edit Units
                </Link>
                <Link
                  to="/staff/unit/filter"
                  className="block px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  Filter Units
                </Link>
              </div>
            </details>
            <details className="group">
              <summary className="flex items-center cursor-pointer px-2 py-2 rounded hover:bg-gray-800 transition-colors">
                <FaListAlt className="mr-3" />
                Manage Marks
              </summary>

              <div className="ml-8 mt-2 space-y-1">
                <Link
                  to="/staff/mark/add"
                  className="block px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  Register Marks
                </Link>

                <Link
                  to="/staff/mark/edit"
                  className="block px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  Edit Marks
                </Link>
                <Link
                  to="/staff/mark/view"
                  className="block px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  Filter Marks
                </Link>
              </div>
            </details>
            <details className="group">
              <summary className="flex items-center cursor-pointer px-2 py-2 rounded hover:bg-gray-800 transition-colors">
                <FaBook className="mr-3" />
                Manage enrollment
              </summary>

              <div className="ml-8 mt-2 space-y-1">
                <Link
                  to="/staff/enrollment/add"
                  className="block px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  Create Enrollment
                </Link>
                <Link
                  to="/staff/enrollment/view"
                  className="block px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  Edit Enrollments
                </Link>

                <Link
                  to="/staff/enrollment/filter"
                  className="block px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  Filter Enrollment
                </Link>
              </div>
            </details>
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
        <main className="flex-1 flex lg:ml-64 py-10 text-gray-700 justify-center w-full min-h-[calc(100vh-4rem)]">
          <div className="wrapper w-full xl:max-w-[1100px] px-4 fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default admin;
