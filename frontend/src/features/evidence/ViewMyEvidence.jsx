import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import {
  FaFile,
  FaDownload,
  FaTrash,
  FaUpload,
  FaFileUpload,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const ViewMyEvidence = () => {
  const axios = useAxiosPrivate();
  const { user } = useAuth();
  const [evidences, setEvidences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvidences = async () => {
      if (!user?.userId) return;

      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `/api/evidences/student/${encodeURIComponent(user.userId)}`
        );
        setEvidences(res.data.data || []);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch evidences");
        toast.error("Failed to load evidences");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvidences();
  }, [axios, user?.userId]);

  const handleDownload = (filename, originalname) => {
    const fileUrl = `http://localhost:5000/${filename}`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = originalname;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          My Evidence
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View all your uploaded evidence files
        </p>
      </div>

      {error && (
        <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {(!evidences || evidences.length === 0) && !isLoading ? (
        <div className="bg-white border-2 border-dashed border-green-200 rounded-2xl p-12 text-center max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
              <FaFileUpload className="text-5xl text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            No Evidence Uploaded Yet
          </h3>
          <p className="text-gray-600 mb-6 text-lg">
            Start building your portfolio by uploading your first evidence.
            Showcase your work, achievements, and progress!
          </p>
          <Link
            to="/student/evidence/add"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <FaUpload />
            Upload Your First Evidence
          </Link>
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">What can you upload?</p>
            <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-600">
              <span className="px-3 py-1 bg-green-50 rounded-full">
                📄 Practical Images
              </span>
              <span className="px-3 py-1 bg-green-50 rounded-full">
                🖼️Practical Videos
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {evidences.map((unitGroup) => (
            <div
              key={unitGroup.unitCode}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                {unitGroup.unitCode} - {unitGroup.unitName || "Unit"}
              </h3>

              {/* Images Section */}
              {unitGroup.images && unitGroup.images.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <FaFile className="text-blue-500" />
                    Images ({unitGroup.images.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {unitGroup.images.map((evidence) => (
                      <div
                        key={evidence.id}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <div className="rounded-lg w-full mb-3 overflow-hidden">
                          <img
                            src={`http://localhost:5000/${evidence.filename}`}
                            alt={evidence.description || "Evidence"}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                        <div className="mb-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(evidence.uploadedAt)}
                          </p>
                          {evidence.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {evidence.description}
                            </p>
                          )}
                        </div>
                        <a
                          href={`http://localhost:5000/${evidence.filename}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          <FaDownload /> View Full Size
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Videos Section */}
              {unitGroup.videos && unitGroup.videos.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <FaFile className="text-red-500" />
                    Videos ({unitGroup.videos.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {unitGroup.videos.map((evidence) => (
                      <div
                        key={evidence.id}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <div className="rounded-lg w-full mb-3 overflow-hidden">
                          <video
                            src={`http://localhost:5000/${evidence.filename}`}
                            controls
                            className="w-full h-48 object-cover rounded-lg"
                          >
                            Your browser does not support the video tag.
                          </video>
                        </div>
                        <div className="mb-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(evidence.uploadedAt)}
                          </p>
                          {evidence.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {evidence.description}
                            </p>
                          )}
                        </div>
                        <a
                          href={`http://localhost:5000/${evidence.filename}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          <FaDownload /> Download Video
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewMyEvidence;
