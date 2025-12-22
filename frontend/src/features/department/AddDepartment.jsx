import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import Spinner from '../../components/Spinner';
import { useEffect } from 'react';
import useAxiosPrivate from './../../hooks/useAxiosPrivate';
import FormTitle from './../../components/FormTitle';
import Button from '../../components/Button';
import Label from '../../components/Label';
import Input from '../../components/Input';
import TextArea from './../../components/TextArea';
import Alert from '../../components/Alert';


const AddDepartment = () => {
    const axios = useAxiosPrivate();
    const [serverResponse, setServerResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState(null);
    // const navigate = useNavigate();

    const validationSchema = yup.object().shape({
        deptCode: yup
            .string()
            .min(3, 'Department code must be at least 3 characters')
            .max(12, 'Department code must be at most 12 characters')
            .required('Department code is required'),
        deptName: yup
            .string()
            .min(3, 'Department Name must be at least 3 characters')
            .max(50, 'Department Name must be at most 50 characters')
            .required('Department Name is required'),
        description: yup.string().required('Description is required'),
    });

    const { handleSubmit, register, formState: { errors }, reset, } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onChange',
    });

    const onSubmit = async (formData) => {
        setServerResponse(null);
        try {
            const res = await axios.post('/department/create', formData, {});

            toast.success(res.data.message);
            reset()
        } catch (error) {
            const isvalidationError = Array.isArray(error.response.data.message)
            toast.error(isvalidationError ? "Input validation error" : error.response.data.message);
            setError(error.response.data.message)
        }


    };

    useEffect(() => {
        if (error || validationError) {
            setTimeout(() => {
                setValidationError(null)
                setError(null)
            }, 10000)
        }
    }, [validationError, error])

    return (
        <form className=" grid gap-6 w-full shadow-sm mt-5" onSubmit={handleSubmit(onSubmit)}>
            <FormTitle>Add department</FormTitle>
            <div className="wrapper grid sm:grid-cols-1 md:grid-cols-3 p-2 gap-4 sm:gap-6">
                {/* Department Code */}
                <div>
                    <Label htmlFor='deptCode'>
                        Department Code
                    </Label>
                    <Input
                        type="text"
                        placeholder="DEPT012"
                        register={register}
                        name="deptCode"
                    />
                    <p>
                        <span className="text-red-500">
                            {errors.deptCode && errors.deptCode.message}
                        </span>
                    </p>
                </div>

                {/* Department Name */}
                <div>

                    <Label htmlFor='deptName'>
                        Department Name
                    </Label>
                    <Input
                        type="text"
                        placeholder="ICT Department"
                        name="deptName"
                        register={register}
                    />
                    <p>
                        <span className="text-red-500">
                            {errors.deptName && errors.deptName.message}
                        </span>
                    </p>
                </div>
                {/* Department Initials */}
                <div>
                    <Label htmlFor='deptInitials'>
                        Department intials
                    </Label>
                    <Input
                        type="text"
                        placeholder="ICT "
                        name="deptInitials"
                        register={register}
                    />
                    <p>
                        <span className="text-red-500">
                            {errors.deptInitials && errors.deptInitials.message}
                        </span>
                    </p>

                </div>
            </div>

            {/* Description */}
            <div className=" px-2">
                <Label htmlFor="description" >
                    Department Description
                </Label>

                <TextArea
                    id="description"
                    placeholder="This is ICT department ..."
                    register={register}
                    name="description"
                    rows="5" />
                <p>
                    <span className="text-red-500">
                        {errors.description && errors.description.message}
                    </span>
                </p>
            </div>

            {/* Loading 
                {isLoading && (
                    <p className="text-green-700 text-center font-medium">Processing...</p>
                )}
*/}
            {
                error &&
                <Alert error={error} />
            }


            {/* Submit Button */}
            <div className="logo flex justify-center mb-5">
                <Button isLoading={isLoading} type="submit">
                    Submit
                </Button>

            </div>
        </form>
    );
};

export default AddDepartment;
