import React from 'react'

const TextArea = ({
    placeholder = "",
    onChange = null,
    defaultValue = "",
    name = "",
    rows = 5,
    register = null,
    required = true
}) => {
    const registerValue = name
    return (
        <textarea className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            defaultValue={defaultValue}
            onChange={onChange}
            name={name}
            rows={rows}
            placeholder={placeholder}
            {...register(registerValue)}
            required={required}
        ></textarea>
    )
}

export default TextArea
