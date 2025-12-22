import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import Spinner from '../../components/Spinner';
import { useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useParams, useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar';
import Alert from '../../components/Alert';
import Modal from '../../components/Modal';
import EditDepartment from './EditDepartment';
import FormTitle from './../../components/FormTitle';
import Button from '../../components/Button';

const SearchDepartment = () => {
    const axios = useAxiosPrivate();
    const [isLoading, setIsLoading] = useState(false);
    const [department, setDepartment] = useState(null);
    const [error, setError] = useState(null);
    const [deptCode, setdeptCode] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [validationError, setValidationError] = useState(null);
    const navigate = useNavigate()



    const fetchDepartment = async (dept) => {
        setIsLoading(true)
        setError(null)
        setDepartment(null)
        try {
            const res = await axios.get(`/department/findByDeptCode/${dept}`)
            setDepartment(res.data.data)
        } catch (error) {
            if (error.response.status == 404) {
                return
            }
            toast.error(error.response.data.message);
            setError(error.response.data.message)
        }
        finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (dep) => {
        try {
            const res = await axios.delete(`/department/delete/${dep}`);
            toast.success(res.data.message);
            setDepartment(null)
            setIsModalOpen(false);
        } catch (err) {
            alert('Failed to delete.');
        }
    };
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

        }
        finally {
            setIsLoading(false)
        }


    };

    const handleEdit = async (deptCode) => {
        navigate(`/admin/department/edit/${deptCode}`)
    };
    useEffect(() => {
        //  fetchDepartment()
        if (error || validationError) {
            setTimeout(() => {
                setValidationError(null)
                setError(null)
            }, 10000)
        }
    }, [department, error])


    return (
        <React.Fragment>
            <SearchBar title="Edit department"
                setValue={setdeptCode}
                placeholder='Department code'
                isLoading={isLoading}
                handleClick={fetchDepartment} />

            {error && <Alert error={error} setError={setError} />}
            <div className="rounded-sm mt-6">
                <table className=" min-w-[600px] w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50  shadow-[0_4px_8px_-4px_rgba(0,0,0,0.15)]">
                        <tr>
                            <th scope="col" className="px-4 py-1">
                                <label htmlFor="checkbox-all" className="">S/No</label>
                            </th>
                            <th scope="col" className="px-4 py-2">
                                Department Code
                            </th>
                            <th scope="col" className="px-4 py-2">
                                Department Name
                            </th>
                            <th scope="col" className="px-4 py-2">
                                Marks
                            </th>
                            <th scope="col" className="px-4 py-2 text-center">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {!isLoading && !deptCode ?
                            <tr className='text-center bg-gray-200'>
                                <td className='text-red-600' colSpan={5}>Type in  the search bar the department code you want to edit</td>
                            </tr> :
                            !isLoading && Array.isArray(department) ?
                                <React.Fragment>
                                    {
                                        department.map((dept, idx) =>
                                            <tr key={dept.deptCode}>
                                                <td className=" px-4 py-2  whitespace-nowrap">

                                                    {idx + 1}

                                                </td>
                                                <td className="px-4 py-2  whitespace-nowrap">
                                                    {dept.deptCode}
                                                </td>
                                                <td className="px-4 py-2  whitespace-nowrap">
                                                    {dept.deptName}
                                                </td>
                                                <td className="px-4 py-2  whitespace-nowrap">
                                                    Marks
                                                </td>
                                                <td className="px-4 py-2  text-center whitespace-nowrap">
                                                    <div className="flex justify-center gap-x-2">
                                                        <button className="w-[60px] rounded-sm py-1 font-medium text-white bg-green-600 dark:bg-green-500 hover:underline"
                                                            onClick={() => setShowEditModal(true)}
                                                        >Edit</button>
                                                        <button className="w-[60px] rounded-sm py-1 font-medium bg-red-600 dark:bg-red-500 hover:underline text-white"
                                                            onClick={()=>setShowDeleteModal(true)}
                                                        >Delete</button>
                                                    </div>
                                                </td>
                                            </tr>)
                                    }
                                </React.Fragment> :
                                <tr className='bg-red-200 text-center'>
                                    <td className='text-red-600' colSpan={5}>No department</td>
                                </tr>
                        }
                    </tbody>
                </table>
            </div>
            <Modal isOpen={showEditModal} setIsOpen={setShowEditModal}>
                <EditDepartment department={department} />
            </Modal>
            <Modal isOpen={showDeleteModal} setIsOpen={setShowDeleteModal} >
   
              <FormTitle bg='red'>Delete Department</FormTitle>
<Button className="p-6">
Delete
</Button>
        
            </Modal>
        </React.Fragment>

    );
};

export default SearchDepartment;
