const { User } = require("../models");
const { Op } = require("sequelize");
const AppError = require("../utils/AppError");
const bcrypt = require("bcryptjs");
const { validateAndSaveFile } = require("../services/fileHandler");

// Get all students
const getAllStudents = async (req, res, next) => {
  try {
    const students = await User.findAll({
      where: { role: "student" },
      attributes: {
        exclude: ["password", "refreshToken"],
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

const filterStudents = async (req, res, next) => {
  try {
    const { firstname, lastname, email, department, level, gender } = req.query;
    let whereClause = { role: "student" };
    const isValid = (val) => val && val !== "undefined" && val.trim() !== "";
    if (isValid(firstname))
      whereClause.firstname = { [Op.like]: `%${firstname}%` };
    if (isValid(lastname))
      whereClause.lastname = { [Op.like]: `%${lastname}%` };
    if (isValid(email)) whereClause.email = { [Op.like]: `%${email}%` };
    if (isValid(department))
      whereClause.department = { [Op.like]: `%${department}%` };
    if (isValid(level)) whereClause.level = level; // Levels are usually exact matches
    if (isValid(gender)) whereClause.gender = gender;
    const students = await User.findAll({
      where: whereClause,
      attributes: { exclude: ["password", "refreshToken"] }, // Safety first
      order: [["createdAt", "DESC"]],
      limit: 100,
    });

    return res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error("Search Error:", error);

    if (res.headersSent) {
      return next(error);
    }
    return res.status(500).json({
      success: false,
      message: "Internal Server Error during search",
    });
  }
};
// Get student by ID
const getStudentById = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const student = await User.findOne({
      where: { userId: studentId, role: "student" },
      attributes: {
        exclude: ["password", "refreshToken"],
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// Search students
const searchStudents = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: "Search identifier is required",
      });
    }
    const students = await User.findAll({
      where: {
        role: "student",
        [Op.or]: [
          { userId: { [Op.like]: identifier } },
          { email: { [Op.like]: identifier } },
        ],
      },
      attributes: {
        exclude: ["password", "refreshToken"],
      },
      limit: 50,
    });

    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

// Update student
const updateStudent = async (req, res, next) => {
  try {
    console.log("Update Student Req Body:", req.body);
    const { studentId } = req.params;
    const { userId, email, firstname, lastname, gender, department, level } =
      req.body;

    const student = await User.findOne({
      where: { userId: studentId, role: "student" },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Update profile picture if provided
    if (req.file) {
      const profilePicPath = await validateAndSaveFile(req.file, "profilePic", {
        allowedTypes: ["image/jpeg", "image/png", "image/webp"],
        maxSize: 2 * 1024 * 1024,
      });
      const filepath = profilePicPath
        .replace(/\\/g, "/")
        .replace("public/", "");
      student.profilePic = filepath;
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

    // Remove sensitive data before sending response
    const studentData = student.toJSON();
    delete studentData.password;
    delete studentData.refreshToken;

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: studentData,
    });
  } catch (error) {
    next(error);
  }
};

// Delete student
const deleteStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const student = await User.findOne({
      where: { userId: studentId, role: "student" },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    await student.destroy();

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
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
