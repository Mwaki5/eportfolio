
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import Spinner from './Spinner';
import { useEffect, useRef } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useParams, useNavigate } from 'react-router-dom';
import FormTitle from './FormTitle';
import Button from './Button';



const SearchBar = ({ title = '', handleClick, setValue, placeholder = '', isLoading }) => {
    const [error, setError] = useState(null);

    const codeRef = useRef()

    const submitClick = () => {
        const code = codeRef.current.value
        setValue(code)
        handleClick(code)
    }
    return (
        <div className=" grid gap-6 w-full shadow-sm mt-5" >
            <FormTitle >{title}</FormTitle>
            <div className=" flex gap-6 py-6 justify-center items-center ">
                <input type="search" id="kinothername"
                    className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  w-[300px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder={placeholder}
                    name='code'
                    ref={codeRef}
                    required />
                <Button onClick={submitClick}
                    isLoading={isLoading}
                    type='button'
                >
                    Submit
                </Button>

            </div>
            {error &&
                <div className="p-4 text-sm text-red-800 rounded-lg bg-red-200 text-center dark:bg-gray-800 dark:text-red-400 w-full">
                    <p className="text-center">{error}</p>
                </div>
            }
        </div>

    )
}

export default SearchBar
