// controllers/enrollmentController.js
const { Enrollment, Unit, User } = require("../models");
const { Op, Sequelize } = require("sequelize");
const {
  appLogger,
  auditLogger,
  errorLogger,
  addRequestMetadata,
} = require("../utils/logger");
const AppError = require("../utils/AppError");

// Helper to validate values
const isValid = (val) => val && val !== "undefined" && val.trim() !== "";

// --- Create Enrollment ---
const createEnrollment = async (req, res, next) => {
  try {
    const { studentId, unitCode, session } = req.body;

    // Verify student
    const student = await User.findOne({
      where: { userId: studentId, role: "student" },
    });
    if (!student) throw new AppError("Student not found", 404);

    // Verify unit
    const unit = await Unit.findOne({ where: { unitCode } });
    if (!unit) throw new AppError("Unit not found", 404);

    // Check existing enrollment
    const existingEnrollment = await Enrollment.findOne({
      where: { studentId, unitCode, session },
    });
    if (existingEnrollment)
      throw new AppError("Student already enrolled for this session", 409);

    const enrollment = await Enrollment.create({
      studentId,
      unitCode,
      session,
    });

    auditLogger.info(
      `Enrollment created: ${studentId} in ${unitCode} for ${session}`,
      addRequestMetadata({ req, enrollment })
    );

    res.status(201).json({
      success: true,
      message: "Enrollment created successfully",
      data: enrollment,
    });
  } catch (error) {
    errorLogger.error(
      "Create Enrollment Error",
      addRequestMetadata({ req, error })
    );
    next(error);
  }
};

// --- Get All Enrollments ---
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

    res.status(200).json({ success: true, data: enrollments });
  } catch (error) {
    errorLogger.error(
      "Get All Enrollments Error",
      addRequestMetadata({ req, error })
    );
    next(error);
  }
};

// --- Get Enrollments by Student ---
const getEnrollmentsByStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const student = await User.findOne({
      where: { userId: studentId, role: "student" },
    });
    if (!student) throw new AppError("Student not found", 404);

    const enrollments = await Enrollment.findAll({
      where: { studentId },
      include: [{ model: Unit, as: "Unit" }],
    });

    res.status(200).json({ success: true, data: enrollments });
  } catch (error) {
    errorLogger.error(
      "Get Enrollments By Student Error",
      addRequestMetadata({ req, error })
    );
    next(error);
  }
};

// --- Get Enrollments by Unit ---
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

    res.status(200).json({ success: true, data: enrollments });
  } catch (error) {
    errorLogger.error(
      "Get Enrollments By Unit Error",
      addRequestMetadata({ req, error })
    );
    next(error);
  }
};

// --- Update Enrollment ---
const updateEnrollment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { studentId, unitCode, session } = req.body;

    const enrollment = await Enrollment.findByPk(id);
    if (!enrollment) throw new AppError("Enrollment not found", 404);

    if (studentId) {
      const student = await User.findOne({
        where: { userId: studentId, role: "student" },
      });
      if (!student) throw new AppError("Student not found", 404);
      enrollment.studentId = student.userId;
    }

    if (unitCode) {
      const unit = await Unit.findOne({ where: { unitCode } });
      if (!unit) throw new AppError("Unit not found", 404);
      enrollment.unitCode = unit.unitCode;
    }

    if (session) enrollment.session = session;

    await enrollment.save();

    auditLogger.info(
      `Enrollment updated: ID ${id}`,
      addRequestMetadata({ req, enrollment })
    );

    res.status(200).json({
      success: true,
      message: "Enrollment updated successfully",
      data: enrollment,
    });
  } catch (error) {
    errorLogger.error(
      "Update Enrollment Error",
      addRequestMetadata({ req, error })
    );
    next(error);
  }
};

// --- Delete Enrollment ---
const deleteEnrollment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const enrollment = await Enrollment.findByPk(id);
    if (!enrollment) throw new AppError("Enrollment not found", 404);

    await enrollment.destroy();

    auditLogger.info(
      `Enrollment deleted: ID ${id}`,
      addRequestMetadata({ req })
    );

    res
      .status(200)
      .json({ success: true, message: "Enrollment deleted successfully" });
  } catch (error) {
    errorLogger.error(
      "Delete Enrollment Error",
      addRequestMetadata({ req, error })
    );
    next(error);
  }
};

// --- Search / Filter Enrollments ---
const searchEnrollments = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    if (!identifier) throw new AppError("Search parameter is required", 400);

    const enrollments = await Enrollment.findAll({
      where: {
        [Op.or]: [
          { session: { [Op.like]: `%${identifier}%` } },
          { "$Unit.unitCode$": { [Op.like]: `%${identifier}%` } },
          { "$User.userId$": { [Op.like]: `%${identifier}%` } },
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
      limit: 50,
    });

    res.status(200).json({ success: true, data: enrollments });
  } catch (error) {
    errorLogger.error(
      "Search Enrollments Error",
      addRequestMetadata({ req, error })
    );
    next(error);
  }
};

// --- Filter Enrollments with Query Params ---
const filterEnrollments = async (req, res, next) => {
  try {
    const { studentId, unitCode, session } = req.query;
    let whereClause = {};
    if (isValid(studentId))
      whereClause.studentId = { [Op.like]: `%${studentId}%` };
    if (isValid(unitCode))
      whereClause.unitCode = { [Op.like]: `%${unitCode}%` };
    if (isValid(session)) whereClause.session = { [Op.like]: `%${session}%` };

    const enrollments = await Enrollment.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "User",
          attributes: ["userId", "firstname", "lastname", "level"],
        },
        {
          model: Unit,
          as: "Unit",
          attributes: ["unitCode", "unitName", "staffId"],
        },
      ],
      limit: 50,
    });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    errorLogger.error(
      "Filter Enrollments Error",
      addRequestMetadata({ req, error })
    );
    next(error);
  }
};

// --- Get Enrolled Sessions ---
const getEnrolledSessions = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const sessions = await Enrollment.findAll({
      include: [
        {
          model: User,
          as: "User",
          where: { userId: studentId },
          attributes: [],
        },
      ],
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("session")), "session"],
      ],
      raw: true,
      order: [["session", "ASC"]],
    });

    res
      .status(200)
      .json({ success: true, data: sessions.map((s) => s.session) });
  } catch (error) {
    errorLogger.error(
      "Get Enrolled Sessions Error",
      addRequestMetadata({ req, error })
    );
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
  searchEnrollments,
  filterEnrollments,
  getEnrolledSessions,
};
