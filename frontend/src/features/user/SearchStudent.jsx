import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";

const SearchStudent = () => {
  const [regNo, setRegNo] = useState("");
  const [fetchedData, setFetchedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const axios = useAxiosPrivate();

  const {
    register,
    formState: { errors },
  } = useForm();

  const handleRegChange = (e) => {
    setRegNo(e.target.value);
    setFetchedData(null);
    setIsSuccess(false);
    setError(null);
  };

  const findStudent = async (reg) => {
    if (!reg || reg.trim() === "") {
      toast.error("Please enter a student ID");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/students/${reg}`);
      setIsSuccess(true);
      setFetchedData(res.data.data);
      toast.success("Student found successfully");
    } catch (error) {
      setError(error.response?.data?.message || "Student not found");
      setIsSuccess(false);
      setFetchedData(null);
      if (error.response?.status !== 404) {
        toast.error(
          error.response?.data?.message || "Failed to search student"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-10 w-full">
      <fieldset className="border border-gray-400 rounded-sm p-6">
        <legend className="text-center text-2xl p-2">
          <strong>Search Student</strong>
        </legend>
        <div className="flex gap-x-4 justify-center items-center">
          <label
            htmlFor="regNo"
            className="mb-2 text-sm font-medium dark:text-white"
          >
            Student ID
            <span className="text-red-500">
              {errors.stdregno && errors.stdregno.message}
            </span>
          </label>
          <input
            type="text"
            id="stdregno"
            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[300px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter Student ID"
            {...register("stdregno")}
            name="stdregno"
            value={regNo}
            onChange={(e) => handleRegChange(e)}
            required
          />

          <button
            type="button"
            onClick={() => findStudent(regNo)}
            disabled={isLoading}
            className={`flex items-center gap-2 text-white ${
              isLoading
                ? "bg-green-500 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-800"
            } focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800`}
          >
            {isLoading ? (
              <>
                <Spinner size="small" color="white" />
                <span>Searching...</span>
              </>
            ) : (
              "Search"
            )}
          </button>
        </div>
      </fieldset>

      {isLoading && (
        <div className="w-full grid place-content-center py-8">
          <Spinner size="large" />
        </div>
      )}

      {error && !isLoading && (
        <div className="bg-white border-2 border-dashed border-orange-200 rounded-2xl p-8 text-center max-w-xl mx-auto mt-6">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-3">
              <FaSearch className="text-4xl text-orange-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Student Not Found
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Please check the Student ID and try again, or contact the
            administrator if you believe this is an error.
          </p>
        </div>
      )}

      {isSuccess && fetchedData && (
        <div className="mt-6 border border-gray-300 rounded-sm p-6">
          <h3 className="text-xl font-semibold mb-4">Student Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Student ID:
              </p>
              <p className="font-medium">{fetchedData.userId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Name:</p>
              <p className="font-medium">
                {fetchedData.firstname} {fetchedData.lastname}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email:</p>
              <p className="font-medium">{fetchedData.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Department:
              </p>
              <p className="font-medium">{fetchedData.department}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gender:
              </p>
              <p className="font-medium">{fetchedData.gender}</p>
            </div>
            {fetchedData.level && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Level:
                </p>
                <p className="font-medium">{fetchedData.level}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchStudent;
