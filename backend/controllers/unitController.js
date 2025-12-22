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
      staffId,
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

// Get unit by code
const getUnitByCode = async (req, res, next) => {
  try {
    const { unitCode } = req.params;

    const unit = await Unit.findOne({
      where: { unitCode },
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
        message: "Unit not found",
      });
    }

    res.status(200).json({
      success: true,
      data: unit,
    });
  } catch (error) {
    next(error);
  }
};

// Update unit
const updateUnit = async (req, res, next) => {
  try {
    const { unitCode } = req.params;
    const { staffId } = req.body;

    const unit = await Unit.findOne({ where: { unitCode } });
    if (!unit) {
      return res.status(404).json({
        success: false,
        message: "Unit not found",
      });
    }

    // If staffId is being updated, verify staff exists
    if (staffId) {
      const staff = await User.findOne({
        where: { userId: staffId, role: "staff" },
      });
      if (!staff) {
        return res.status(404).json({
          success: false,
          message: "Staff member not found",
        });
      }
      unit.staffId = staffId;
    }

    await unit.save();

    res.status(200).json({
      success: true,
      message: "Unit updated successfully",
      data: unit,
    });
  } catch (error) {
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
};
