import React, { useState, useRef } from "react";
import { FaUpload, FaTimes, FaImage, FaVideo } from "react-icons/fa";

const FileUpload = ({
  name = "file",
  register = null,
  accept = "",
  onChange = null,
  className = "",
  required = false,
}) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    
    // Determine file type
    if (selectedFile.type.startsWith("image/")) {
      setFileType("image");
      // Create preview for images
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else if (selectedFile.type.startsWith("video/")) {
      setFileType("video");
      // Create preview for videos
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const videoUrl = URL.createObjectURL(selectedFile);
        setPreview(videoUrl);
      };
      video.src = URL.createObjectURL(selectedFile);
    } else {
      setFileType("other");
      setPreview(null);
    }

    if (onChange) {
      onChange(e);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setFileType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="w-[80%] mx-auto">
        <label
          htmlFor={name}
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition-colors"
        >
          {!file ? (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FaUpload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Images (PNG, JPG, GIF) or Videos (MP4, MOV, AVI) up to 100MB
              </p>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center p-4">
              {fileType === "image" && preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-full max-w-full object-contain rounded-lg"
                />
              )}
              {fileType === "video" && preview && (
                <video
                  src={preview}
                  controls
                  className="max-h-full max-w-full rounded-lg"
                />
              )}
              {fileType === "other" && (
                <div className="flex flex-col items-center">
                  <FaUpload className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="text-sm text-gray-500">{file.name}</p>
                </div>
              )}
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
          )}
          <input
            ref={(e) => {
              fileInputRef.current = e;
              const registerResult = register ? register(name) : {};
              if (registerResult.ref) {
                registerResult.ref(e);
              }
            }}
            type="file"
            id={name}
            name={name}
            className="hidden"
            accept={accept}
            onChange={(e) => {
              handleFileChange(e);
              const registerResult = register ? register(name) : {};
              if (registerResult.onChange) {
                registerResult.onChange(e);
              }
            }}
            required={required}
          />
        </label>

        {file && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {fileType === "image" ? (
                  <FaImage className="text-blue-500" />
                ) : fileType === "video" ? (
                  <FaVideo className="text-red-500" />
                ) : (
                  <FaUpload className="text-gray-500" />
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {file.name}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatFileSize(file.size)}
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Type: {fileType === "image" ? "Image" : fileType === "video" ? "Video" : "File"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;

