import React from "react";

const DataList = ({
  placeholder = "",
  onChange = null,
  defaultValue = "",
  name = "",
  register = null,
  required = true,
  className = "",
  error = null,
  options = [],
  ref = null,
}) => {
  return (
    <React.Fragment>
      <input
        defaultValue={defaultValue}
        list={name}
        ref={ref}
        error={error}
        placeholder={placeholder}
        onChange={onChange}
        required
        className={`bg-gray-50 border ${
          error ? "border-red-500" : "border-gray-300"
        } text-gray-900 text-sm rounded-lg focus:ring-[#00966d] focus:border-[#00966d] block w-full p-2.5 outline-none transition-all ${className} datalist-input`}
        {...register(name)}
      />

      {/* The hidden list of options */}
      <datalist id={name}>
        {options.map((option, index) => (
          <option key={index} value={option} />
        ))}
      </datalist>
    </React.Fragment>
  );
};

export default DataList;
