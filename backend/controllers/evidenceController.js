const { Evidence, Unit, User } = require("../models");
const { Op } = require("sequelize");
const AppError = require("../utils/AppError");
const { validateAndSaveFile } = require("../services/fileHandler");

// Create evidence
const createEvidence = async (req, res, next) => {
  try {
    const { unitCode, description } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Evidence file is required",
      });
    }

    // Verify student exists
    const student = await User.findOne({
      where: { userId: req.userId, role: "student" },
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

    // Determine evidence type based on MIME type
    const mimeType = req.file.mimetype;
    let evidenceType = "image";

    if (mimeType.startsWith("video/")) {
      evidenceType = "video";
    } else if (mimeType.startsWith("image/")) {
      evidenceType = "image";
    }

    // Validate and save file
    const allowedTypes =
      evidenceType === "video"
        ? [
            "video/mp4",
            "video/mpeg",
            "video/quicktime",
            "video/x-msvideo",
            "video/webm",
          ]
        : ["image/jpeg", "image/png", "image/webp", "image/gif"];

    const filePath = await validateAndSaveFile(req.file, "evidences", {
      allowedTypes,
      maxSize: evidenceType === "video" ? 100 * 1024 * 1024 : 10 * 1024 * 1024, // 100MB for videos, 10MB for images
    });

    const filepath = filePath.replace(/\\/g, "/").replace("public/", "");

    const evidence = await Evidence.create({
      studentId: student.id,
      unitId: unit.unitId,
      filename: filepath,
      originalname: req.file.originalname,
      description: description || null,
      evidenceType,
      uploadedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Evidence uploaded successfully",
      data: evidence,
    });
  } catch (error) {
    next(error);
  }
};

// Get all evidence
const getAllEvidence = async (req, res, next) => {
  try {
    const evidence = await Evidence.findAll({
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
      order: [["uploadedAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: evidence,
    });
  } catch (error) {
    next(error);
  }
};

// Get evidence by student - organized by unit then by type
const getEvidenceByStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params; // This is the alphanumeric userId (e.g., IN13/...)

    const evidence = await Evidence.findAll({
      include: [
        {
          model: User,
          as: "User",
          attributes: ["userId", "firstname", "lastname"],
          where: { userId: studentId }, // Filter Evidence by User.userId
          required: true, // Inner Join
        },
        {
          model: Unit,
          as: "Unit",
          attributes: ["unitCode", "unitName", "staffId"],
        },
      ],
      order: [
        // FIX: Reference the column via the Included Model
        [{ model: Unit, as: "Unit" }, "unitCode", "ASC"],
        ["evidenceType", "ASC"],
        ["uploadedAt", "DESC"],
      ],
    });

    const organized = {};
    evidence.forEach((item) => {
      // Use the unitCode from the included Unit model
      const unitCode = item.Unit?.unitCode || "Unknown";

      if (!organized[unitCode]) {
        organized[unitCode] = {
          unitCode,
          unitName: item.Unit?.unitName,
          images: [],
          videos: [],
        };
      }

      if (item.evidenceType === "image") {
        organized[unitCode].images.push(item);
      } else {
        organized[unitCode].videos.push(item);
      }
    });

    res.status(200).json({
      success: true,
      data: Object.values(organized),
    });
  } catch (error) {
    console.error("Query Error:", error);
    next(error);
  }
};

// Get evidence by unit
const getEvidenceByUnit = async (req, res, next) => {
  try {
    const { unitCode } = req.params;

    const evidence = await Evidence.findAll({
      where: { unitCode },
      include: [
        {
          model: User,
          as: "User",
          attributes: ["userId", "firstname", "lastname", "email"],
        },
      ],
      order: [["uploadedAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: evidence,
    });
  } catch (error) {
    next(error);
  }
};

// Update evidence
const updateEvidence = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { studentId, unitCode, description } = req.body;

    const evidence = await Evidence.findByPk(id);
    if (!evidence) {
      return res.status(404).json({
        success: false,
        message: "Evidence not found",
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
      evidence.studentId = studentId;
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
      evidence.unitCode = unitCode;
    }

    // Update description if provided
    if (description !== undefined) {
      evidence.description = description;
    }

    // Update file if provided
    if (req.file) {
      const mimeType = req.file.mimetype;
      let evidenceType = "image";

      if (mimeType.startsWith("video/")) {
        evidenceType = "video";
      } else if (mimeType.startsWith("image/")) {
        evidenceType = "image";
      }

      const allowedTypes =
        evidenceType === "video"
          ? [
              "video/mp4",
              "video/mpeg",
              "video/quicktime",
              "video/x-msvideo",
              "video/webm",
            ]
          : ["image/jpeg", "image/png", "image/webp", "image/gif"];

      const filePath = await validateAndSaveFile(req.file, "evidences", {
        allowedTypes,
        maxSize:
          evidenceType === "video" ? 100 * 1024 * 1024 : 10 * 1024 * 1024,
      });
      const filepath = filePath.replace(/\\/g, "/").replace("public/", "");
      evidence.filename = filepath;
      evidence.originalname = req.file.originalname;
      evidence.evidenceType = evidenceType;
    }

    await evidence.save();

    res.status(200).json({
      success: true,
      message: "Evidence updated successfully",
      data: evidence,
    });
  } catch (error) {
    next(error);
  }
};

// Delete evidence
const deleteEvidence = async (req, res, next) => {
  try {
    const { id } = req.params;

    const evidence = await Evidence.findByPk(id);
    if (!evidence) {
      return res.status(404).json({
        success: false,
        message: "Evidence not found",
      });
    }

    await evidence.destroy();

    res.status(200).json({
      success: true,
      message: "Evidence deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvidence,
  getAllEvidence,
  getEvidenceByStudent,
  getEvidenceByUnit,
  updateEvidence,
  deleteEvidence,
};
