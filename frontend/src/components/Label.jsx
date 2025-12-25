import React from "react";

const Label = ({ htmlFor = "", label = "", error = "" }) => {
  return (
    <React.Fragment>
      <label
        htmlFor={htmlFor}
        className=" mb-2 text-sm font-medium dark:text-white "
      >
        <p>{label}</p>
      </label>
      {error && <p className="text-red-500 text-sm inline-block">{error}</p>}
    </React.Fragment>
  );
};

export default Label;
