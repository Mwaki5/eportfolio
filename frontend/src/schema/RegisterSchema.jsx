import * as Yup from "yup";

export const registerSchema = Yup.object().shape({
  userId: Yup.string()
    .min(2, "User ID must be at least 2 characters")
    .required("User ID is required"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  level: Yup.string().required("Level is required"),

  firstname: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),

  lastname: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),

  profilePic: Yup.mixed()
    .required("Profile picture is required")
    .test("fileSize", "Image must be less than 2MB", (value) => {
      if (!value?.length) return false;
      return value[0].size <= 2 * 1024 * 1024;
    })
    .test("fileType", "Unsupported file format", (value) => {
      if (!value?.length) return false;
      return ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
        value[0].type
      );
    }),

  department: Yup.string()
    .min(2, "Department must be at least 2 characters")
    .required("Department is required"),

  role: Yup.string()
    .oneOf(["student", "staff"], "Invalid role")
    .required("Role is required"),

  gender: Yup.string()
    .oneOf(["Male", "Female"], "Invalid gender")
    .required("Gender is required"),
});
