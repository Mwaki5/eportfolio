import React from "react";

const Input = ({
  placeholder = "",
  onChange = null,
  defaultValue = "",
  name = "",
  type = "text",
  error = null,
  autoComplete = "false",
  register = null,
  required = true,
  className = "",
  ref = null,
  readOnly = false,
}) => {
  return (
    <React.Fragment>
      <input
        type={type}
        id={name}
        className={`bg-gray-50 border ${
          error ? "border-red-500" : "border-gray-300"
        } text-gray-900 text-sm rounded-xl focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-200 p-3 w-full ${className} ${
          readOnly ? "cursor-not-allowed" : ""
        }`}
        ref={ref}
        defaultValue={defaultValue}
        onChange={onChange}
        autoComplete={autoComplete}
        name={name}
        readOnly={readOnly}
        placeholder={placeholder}
        {...(register ? register(name) : {})}
        required={required}
      />
    </React.Fragment>
  );
};

export default Input;
