const { Enrollment, Unit, User } = require("../models");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");
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
      where: { studentId: student.id, unitId: unit.unitId, session },
    });
    if (existingEnrollment) {
      return res.status(409).json({
        success: false,
        message: "Student is already enrolled in this unit for this session",
      });
    }

    const enrollment = await Enrollment.create({
      studentId: student.id,
      unitId: unit.unitId,
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
          attributes: ["unitCode", "staffId", "unitName"],
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

    const student = await User.findOne({
      where: { userId: studentId, role: "student" },
    });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const enrollments = await Enrollment.findAll({
      where: { studentId: student.id },
      include: [
        {
          model: Unit,
          as: "Unit",
          // attributes: ["unitCode", "staffId"],
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
      enrollment.studentId = student.id;
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
      enrollment.unitId = unit.unitId;
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

// Search enrollments
const searchEnrollments = async (req, res, next) => {
  try {
    const { identifier } = req.params;

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: "Search parameter is required",
      });
    }

    const enrollments = await Enrollment.findAll({
      where: {
        [Op.or]: [
          { session: { [Op.like]: identifier } }, // Enrollment table
          { "$Unit.unitCode$": { [Op.like]: identifier } }, // Unit table
          { "$User.userId$": { [Op.like]: identifier } }, // User table
        ],
      },
      include: [
        {
          model: User,
          as: "User",
          attributes: ["userId", "firstname", "lastname", "email"],
        },
        {
          model: Unit,
          as: "Unit",
          attributes: ["unitCode", "unitName", "staffId"],
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      limit: 50,
    });

    res.status(200).json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    next(error);
  }
};

const filterEnrollments = async (req, res, next) => {
  try {
    const { studentId, unitId, session, query } = req.query;
    let whereClause = {};
    const isValid = (val) => val && val !== "undefined" && val.trim() !== "";
    if (isValid(studentId))
      whereClause.studentId = { [Op.like]: `%${studentId}%` };
    if (isValid(unitId)) whereClause.unitId = { [Op.like]: `%${unitId}%` };
    if (isValid(session)) whereClause.session = { [Op.like]: `%${session}%` };

    const enrollments = await Enrollment.findAll({
      where: whereClause, // Sequelize joins these with AND by default
      include: [
        {
          model: User,
          as: "User",
          attributes: ["userId", "firstname", "lastname", "level"],
        },
        {
          model: Unit,
          as: "Unit",
          attributes: ["unitCode", "staffId", "unitName"],
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      limit: 50,
    });

    return res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    console.error("Filter Enrollments Error:", error);
    if (res.headersSent) return next(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
const getEnrolledSessions = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    // Fetch distinct sessions for the student
    const sessions = await Enrollment.findAll({
      include: [
        {
          model: User,
          as: "User", // match your association alias
          where: { userId: studentId }, // filter by userId
          attributes: [], // no user attributes needed
        },
      ],
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("session")), "session"],
      ],
      raw: true, // return plain objects
      order: [["session", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      data: sessions.map((s) => s.session),
    });
  } catch (error) {
    console.error("Filter Enrollments Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createEnrollment,
  filterEnrollments,
  getAllEnrollments,
  getEnrolledSessions,
  getEnrollmentsByStudent,
  getEnrollmentsByUnit,
  updateEnrollment,
  deleteEnrollment,
  searchEnrollments,
};
