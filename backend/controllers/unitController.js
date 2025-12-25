const { Unit, User } = require("../models");
const { Op } = require("sequelize");
const AppError = require("../utils/AppError");

// Create a new unit
const createUnit = async (req, res, next) => {
  try {
    const { unitCode, staffId, unitName } = req.body;

    // Check if unit code already exists
    const existingUnit = await Unit.findOne({ where: { unitCode } });
    if (existingUnit) {
      return res.status(409).json({
        success: false,
        message: "Unit code already exists",
      });
    }

    // Verify staff exists
    const staff = await User.findOne({
      where: { userId: staffId, role: "staff" },
    });
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found",
      });
    }

    const unit = await Unit.create({
      unitCode,
      unitName,
      staffId: staff.id,
    });

    res.status(201).json({
      success: true,
      message: "Unit created successfully",
      data: unit,
    });
  } catch (error) {
    next(error);
  }
};

// Get all units
const getAllUnits = async (req, res, next) => {
  try {
    const units = await Unit.findAll({
      include: [
        {
          model: User,
          as: "Staff",
          attributes: ["userId", "firstname", "lastname", "email"],
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: units,
    });
  } catch (error) {
    next(error);
  }
};

const filterUnits = async (req, res, next) => {
  try {
    const { unitCode, unitName, staffId } = req.query;

    let conditions = [];

    const isValid = (val) => val && val !== "undefined" && val.trim() !== "";

    if (isValid(unitCode)) {
      conditions.push({ unitCode: { [Op.like]: `%${unitCode}%` } });
    }
    if (isValid(unitName)) {
      conditions.push({ unitName: { [Op.like]: `%${unitName}%` } });
    }
    if (isValid(staffId)) {
      // staffId is usually an exact match (FK)
      conditions.push({ staffId: staffId });
    }
    const whereClause = conditions.length > 0 ? { [Op.and]: conditions } : {};

    const units = await Unit.findAll({
      where: whereClause,
      include: {
        model: User,
        as: "Staff",
        attributes: ["userId", "firstname", "lastname", "email"],
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: [["unitCode", "ASC"]],
      limit: 50,
    });

    return res.status(200).json({
      success: true,
      count: units.length,
      data: units,
    });
  } catch (error) {
    if (res.headersSent) {
      return next(error);
    }
    return res.status(500).json({
      success: false,
      message: "Internal Server Error during unit filtering",
    });
  }
};

const getUnitByCode = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    if (!identifier || identifier === "undefined") {
      return res.status(400).json({
        success: false,
        message: "A valid unit code or name is required",
      });
    }

    const unit = await Unit.findAll({
      where: { unitCode: identifier },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: User,
          as: "Staff",
          attributes: ["userId", "firstname", "lastname", "email"],
        },
      ],
    });

    if (!unit) {
      return res.status(404).json({
        success: false,
        message: `No unit found matching: ${identifier}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: unit,
    });
  } catch (error) {
    if (res.headersSent) return next(error);
    next(error);
  }
};

// Update unit
const updateUnit = async (req, res, next) => {
  try {
    const { unitCode } = req.params;
    const { newStaffId, newUnitCode, newUnitName } = req.body;

    const unit = await Unit.findOne({ where: { unitCode } });
    if (!unit) {
      return res.status(404).json({
        success: false,
        message: "Unit not found",
      });
    }
    // const newunit = await Unit.findOne({ where: { unitCode: newUnitCode } });
    // if (newunit) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Unit code already",
    //   });
    // }

    // If staffId is being updated, verify staff exists
    if (newStaffId) {
      const staff = await User.findOne({
        where: { userId: newStaffId, role: "staff" },
      });
      if (!staff) {
        return res.status(404).json({
          success: false,
          message: "Staff member not found",
        });
      }
      unit.staffId = staff.id;
      unit.unitName = newUnitName;
      unit.unitCode = newUnitCode;
    }

    await unit.save();

    res.status(200).json({
      success: true,
      message: "Unit updated successfully",
      data: unit,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Delete unit
const deleteUnit = async (req, res, next) => {
  try {
    const { unitCode } = req.params;

    const unit = await Unit.findOne({ where: { unitCode } });
    if (!unit) {
      return res.status(404).json({
        success: false,
        message: "Unit not found",
      });
    }

    await unit.destroy();

    res.status(200).json({
      success: true,
      message: "Unit deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUnit,
  getAllUnits,
  getUnitByCode,
  updateUnit,
  deleteUnit,
  filterUnits,
};
