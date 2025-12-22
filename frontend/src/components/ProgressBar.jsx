import React from "react";

const ProgressBar = ({ progress = 0, className = "" }) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 ${className}`}>
      <div
        className="bg-green-600 h-2.5 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      >
        <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full animate-pulse"></div>
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-center">
        {Math.round(progress)}%
      </div>
    </div>
  );
};

export default ProgressBar;

