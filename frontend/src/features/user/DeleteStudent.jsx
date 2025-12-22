import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import logo from '../../assets/logo.jpg'
const DeleteStudent = () => {
    // Define validation schema for all credentials fields
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
                        <strong>Delete Student's Profile</strong>
                    </legend>
                    <div className=" flex gap-x-4 justify-center items-center">

                        <label htmlFor="kinfname" className=" mb-2 text-sm font-medium  dark:text-white">Registration No.
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
                                <strong>Student's Personal Details</strong>
                            </legend>
                            <div className="wrapper  grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
                                <div className=''>
                                    <label htmlFor="regno"
                                        className="block mb-2 text-sm font-medium  dark:text-white">
                                        Registration Number </label>
                                    <input type="text" id="regno"
                                        className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="John"
                                        {...register('regno')}
                                        name='regno'
                                        onChange={handleChange}
                                        disabled
                                        required />
                                </div>

                                <div className=''>
                                    <label htmlFor="firstname" className="block mb-2 text-sm font-medium  dark:text-white">First Name </label>
                                    <input type="text" id="firstname"
                                        className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="John"
                                        {...register('firstname')}
                                        name='firstname'
                                        disabled
                                        onChange={handleChange}
                                        required />
                                </div>

                                <div className=''>
                                    <label htmlFor="othernames" className="block mb-2 text-sm font-medium  dark:text-white">Other Names</label>
                                    <input type="text" id="othernames"
                                        className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Karanja"
                                        {...register('othernames')}
                                        name='othernames'
                                        disabled
                                        onChange={handleChange}
                                        required />
                                </div>

                                <div className=''>
                                    <label htmlFor="lastname" className="block mb-2 text-sm font-medium  dark:text-white">Last Name</label>
                                    <input type="text" id="lastname"
                                        className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Masika"
                                        {...register('lastname')}
                                        name='lastname'
                                        disabled
                                        onChange={handleChange}
                                        required />
                                </div>

                            </div>


                            <div className="logo flex justify-center mt-5  gap-x-5">
                               

                            
                                <button onClick={onSubmit} type=""
                                    className="block text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                    Cancel
                                </button>
                                <button onClick={onSubmit} type="submit"
                                    className="block text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                                    Delete
                                </button>

                            </div>
                        </fieldset>


                    </form>
                ) : (
                    <div className='bg-red-400 w-full text-center rounded-sm'>
                        <p className="p-5">Fill in student Registration Number You want to Delete</p>
                    </div>
                )
                
            }








        </React.Fragment>
    )
}

export default DeleteStudent
