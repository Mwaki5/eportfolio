import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import logo from '../../assets/logo.jpg'
const Guardian = () => {
    // Define validation schema for all credentials fields
    const validationSchema = yup.object().shape({

        kinfname: yup.string().nullable(),
        kinothername: yup.string().nullable(),
        kinlastname: yup.string().nullable(),
        email: yup.string().email('Invalid email').required('Email is required'),
        kinphone: yup.string().nullable(),
        altphone: yup.string().nullable(),
        relation: yup.string().oneOf(['father', 'mother', 'sibling', 'guardian'], 'Select a valid relation').required('Relation type is required'),
    });

    // Use react-hook-form with yupResolver for validation
    const { handleSubmit, register, formState: { errors }, reset } = useForm({
        resolver: yupResolver(validationSchema)
    });
    const [credentials, setCredentials] = useState(
        {
            kinfname: null,
            kinothername: null,
            kinlastname: null,
            email: null,
            kinphone: null,
            altphone: null
        }
    )


    const handleChange = (e) => {
        setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }))
        errors[e.target.name] = null
    }
  
    const [RegNo, setRegNo] = useState("")
    const handleRegChange = (e) => {
        setRegNo((prev) => prev = e.target.value)
        errors[e.target.name] = null
    }
    // Handles form submission and logs the form data
   
   
    const onSubmit = (data) => {
        console.log(credentials);
    };

    return (
        <React.Fragment>
            <form className=" mb-10  w-full "
                onSubmit={handleSubmit(onSubmit)}
            >
                <fieldset className="  border  border-gray-400 rounded-sm p-6">
                    <legend className=' text-center text-2xl p-2'>
                        <strong>Edit Student's Next Of Kin Details</strong>
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
                    <form className="w-full "
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <fieldset className="  border  border-gray-400 rounded-sm p-6">
                            <legend className=' text-center text-2xl p-2'>
                                <strong>Edit Students Next Of Kin Details</strong>
                            </legend>
                            <div className="wrapper  grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
                                <div className=''>
                                    <label htmlFor="kinfname" className="block mb-2 text-sm font-medium  dark:text-white">First Name
                                        <span className='text-red-500'>
                                            {errors.kinfname && errors.kinfname.message}
                                        </span>
                                    </label>
                                    <input type="text" id="kinothername"
                                        className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Messy"
                                        {...register('kinothername')}
                                        name='kinothername'
                                        onChange={handleChange}
                                        required />
                                </div>

                                <div className=''>
                                    <label htmlFor="kinlastname" className="block mb-2 text-sm font-medium  dark:text-white">Last Name
                                        <span className='text-red-500'>
                                            {errors.kinlastname && errors.kinlastname.message}
                                        </span>
                                    </label>
                                    <input type="text" id="kinlastname"
                                        className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Maina"
                                        {...register('kinlastname')}
                                        name='kinlastname'
                                        onChange={handleChange}
                                        required />
                                </div>

                                <div className=''>
                                    <label htmlFor="first_name" className="block mb-2 text-sm font-medium  dark:text-white">Other names
                                        <span className='text-red-500'>
                                            {errors.username && errors.username.message}
                                        </span>
                                    </label>
                                    <input type="text" id="user_name"
                                        className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="John"
                                        {...register('username')}
                                        name='username'
                                        onChange={handleChange}
                                        required />
                                </div>

                                <div className=''>
                                    <label htmlFor="gender" className="block mb-2 text-sm font-medium  dark:text-white">Relation Type
                                        <span className='text-red-500'>
                                            {errors.relation && errors.relation.message}
                                        </span>
                                    </label>
                                    <select id='relation' className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        {...register('relation')}
                                        name='relation'
                                        onChange={handleChange}
                                        required>
                                        <option >---Relation Type---</option>
                                        <option value='father'>Father</option>
                                        <option value='mother'>Mother</option>
                                        <option value='sibling'>Sibling</option>
                                        <option value='guardian'>Guardian</option>
                                    </select>

                                </div>

                                <div className=''>
                                    <label htmlFor="kinphone" className="block mb-2 text-sm font-medium  dark:text-white">Phone
                                        <span className='text-red-500'>
                                            {errors.kinphone && errors.kinphone.message}
                                        </span>
                                    </label>
                                    <input type="text" id="kinphone"
                                        className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="0712345678"
                                        {...register('kinphone')}
                                        name='kinphone'
                                        onChange={handleChange}
                                        required />
                                </div>

                                <div className=''>
                                    <label htmlFor="altphone" className="block mb-2 text-sm font-medium  dark:text-white">Alternative Phone
                                        <span className='text-red-500'>
                                            {errors.altphone && errors.altphone.message}
                                        </span>
                                    </label>
                                    <input type="text" id="altphone"
                                        className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="0712345678"
                                        {...register('altphone')}
                                        name='altphone'
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className=''>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium  dark:text-white">Email
                                        <span className='text-red-500'>
                                            {errors.email && errors.email.message}
                                        </span>
                                    </label>
                                    <input type="email" id="email"
                                        className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="email@gmail.com"
                                        {...register('email')}
                                        name='email'
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
                )
            }


        </React.Fragment>

    )
}

export default Guardian
