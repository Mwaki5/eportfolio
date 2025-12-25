import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import { FaUserEdit, FaTimes, FaSave } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Modal from "../../components/Modal";
import FormTitle from "../../components/FormTitle";
import Input from "../../components/Input";
import Label from "../../components/Label";
import Alert from "../../components/Alert";
import { editStudentSchema } from "../../schema/EditStudentSchema";

const UpdateStudent = ({
  editModalOpen,
  isLoading,
  setStudents,
  students,
  setIsLoading,
  setEditModalOpen,
  selectedStudent,
}) => {
  const axios = useAxiosPrivate();
  const [error, setError] = useState(null);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(editStudentSchema),
    mode: "onTouched",
  });

  /**
   * IMPORTANT: Sync form values when selectedStudent changes
   * This ensures the form is populated correctly every time the modal opens.
   */
  useEffect(() => {
    if (selectedStudent) {
      reset({
        userId: selectedStudent.userId,
        firstname: selectedStudent.firstname,
        lastname: selectedStudent.lastname,
        email: selectedStudent.email,
        level: selectedStudent.level,
        department: selectedStudent.department,
        gender: selectedStudent.gender,
        role: "student",
      });
    }
  }, [selectedStudent, reset]);

  const onSubmit = async (data) => {
    setError(null);
    setIsLoading(true);

    try {
      const res = await axios.put(
        `/api/students/edit/${encodeURIComponent(selectedStudent.userId)}`,
        data
      );

      toast.success(res.data.message || "Record updated successfully");

      // Update the local list state to reflect changes without a full refresh
      const updatedList = students.map((s) =>
        s.userId === selectedStudent.userId ? { ...s, ...data } : s
      );
      setStudents(updatedList);

      setEditModalOpen(false);
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to update student.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const selectClass = `bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#00966d] focus:border-[#00966d] block w-full p-2.5 outline-none transition-all`;

  return (
    <Modal isOpen={editModalOpen} setIsOpen={setEditModalOpen}>
      <div className="p-4 sm:p-6 bg-white rounded-xl">
        <FormTitle bg="blue">Edit Student Profile</FormTitle>

        <form
          className="py-2"
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            {/* Admission No
            <div className="space-y-1">
              <Label
                label="Admission No"
                error={errors.userId?.message}
                htmlFor="userId"
              />
              <Input
                name="userId"
                register={register}
                placeholder="BS13/00/21"
                disabled
                readOnly // Usually IDs shouldn't be edited to maintain DB integrity
                className="bg-gray-100 cursor-not-allowed"
              />
            </div> */}

            <input
              value={selectedStudent?.userId}
              type="hidden"
              name="userId"
              {...register("userId")}
            />
            {/* First Name */}
            <div className="space-y-1">
              <Label
                label="First Name"
                error={errors.firstname?.message}
                htmlFor="firstname"
              />
              <Input name="firstname" register={register} placeholder="John" />
            </div>

            {/* Last Name */}
            <div className="space-y-1">
              <Label
                label="Last Name"
                error={errors.lastname?.message}
                htmlFor="lastname"
              />
              <Input name="lastname" register={register} placeholder="Masika" />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label
                label="Email Address"
                error={errors.email?.message}
                htmlFor="email"
              />
              <Input
                name="email"
                register={register}
                placeholder="student@gmail.com"
              />
            </div>

            {/* Level */}
            <div className="space-y-1">
              <Label
                label="Academic Level"
                error={errors.level?.message}
                htmlFor="level"
              />
              <select className={selectClass} {...register("level")}>
                <option value="">Select Level</option>
                <option value="Level 3">Level 3</option>
                <option value="Level 4">Level 4</option>
                <option value="Level 5">Level 5</option>
              </select>
            </div>

            {/* Department */}
            <div className="space-y-1">
              <Label
                label="Department"
                error={errors.department?.message}
                htmlFor="department"
              />

              {/* The visible input field */}
              <input
                list="department-options"
                placeholder="Type to search department..."
                className={`bg-gray-50 border ${
                  errors.department ? "border-red-500" : "border-gray-300"
                } 
      text-gray-900 text-sm rounded-lg focus:ring-[#00966d] focus:border-[#00966d] 
      block w-full p-2.5 outline-none transition-all`}
                {...register("department")}
              />

              {/* The hidden list of options */}
              <datalist id="department-options">
                <option value="ICT" />
                <option value="Food and Beverage" />
                <option value="Computer Science" />
                <option value="Electrical Engineering" />
                <option value="Mechanical Engineering" />
                <option value="Business Administration" />
                <option value="Accounting and Finance" />
                <option value="Health Sciences" />
                <option value="Social Work" />
                {/* You can map over a huge array here easily */}
              </datalist>
            </div>

            {/* Gender */}
            <div className="space-y-1">
              <Label
                label="Gender"
                error={errors.gender?.message}
                htmlFor="gender"
              />
              <select className={selectClass} {...register("gender")}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <Alert error={error} setError={setError} />

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-8 py-2.5 text-sm font-bold text-white bg-[#00966d] hover:bg-[#007a58] rounded-lg shadow-sm disabled:opacity-70 transition-all"
            >
              {isLoading ? (
                <Spinner size="small" />
              ) : (
                <>
                  <FaSave size={14} /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UpdateStudent;
