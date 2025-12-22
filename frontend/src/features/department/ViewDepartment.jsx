import React, { useRef } from 'react'
import { toast } from 'react-toastify';
import Spinner from '../../components/Spinner';
import { useEffect, useState } from 'react';
import useAxiosPrivate from './../../hooks/useAxiosPrivate';
import Modal from '../../components/Modal';
import { useNavigate } from 'react-router-dom';

const ViewDepartment = () => {

    const axios = useAxiosPrivate()
    const [error, setError] = useState(null);
    const [department, setDepartment] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeptLoading, setIsDeptLoading] = useState(false);
    const [dept, setDept] = useState(null);
    const navigate = useNavigate()



    const fetchDepartment = async () => {
        setIsDeptLoading(true)
        try {
            const res = await axios.get('/department/view')
            toast.success(res.data.message);
            setDepartment(res.data.data)
        } catch (error) {
            console.log(error)
            toast.error('Execution not done.');
            setError(error.response.data.message)
        }
        finally {
            setIsDeptLoading(false)
        }
    }
    useEffect(() => {
        fetchDepartment()
    }, [])



    const showDeleteModal = (dept) => {
        setIsModalOpen(true)
        setDept(dept)
    }

    const handleDelete = async (dep) => {
        try {
            const res = await axios.delete(`/department/delete/${dep}`);
            toast.success(res.data.message);
            const data = department.filter((dept) => dept.deptCode != dep)
            setDepartment(data)
            setIsModalOpen(false);
        } catch (err) {
            alert('Failed to delete.');
        }
    };
    const handleEdit = async (deptCode) => {
        navigate(`/admin/department/edit/${deptCode}`)
    };



    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const [searchTerm, setSearchTerm] = useState('');
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };



    // Filter departments by search term
    const filteredDepartments = department.filter((dept) =>
        dept.deptName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const currentDepartments = filteredDepartments.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
    // Calculate paginated data based on filtered departments


    return (
        <div className="flex flex-col items-center w-full">
            {/* Search Bar */}
            <div className="w-full max-w-md mb-4">
                <input
                    type="text"
                    placeholder="Search by department name..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // Reset to first page on search
                    }}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>
            <div className="min-w-full overflow-x-auto">
                {isDeptLoading ?
                    <React.Fragment>
                        <span>Fetching...</span>
                        <Spinner size="small" color="white" />
                    </React.Fragment> : ''
                }

                <table className="min-w-[600px] w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 my-2 shadow-[0_4px_8px_-4px_rgba(0,0,0,0.15)]">
                        <tr>
                            <th scope="col" className="px-4 py-1">
                                <div className="flex items-center">
                                    <label htmlFor="checkbox-all" className="">S/No</label>
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Student name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Unit Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Marks
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {!isDeptLoading && currentDepartments.length > 0 ?
                            <React.Fragment>
                                {
                                    currentDepartments.map((dept, idx) =>
                                        <tr key={dept.deptCode}>
                                            <td className="pl-2 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {indexOfFirstItem + idx + 1}
                                                </div>
                                            </td>
                                            <td className="px-4 py-1 whitespace-nowrap">
                                                {dept.deptCode}
                                            </td>
                                            <td className="px-4 py-1 whitespace-nowrap">
                                                {dept.deptName}
                                            </td>
                                            <td className="px-4 py-1 whitespace-nowrap">
                                                Marks
                                            </td>
                                            <td className="px-4 py-1 text-center whitespace-nowrap">
                                                <div className="flex justify-center gap-x-2">
                                                    <button className="w-[60px] rounded-sm py-1 font-medium text-white bg-green-600 dark:bg-green-500 hover:underline"
                                                        onClick={() => handleEdit(dept.deptCode)}
                                                    >Edit</button>
                                                    <button className="w-[60px] rounded-sm py-1 font-medium bg-red-600 dark:bg-red-500 hover:underline text-white"
                                                        onClick={() => showDeleteModal(dept.deptCode)}
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

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-4 space-x-2">
                        <button
                            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}

                {error &&
                    <div className="p-4 text-sm text-red-800 rounded-lg bg-red-200 text-center dark:bg-gray-800 dark:text-red-400 w-full">
                        <p className="text-center">{error}</p>
                    </div>
                }

                <Modal isOpen={isModalOpen}>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                        Confirm Delete
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Are you sure you want to delete this user? This action cannot be undone.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                        >
                            Close
                        </button>
                        <button
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            onClick={() => handleDelete(dept)} >
                            Delete
                        </button>
                    </div>
                </Modal>
            </div>
        </div>
    )
}

export default ViewDepartment
