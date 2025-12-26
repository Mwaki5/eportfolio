const { User } = require("../models");
const { Op } = require("sequelize");
const AppError = require("../utils/AppError");
const { validateAndSaveFile } = require("../services/fileHandler");
const {
  appLogger,
  auditLogger,
  errorLogger,
  addRequestMetadata,
} = require("../utils/logger");

// ===== GET ALL STUDENTS =====
const getAllStudents = async (req, res, next) => {
  try {
    const students = await User.findAll({
      where: { role: "student" },
      attributes: { exclude: ["password", "refreshToken"] },
      order: [["createdAt", "DESC"]],
    });

    appLogger.info("Fetched all students", addRequestMetadata({ req }));
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    errorLogger.error(
      "Error fetching all students",
      addRequestMetadata({ req, error })
    );
    next(error);
  }
};

// ===== FILTER STUDENTS =====
const filterStudents = async (req, res, next) => {
  try {
    const { department, level, gender } = req.query;
    let whereClause = { role: "student" };
    const isValid = (val) => val && val !== "undefined" && val.trim() !== "";

    if (isValid(department))
      whereClause.department = { [Op.like]: `%${department}%` };
    if (isValid(level)) whereClause.level = level;
    if (isValid(gender)) whereClause.gender = gender;

    const students = await User.findAll({
      where: whereClause,
      attributes: { exclude: ["password", "refreshToken"] },
      order: [["createdAt", "DESC"]],
      limit: 100,
    });

    auditLogger.info(
      "Filtered students",
      addRequestMetadata({ req, filters: req.query })
    );
    return res
      .status(200)
      .json({ success: true, count: students.length, data: students });
  } catch (error) {
    errorLogger.error(
      "Error filtering students",
      addRequestMetadata({ req, error })
    );
    next(error);
  }
};

// ===== GET STUDENT BY ID =====
const getStudentById = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const student = await User.findOne({
      where: { userId: studentId, role: "student" },
      attributes: { exclude: ["password", "refreshToken"] },
    });

    if (!student) {
      auditLogger.warn(
        "Student not found",
        addRequestMetadata({ req, studentId })
      );
      return next(new AppError("Student not found", 404));
    }

    appLogger.info(
      "Fetched student by ID",
      addRequestMetadata({ req, studentId })
    );
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    errorLogger.error(
      "Error fetching student by ID",
      addRequestMetadata({ req, error })
    );
    next(error);
  }
};

// ===== SEARCH STUDENTS =====
const searchStudents = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    if (!identifier)
      return next(new AppError("Search identifier is required", 400));

    const students = await User.findAll({
      where: {
        role: "student",
        [Op.or]: [
          { userId: { [Op.like]: `%${identifier}%` } },
          { email: { [Op.like]: `%${identifier}%` } },
        ],
      },
      attributes: { exclude: ["password", "refreshToken"] },
      limit: 50,
    });

    auditLogger.info(
      "Searched students",
      addRequestMetadata({ req, identifier })
    );
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    errorLogger.error(
      "Error searching students",
      addRequestMetadata({ req, error })
    );
    next(error);
  }
};

// ===== UPDATE STUDENT =====
const updateStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { userId, email, firstname, lastname, gender, department, level } =
      req.body;

    const student = await User.findOne({
      where: { userId: studentId, role: "student" },
    });
    if (!student) return next(new AppError("Student not found", 404));

    // Update profile picture if provided
    if (req.file) {
      const profilePicPath = await validateAndSaveFile(req.file, "profilePic", {
        allowedTypes: ["image/jpeg", "image/png", "image/webp"],
        maxSize: 2 * 1024 * 1024,
      });
      student.profilePic = profilePicPath
        .replace(/\\/g, "/")
        .replace("public/", "");
    }

    // Update fields
    if (userId) student.userId = userId;
    if (email) student.email = email;
    if (firstname) student.firstname = firstname;
    if (lastname) student.lastname = lastname;
    if (gender) student.gender = gender;
    if (department) student.department = department;
    if (level) student.level = level;

    await student.save();

    const studentData = student.toJSON();
    delete studentData.password;
    delete studentData.refreshToken;

    auditLogger.info("Updated student", addRequestMetadata({ req, studentId }));
    res
      .status(200)
      .json({
        success: true,
        message: "Student updated successfully",
        data: studentData,
      });
  } catch (error) {
    errorLogger.error(
      "Error updating student",
      addRequestMetadata({ req, error })
    );
    next(error);
  }
};

// ===== DELETE STUDENT =====
const deleteStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const student = await User.findOne({
      where: { userId: studentId, role: "student" },
    });
    if (!student) return next(new AppError("Student not found", 404));

    await student.destroy();
    auditLogger.info("Deleted student", addRequestMetadata({ req, studentId }));

    res
      .status(200)
      .json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    errorLogger.error(
      "Error deleting student",
      addRequestMetadata({ req, error })
    );
    next(error);
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  filterStudents,
  searchStudents,
  updateStudent,
  deleteStudent,
};
