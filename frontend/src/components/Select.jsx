import React, { useEffect } from 'react'

const Select = ({
    selectValue = [],
    onChange = null,
    defaultValue = "",
    optionValue = '',
    displayValue = '',
    name = "",
    register = null,
    required = true
}) => {
        const option = selectValue.map((value) =>
            <option key={value[optionValue]}
                value={value[optionValue]}
                className='truncate' >
                {value[displayValue]}
            </option>)

    const registerValue = name

    return (
        <select id='deptCode' className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500  "{...register('deptCode')}
            defaultValue={defaultValue}
            name={name}
            {...register(registerValue)}
            onChange={onChange}
            required={required}>
            <option value=''></option>
            {
            option
            }

        </select>
    )
}

export default Select
