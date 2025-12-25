import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import {
  FaUser,
  FaEdit,
  FaEnvelope,
  FaIdCard,
  FaGraduationCap,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const ViewMyProfile = () => {
  const axios = useAxiosPrivate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.userId) return;

      setIsLoading(true);
      try {
        const res = await axios.get(
          `/api/students/${encodeURIComponent(user.userId)}`
        );
        setProfile(res.data.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [axios, user?.userId]);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <Spinner size="large" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Failed to load profile
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            My Profile
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View your personal information
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-500">
              <img
                src={`http://localhost:5000/${encodeURIComponent(
                  profile.profilePic
                )}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <FaIdCard className="text-green-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Student ID
                </p>
                <p className="font-semibold text-gray-800 dark:text-white">
                  {profile.userId}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FaUser className="text-green-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Full Name
                </p>
                <p className="font-semibold text-gray-800 dark:text-white">
                  {profile.firstname} {profile.lastname}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FaEnvelope className="text-green-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Email
                </p>
                <p className="font-semibold text-gray-800 dark:text-white">
                  {profile.email}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FaGraduationCap className="text-green-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Department
                </p>
                <p className="font-semibold text-gray-800 dark:text-white">
                  {profile.department}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FaUser className="text-green-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Gender
                </p>
                <p className="font-semibold text-gray-800 dark:text-white">
                  {profile.gender}
                </p>
              </div>
            </div>

            {profile.level && (
              <div className="flex items-start gap-3">
                <FaGraduationCap className="text-green-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Level
                  </p>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {profile.level}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMyProfile;
