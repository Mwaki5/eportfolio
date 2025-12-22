import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import Spinner from '../../components/Spinner';
import { useEffect } from 'react';
import useAxiosPrivate from './../../hooks/useAxiosPrivate';
import { useParams, useNavigate } from 'react-router-dom';
import FormTitle from './../../components/FormTitle';
import Button from '../../components/Button';

const EditDepartment = ({ department }) => {
    const axios = useAxiosPrivate();
    const { deptCode } = useParams()
    const [isLoading, setIsLoading] = useState(false);
    //const [Updadepartment, setDepartment] = useState(null);
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState(null);
    const navigate = useNavigate()




    const { handleSubmit, register, formState: { errors }, reset, } = useForm();

    const onSubmit = async (formData) => {
        const dept = deptCode;
        try {
            const res = await axios.patch(`/department/edit/${dept}`, formData, {});
            toast.success(res.data.message);
            reset()
        } catch (error) {
            toast.error(error.response.data.message || 'Something went wrong.');
            setValidationError(res.data.data)
            toast.error('Execution not done.');
            setError(error.response.data.message)
            console.log(error)

        }
        finally {
            setIsLoading(false)
        }


    };

    useEffect(() => {

        if (error || validationError) {
            setTimeout(() => {
                setValidationError(null)
                setError(null)
            }, 10000)
        }
    }, [department, error, deptCode])


    return (
        <React.Fragment>
            <form className="pb-5  grid gap-6 w-full shadow-sm mt-5" onSubmit={handleSubmit(onSubmit)}>
      
                    <FormTitle>Edit department</FormTitle>

                    <div className="wrapper grid sm:grid-cols-1 md:grid-cols-2 gap-6 p-2">
                        {/* Department Code */}
                        <div>
                            <label htmlFor="deptCode" className="block mb-2 text-sm font-medium dark:text-white">
                                Department Code

                            </label>
                            <input
                                type="text"
                                id="deptCode"
                                placeholder="IT12"
                                {...register('deptCode')}
                                name="deptCode"
                                value={department[0].deptCode}
                                onChange={(e) => {
                                    // setDepartment(prev => ([{ ...prev, deptCode: e.target.value }]))
                                }}


                                className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                required
                            />
                        </div>

                        {/* Department Name */}
                        <div>
                            <label htmlFor="deptName" className="block mb-2 text-sm font-medium dark:text-white">
                                Department Name

                            </label>
                            <input
                                type="text"
                                id="deptName"
                                placeholder="ICT Department"
                                {...register('deptName')}
                                name="deptName"
                                value={department[0].deptName}
                                onChange={(e) => {
                                    setDepartment(prev => ([{ ...prev, deptName: e.target.value }]))
                                }}

                                className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="p-2">
                        <label htmlFor="description" className="block mb-2 text-sm font-medium dark:text-white">
                            Department Description

                        </label>
                        <textarea
                            id="description"
                            placeholder="This is ICT department ..."
                            {...register('description')}
                            name="description"
                            value={department[0].description}
                            onChange={(e) => {
                                setDepartment(prev => ([{ ...prev, description: e.target.value }]))
                            }}
                            rows={5}
                            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required
                        ></textarea>
                    </div>


                    {
                        error &&
                        <div className="p-4 text-sm text-red-800 rounded-lg bg-red-200 text-center dark:bg-gray-800 dark:text-red-400 w-full">
                            <p className="text-center">{error}</p>
                        </div>
                    }

                    {/* Submit Button */}
                    <div className="logo flex justify-center ">
                        <Button isLoading={isLoading}>
                            Update
                        </Button>
                    </div>
            </form>
        </React.Fragment>
    );
};

export default EditDepartment;
