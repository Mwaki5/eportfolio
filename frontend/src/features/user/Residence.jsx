import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import logo from '../../assets/logo.jpg'
const Residence = () => {
    // Define validation schema for all credentials fields
    const validationSchema = yup.object().shape({
        county: yup.string().required('County is required'),
        subcounty: yup.string().required('Subcounty is required'),
        location: yup.string().required('Location is required'),
        sublocation: yup.string().required('Sub-location is required'),
        city: yup.string().required('City is required'),
        village: yup.string().required('Village is required'),
    });

    // Use react-hook-form with yupResolver for validation
    const { handleSubmit, register, formState: { errors }, reset } = useForm({
        resolver: yupResolver(validationSchema)
    });
    const [credentials, setCredentials] = useState(
        {
            county: null,
            subcounty: null,
            location: null,
            sublocation: null,
            city: null,
            village: null,
            code: null,

        }
    )


    const handleChange = (e) => {
        setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }))
        errors[e.target.name] = null
    }
    // Handles form submission and logs the form data
    const onSubmit = (data) => {
        console.log(credentials);
    };
    const [RegNo, setRegNo] = useState("")
    const handleRegChange = (e) => {
        setRegNo((prev) => prev = e.target.value)
        errors[e.target.name] = null
    }
    return (
        <React.Fragment>
            <form className=" mb-10 w-full"
                onSubmit={handleSubmit(onSubmit)}
            >
                <fieldset className=" border  border-gray-400 rounded-sm p-6">
                    <legend className=' text-center text-2xl p-2'>
                        <strong>Edit Student's Residence Details</strong>
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
                            {...register('reg')}
                            name='reg'
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
                    <form className="w-full    pb-5 "
                        onSubmit={handleSubmit(onSubmit)}
                    >

                        <fieldset className="personal  border  border-gray-400 rounded-sm p-6">
                            <legend className=' text-center text-2xl p-2'><strong>Residence Details</strong></legend>
                            <div className="wrapper  grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
                                <div className=''>
                                    <label htmlFor="county" className="block mb-2 text-sm font-medium  dark:text-white">County
                                        <span className='text-red-500 p-5'>
                                            {errors.county && errors.county.message}
                                        </span>
                                    </label>
                                    <input type="text" id="county"
                                        className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Vihiga"
                                        {...register('county')}
                                        name='county'
                                        onChange={handleChange}
                                        required />
                                </div>

                                <div className=''>
                                    <label htmlFor="subcounty" className="block mb-2 text-sm font-medium  dark:text-white">Subcounty
                                        <span className='text-red-500'>
                                            {errors.subcounty && errors.subcounty.message}
                                        </span>
                                    </label>
                                    <input type="text" id="subcounty"
                                        className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Sabatia"
                                        {...register('subcounty')}
                                        name='subcounty'
                                        onChange={handleChange}
                                        required />
                                </div>

                                <div className=''>
                                    <label htmlFor="location" className="block mb-2 text-sm font-medium  dark:text-white">Location
                                        <span className='text-red-500'>
                                            {errors.location && errors.location.message}
                                        </span>
                                    </label>
                                    <input type="text" id="location"
                                        className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Chamakanga"
                                        {...register('location')}
                                        name='location'
                                        onChange={handleChange}
                                        required />
                                </div>

                                <div className=''>
                                    <label htmlFor="sublocation" className="block mb-2 text-sm font-medium  dark:text-white">Sub-location
                                        <span className='text-red-500'>
                                            {errors.sublocation && errors.sublocation.message}
                                        </span>
                                    </label>
                                    <input type="text" id="sublocation"
                                        className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Wodanga"
                                        {...register('sublocation')}
                                        name='sublocation'
                                        onChange={handleChange}
                                        required />
                                </div>

                                <div className=''>
                                    <label htmlFor="Village" className="block mb-2 text-sm font-medium  dark:text-white">Village
                                        <span className='text-red-500'>
                                            {errors.village && errors.village.message}
                                        </span>
                                    </label>
                                    <input type="text" id="village"
                                        className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Mago"
                                        {...register('village')}
                                        name='village'
                                        onChange={handleChange}
                                        required />
                                </div>

                                <div className=''>
                                    <label htmlFor="city" className="block mb-2 text-sm font-medium  dark:text-white">Home City
                                        <span className='text-red-500'>
                                            {errors.city && errors.city.message}
                                        </span>
                                    </label>
                                    <input type="text" id="city"
                                        className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Chavakali"
                                        {...register('city')}
                                        name='city'
                                        onChange={handleChange}
                                        required />
                                </div>
                                <div className=''>
                                    <label htmlFor="first_name" className="block mb-2 text-sm font-medium  dark:text-white">Postal Code
                                        <span className='text-red-500'>
                                            {errors.code && errors.code.message}
                                        </span>
                                    </label>
                                    <input type="text" id="user_name"
                                        className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="97 -50302"
                                        {...register('code')}
                                        name='code'
                                        onChange={handleChange}
                                        required />
                                </div>

                            </div>

                            <div className="logo flex justify-center mt-5 ">
                                <button onClick={onSubmit} type="submit"
                                    className="block text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                    Submit
                                </button>
                            </div>
                        </fieldset>

                    </form>
                ):(
                    <div className='bg-red-400 w-full text-center rounded-sm'>
                    <p className="p-5">Fill in student Registration Number You want to Edit</p>
                    </div>
                )}
        </React.Fragment>
    )
}

export default Residence
