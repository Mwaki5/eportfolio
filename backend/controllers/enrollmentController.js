const { Enrollment, Unit, User } = require("../models");
const { Op } = require("sequelize");
const AppError = require("../utils/AppError");

// Create enrollment
const createEnrollment = async (req, res, next) => {
  try {
    const { studentId, unitCode, session } = req.body;

    // Verify student exists
    const student = await User.findOne({
      where: { userId: studentId, role: "student" },
    });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Verify unit exists
    const unit = await Unit.findOne({ where: { unitCode } });
    if (!unit) {
      return res.status(404).json({
        success: false,
        message: "Unit not found",
      });
    }

    // Check if enrollment already exists
    const existingEnrollment = await Enrollment.findOne({
      where: { studentId, unitCode, session },
    });
    if (existingEnrollment) {
      return res.status(409).json({
        success: false,
        message: "Student is already enrolled in this unit for this session",
      });
    }

    const enrollment = await Enrollment.create({
      studentId,
      unitCode,
      session,
    });

    res.status(201).json({
      success: true,
      message: "Enrollment created successfully",
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};

// Get all enrollments
const getAllEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.findAll({
      include: [
        {
          model: User,
          as: "User",
          attributes: ["userId", "firstname", "lastname", "email"],
        },
        {
          model: Unit,
          as: "Unit",
          attributes: ["unitCode", "staffId"],
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    next(error);
  }
};

// Get enrollments by student
const getEnrollmentsByStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const enrollments = await Enrollment.findAll({
      where: { studentId },
      include: [
        {
          model: Unit,
          as: "Unit",
          attributes: ["unitCode", "staffId"],
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    next(error);
  }
};

// Get enrollments by unit
const getEnrollmentsByUnit = async (req, res, next) => {
  try {
    const { unitCode } = req.params;

    const enrollments = await Enrollment.findAll({
      where: { unitCode },
      include: [
        {
          model: User,
          as: "User",
          attributes: ["userId", "firstname", "lastname", "email"],
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    next(error);
  }
};

// Update enrollment
const updateEnrollment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { studentId, unitCode, session } = req.body;

    const enrollment = await Enrollment.findByPk(id);
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    // Verify student exists if being updated
    if (studentId) {
      const student = await User.findOne({
        where: { userId: studentId, role: "student" },
      });
      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }
      enrollment.studentId = studentId;
    }

    // Verify unit exists if being updated
    if (unitCode) {
      const unit = await Unit.findOne({ where: { unitCode } });
      if (!unit) {
        return res.status(404).json({
          success: false,
          message: "Unit not found",
        });
      }
      enrollment.unitCode = unitCode;
    }

    // Update session if provided
    if (session) {
      enrollment.session = session;
    }

    await enrollment.save();

    res.status(200).json({
      success: true,
      message: "Enrollment updated successfully",
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};

// Delete enrollment
const deleteEnrollment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const enrollment = await Enrollment.findByPk(id);
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    await enrollment.destroy();

    res.status(200).json({
      success: true,
      message: "Enrollment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEnrollment,
  getAllEnrollments,
  getEnrollmentsByStudent,
  getEnrollmentsByUnit,
  updateEnrollment,
  deleteEnrollment,
};

