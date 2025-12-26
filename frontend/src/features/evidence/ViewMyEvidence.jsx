import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import {
  FaFile,
  FaVideo,
  FaDownload,
  FaUpload,
  FaFileUpload,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import ProfileAvatar from "../../components/ProfileAvator";
import Modal from "../../components/Modal";
import Video from "../../components/Video";

const ViewMyEvidence = () => {
  const axios = useAxiosPrivate();
  const { user } = useAuth();

  const [units, setUnits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const [expandedUnits, setExpandedUnits] = useState({});
  const [expandedImages, setExpandedImages] = useState({});
  const [expandedVideos, setExpandedVideos] = useState({});
  const [loadedVideos, setLoadedVideos] = useState({});

  useEffect(() => {
    const fetchEvidences = async () => {
      if (!user?.userId) return;
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `/api/evidences/student/${encodeURIComponent(user.userId)}`
        );
        setUnits(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch evidences");
        toast.error("Failed to load evidences");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvidences();
  }, [axios, user?.userId]);

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "N/A";

  const toggleUnit = (unitCode) =>
    setExpandedUnits((prev) => ({ ...prev, [unitCode]: !prev[unitCode] }));

  const toggleImages = (unitCode) =>
    setExpandedImages((prev) => ({ ...prev, [unitCode]: !prev[unitCode] }));

  const toggleVideos = (unitCode) =>
    setExpandedVideos((prev) => ({ ...prev, [unitCode]: !prev[unitCode] }));

  const loadVideos = async (unitCode) => {
    if (loadedVideos[unitCode]) return;
    try {
      const res = await axios.get(
        `/api/evidences/student/${encodeURIComponent(
          user.userId
        )}/unit/${unitCode}/videos`
      );
      setLoadedVideos((prev) => ({ ...prev, [unitCode]: res.data.data || [] }));
    } catch (err) {
      toast.error("Failed to load videos");
    }
  };

  const openPreview = (file) => {
    setPreviewFile(file);
    setIsModalOpen(true);
  };

  if (isLoading)
    return (
      <div className="w-full flex justify-center items-center py-12">
        <Spinner size="large" />
      </div>
    );

  if (!units || units.length === 0)
    return (
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
        </p>
        <Link
          to="/student/evidence/add"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition"
        >
          <FaUpload /> Upload Your First Evidence
        </Link>
      </div>
    );

  return (
    <div className="w-full space-y-6">
      {units.map((unit) => {
        const isUnitExpanded = expandedUnits[unit.unitCode] || false;
        const isImagesExpanded = expandedImages[unit.unitCode] || false;
        const isVideosExpanded = expandedVideos[unit.unitCode] || false;
        const videos = loadedVideos[unit.unitCode] || [];

        return (
          <div
            key={unit.unitCode}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-lg"
          >
            {/* Unit Header */}
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleUnit(unit.unitCode)}
            >
              <h3 className="text-xl font-bold text-gray-800">
                {unit.unitCode} - {unit.unitName || "Unit"}
              </h3>
              <span>
                {isUnitExpanded ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>

            {isUnitExpanded && (
              <div className="mt-4 space-y-4">
                {/* Images Section */}
                {unit.images?.length > 0 && (
                  <div>
                    <div
                      className="flex justify-between items-center bg-gray-100 p-2 rounded cursor-pointer"
                      onClick={() => toggleImages(unit.unitCode)}
                    >
                      <div className="flex items-center gap-2">
                        <FaFile className="text-blue-500" /> Images (
                        {unit.images.length})
                      </div>
                      {isImagesExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                    {isImagesExpanded && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                        {unit.images.map((img) => (
                          <div
                            key={img.id}
                            className="bg-gray-50 rounded-lg p-3 shadow-md hover:shadow-lg transition"
                          >
                            <div className="mb-2 overflow-hidden rounded-lg">
                              <ProfileAvatar
                                rounded={false}
                                profilePic={img.filename}
                                className="w-full"
                              />
                            </div>
                            <p className="text-sm text-gray-500">
                              {formatDate(img.uploadedAt)}
                            </p>
                            {img.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {img.description}
                              </p>
                            )}
                            <button
                              onClick={() => openPreview(img)}
                              className="mt-2 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                            >
                              <FaDownload /> View Full Size
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Videos Section */}
                {((unit.videos?.length || 0) > 0 || videos.length > 0) && (
                  <div>
                    <div
                      className="flex justify-between items-center bg-gray-100 p-2 rounded cursor-pointer"
                      onClick={() => toggleVideos(unit.unitCode)}
                    >
                      <div className="flex items-center gap-2">
                        <FaVideo className="text-red-500" /> Videos (
                        {unit.videos?.length || videos.length})
                      </div>
                      {isVideosExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </div>

                    {isVideosExpanded && (
                      <>
                        {!videos.length ? (
                          <button
                            onClick={() => loadVideos(unit.unitCode)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg mt-2"
                          >
                            Load Videos
                          </button>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                            {videos.map((vid) => (
                              <div
                                key={vid.id}
                                className="bg-gray-50 rounded-lg p-3 shadow-md hover:shadow-lg transition"
                              >
                                <Video
                                  videoSrc={vid.filename}
                                  className="w-full h-48 object-cover rounded-lg mb-2"
                                />
                                <p className="text-sm text-gray-500">
                                  {formatDate(vid.uploadedAt)}
                                </p>
                                {vid.description && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    {vid.description}
                                  </p>
                                )}
                                <button
                                  onClick={() => openPreview(vid)}
                                  className="mt-2 w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                                >
                                  <FaDownload /> View Full Size
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Modal */}
      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
        {previewFile && (
          <div className="flex flex-col items-center w-full">
            {previewFile.evidenceType === "image" ? (
              <ProfileAvatar
                profilePic={previewFile.filename}
                className="max-h-[70vh] w-full object-contain rounded-lg"
              />
            ) : (
              <Video
                videoSrc={previewFile.filename}
                className="max-h-[70vh] w-full object-contain rounded-lg"
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ViewMyEvidence;
