import * as yup from "yup";
export const editStudentSchema = yup.object().shape({
  userId: yup
    .string()
    .min(2, "User ID must be at least 2 characters")
    .required("User ID is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  firstname: yup
    .string()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  lastname: yup
    .string()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
  //   profilePic: yup
  //     .mixed()
  //     .required("Profile picture is required")
  //     .test("fileSize", "Image must be less than 2MB", (value) => {
  //       if (!value?.length) return false;
  //       return value[0].size <= 2 * 1024 * 1024;
  //     })
  //     .test("fileType", "Unsupported file format", (value) => {
  //       if (!value?.length) return false;
  //       return ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
  //         value[0].type
  //       );
  //     }),
  department: yup
    .string()
    .min(2, "Department must be at least 2 characters")
    .required("Department is required"),
  level: yup
    .string()
    .min(2, "Level must be at least 2 characters")
    .required("Level is required"),
  role: yup
    .string()
    .oneOf(["student", "staff"], "Invalid role")
    .required("Role is required"),

  gender: yup
    .string()
    .oneOf(["Male", "Female"], "Invalid gender")
    .required("Gender is required"),
});
