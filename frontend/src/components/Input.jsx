import React from "react";

const Input = ({
  placeholder = "",
  onChange = null,
  defaultValue = "",
  name = "",
  type = "text",
  autoComplete = "false",
  register = null,
  required = true,
  className = "",
}) => {
  return (
    <React.Fragment>
      <input
        type={type}
        id={name}
        className={`bg-white border-1 border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-200 p-3 w-full ${className}`}
        defaultValue={defaultValue}
        onChange={onChange}
        autoComplete={autoComplete}
        name={name}
        placeholder={placeholder}
        {...(register ? register(name) : {})}
        required={required}
      />
    </React.Fragment>
  );
};

export default Input;
