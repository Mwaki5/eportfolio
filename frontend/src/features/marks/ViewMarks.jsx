
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
const ViewMarks = () => {


    const validationSchema = yup.object().shape({
        username: yup.string().min(3, 'Username must be at least 3 characters').max(12, 'Username must be at most 12 characters').required('Username is required'),
        password: yup.string().min(3, 'Password must be at least 3 characters').max(12, 'Password must be at most 12 characters').required('Password is required'),
        regno: yup.string().required('Registration number is required'),
        gender: yup.string().oneOf(['male', 'female'], 'Select a valid gender').required('Gender is required'),
        firstname: yup.string().required('First name is required'),
        othernames: yup.string().nullable(),
        lastname: yup.string().required('Last name is required'),
        nationality: yup.string().required('Nationality is required'),
        dob: yup.date().required('Date of birth is required'),
        phone: yup.string().required('Phone is required'),
        profile: yup.mixed(),
        county: yup.string().required('County is required'),
    });

    // Use react-hook-form with yupResolver for validation
    const { handleSubmit, register, formState: { errors }, reset } = useForm({
        resolver: yupResolver(validationSchema)
    });
    const [credentials, setCredentials] = useState(
        {
            username: null,
            password: null,
            regno: null,
            gender: null,
            firstname: null,
            othername: null,
            lastname: null,
            nationality: null,
            dob: null,
            phone: null,
            profile: null,

        }
    )

    const [RegNo, setRegNo] = useState("")
    const handleRegChange = (e) => {
        setRegNo((prev) => prev = e.target.value)
        errors[e.target.name] = null
    }
    const handleChange = (e) => {
        setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }))
        errors[e.target.name] = null
    }
    // Handles form submission and logs the form data
    const onSubmit = (data) => {
        console.log(credentials);
    };


    return (
        <React.Fragment>
            <form className=" mb-10 w-full"
                onSubmit={handleSubmit(onSubmit)}
            >
                <fieldset className=" border  border-gray-400 rounded-sm p-6">
                    <legend className=' text-center text-2xl p-2'>
                        <strong>View Each Unit Marks </strong>
                    </legend>
                    <div className=" flex gap-x-4 justify-center items-center">

                        <label htmlFor="kinfname" className=" mb-2 text-sm font-medium  dark:text-white">Unit Id
                            <span className='text-red-500'>
                                {errors.kinfname && errors.kinfname.message}
                            </span>
                        </label>
                        <input type="text" id="kinothername"
                            className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  w-[300px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Messy"
                            {...register('Reg')}
                            name='Reg'
                            onChange={handleRegChange}
                            required />
                        <label htmlFor="kinfname" className=" mb-2 text-sm font-medium  dark:text-white">Assessment No
                            <span className='text-red-500'>
                                {errors.kinfname && errors.kinfname.message}
                            </span>
                        </label>


                        <select id='gender' className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  w-[300px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            {...register('gender')}
                            name='gender'
                            onChange={handleChange}
                            required>
                            <option >Assessment No.</option>
                            <option value='male'>1</option>
                            <option value='female'>2</option>
                        </select>



                        <button onClick={onSubmit} type="submit"
                            className="block text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                            Submit
                        </button>
                    </div>

                </fieldset>

            </form>

            {
                RegNo.length >= 1 ? (
                    <form className="pb-5 w-full "
                        onSubmit={handleSubmit(onSubmit)}
                    >

                        <fieldset className="personal  border  border-gray-400 rounded-sm p-6">
                            <legend className=' text-center text-2xl p-2'>
                                <strong>View Marks</strong>
                            </legend>
                            <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" class="p-4">
                                                <div class="flex items-center">
                                                    
                                                    <label for="checkbox-all" class="">S/No</label>
                                                </div>
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                Student name
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                Unit Name
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                Assessment No.
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                Marks
                                            </th>
                                            <th scope="col" class="px-6 py-3 text-center">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <td class="w-4 p-4">
                                                <div class="flex items-center">
                                                    
                                                        <label for="checkbox-table-1" class="">1</label>
                                                </div>
                                            </td>
                                            <th scope="row" class="px-6 py-4 font-medium  whitespace-nowrap ">
                                                Apple MacBook Pro 17"
                                            </th>
                                            <td class="px-6 py-4">
                                                Silver
                                            </td>
                                            <td class="px-6 py-4">
                                                Laptop
                                            </td>
                                            <td class="px-6 py-4">
                                                $2999
                                            </td>
                                            <td class=" flex justify-center gap-x-2 px-6 py-4">
                                                <a href="#" class=" rounded-sm px-3 py-1 font-medium text-white bg-green-600 dark:bg-green-500 hover:underline">Edit</a>
                                                <a href="#" class=" rounded-sm px-3 py-1 font-medium bg-red-600 dark:bg-red-500 hover:underline text-white">Delete</a>
                                            </td>
                                        </tr>
                                      
                                    </tbody>
                                </table>
                            </div>
                        </fieldset>

                    </form>
                ) : (
                    <div className='bg-red-400 w-full text-center rounded-sm'>
                        <p className="p-5">Fill in Department Number You want to Edit</p>
                    </div>
                )
            }
        </React.Fragment>
    )
}

export default ViewMarks
