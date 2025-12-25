const { Marks, Unit, User, Enrollment } = require("../models");
const { Op } = require("sequelize");
const AppError = require("../utils/AppError");

// Create/Register marks
const createMarks = async (req, res, next) => {
  try {
    const {
      studentId,
      unitCode,
      theory1,
      theory2,
      theory3,
      prac1,
      prac2,
      prac3,
    } = req.body;

    // Verify enrollment

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

    const enrollment = await Enrollment.findOne({
      where: { unitId: unit.unitId, studentId: student.id },
    });
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Student must enroll for the unit first",
      });
    }

    // Check if marks already exist for this student and unit
    const existingMarks = await Marks.findOne({
      where: { studentId: student.id, unitId: unit.unitId },
    });

    let marks;
    if (existingMarks) {
      // Update existing marks - only update fields that are provided
      if (theory1 !== undefined && theory1 !== null && theory1 !== "") {
        existingMarks.theory1 = theory1;
      }
      if (theory2 !== undefined && theory2 !== null && theory2 !== "") {
        existingMarks.theory2 = theory2;
      }
      if (theory3 !== undefined && theory3 !== null && theory3 !== "") {
        existingMarks.theory3 = theory3;
      }
      if (prac1 !== undefined && prac1 !== null && prac1 !== "") {
        existingMarks.prac1 = prac1;
      }
      if (prac2 !== undefined && prac2 !== null && prac2 !== "") {
        existingMarks.prac2 = prac2;
      }
      if (prac3 !== undefined && prac3 !== null && prac3 !== "") {
        existingMarks.prac3 = prac3;
      }
      await existingMarks.save();
      marks = existingMarks;
    } else {
      // Create new marks record
      marks = await Marks.create({
        studentId: student.id,
        unitId: unit.unitId,
        theory1: theory1 || null,
        theory2: theory2 || null,
        theory3: theory3 || null,
        prac1: prac1 || null,
        prac2: prac2 || null,
        prac3: prac3 || null,
      });
    }

    res.status(existingMarks ? 200 : 201).json({
      success: true,
      message: existingMarks
        ? "Marks updated successfully"
        : "Marks registered successfully",
      data: marks,
    });
  } catch (error) {
    next(error);
  }
};

// Get all marks
const getAllMarks = async (req, res, next) => {
  try {
    const marks = await Marks.findAll({
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
      data: marks,
    });
  } catch (error) {
    next(error);
  }
};

// Get marks by student
const getMarksByStudentId = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const student = await User.findOne({
      where: { userId, role: "student" },
    });

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    const marks = await Marks.findAll({
      where: { studentId: student.id },
      include: [
        {
          model: Unit,
          as: "Unit",
          attributes: ["unitCode", "unitName"],
        },
      ],
    });

    res.json({ success: true, data: marks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get marks by unit
const getMarksByUnit = async (req, res, next) => {
  try {
    const { unitCode } = req.params;

    // First find the unit by unitCode
    const unit = await Unit.findOne({ where: { unitCode } });
    if (!unit) {
      return res.status(404).json({
        success: false,
        message: "Unit not found",
      });
    }

    const marks = await Marks.findAll({
      where: { unitId: unit.unitId },
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
    });

    res.status(200).json({
      success: true,
      data: marks,
    });
  } catch (error) {
    next(error);
  }
};

// Update marks
const updateMarks = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { theory1, theory2, theory3, prac1, prac2, prac3 } = req.body;

    const marks = await Marks.findByPk(id);
    if (!marks) {
      return res.status(404).json({
        success: false,
        message: "Marks not found",
      });
    }

    // Update only provided fields
    if (theory1 !== undefined) marks.theory1 = theory1;
    if (theory2 !== undefined) marks.theory2 = theory2;
    if (theory3 !== undefined) marks.theory3 = theory3;
    if (prac1 !== undefined) marks.prac1 = prac1;
    if (prac2 !== undefined) marks.prac2 = prac2;
    if (prac3 !== undefined) marks.prac3 = prac3;

    await marks.save();

    res.status(200).json({
      success: true,
      message: "Marks updated successfully",
      data: marks,
    });
  } catch (error) {
    next(error);
  }
};

// Delete marks
const deleteMarks = async (req, res, next) => {
  try {
    const { id } = req.params;

    const marks = await Marks.findByPk(id);
    if (!marks) {
      return res.status(404).json({
        success: false,
        message: "Marks not found",
      });
    }

    await marks.destroy();

    res.status(200).json({
      success: true,
      message: "Marks deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getMarksBySession = async (req, res) => {
  try {
    const { userId, session } = req.params;

    /* 1️⃣ Resolve student primary key */
    const student = await User.findOne({
      where: { userId, role: "student" },
      attributes: ["id"],
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    /* 2️⃣ Get unitIds enrolled in this session */
    const unitRows = await Enrollment.findAll({
      where: {
        studentId: student.id,
        session,
      },
      attributes: ["unitId"],
      raw: true,
    });

    const unitIds = unitRows.map((u) => u.unitId);

    if (!unitIds.length) {
      return res.json({ success: true, data: [] });
    }

    /* 3️⃣ Fetch marks using studentId + unitId */
    const marks = await Marks.findAll({
      where: {
        studentId: student.id,
        unitId: {
          [Op.in]: unitIds,
        },
      },
      include: [
        {
          model: Unit,
          as: "Unit",
          attributes: ["unitCode", "unitName"],
        },
      ],
      order: [["unitId", "ASC"]],
    });

    return res.json({
      success: true,
      data: marks,
    });
  } catch (error) {
    console.error("Get Marks By Session Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createMarks,
  getAllMarks,
  getMarksByStudentId,
  getMarksByUnit,
  getMarksBySession,
  updateMarks,
  deleteMarks,
};
