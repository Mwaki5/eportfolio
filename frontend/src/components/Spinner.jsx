import React from "react";

const Spinner = ({ size = "small", color = "white" }) => {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-6 w-6",
    large: "h-8 w-8",
  };

  return (
    <div
      className={`animate-spin inline-block border-2 border-t-transparent border-${color}-400 rounded-full ${sizeClasses[size]}`}
      role="status"
    ></div>
  );
};

export default Spinner;
