import React from "react";

const Label = ({ htmlFor = "", label = "", error = "" }) => {
  return (
    <React.Fragment>
      <label
        htmlFor={htmlFor}
        className="block mb-2 text-sm font-medium dark:text-white"
      >
        {label}
      </label>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </React.Fragment>
  );
};

export default Label;
