const { Unit, User } = require("../models");
const { Op } = require("sequelize");
const AppError = require("../utils/AppError");
const {
  appLogger,
  auditLogger,
  errorLogger,
  addRequestMetadata,
} = require("../utils/logger");

// ===== CREATE UNIT =====
const createUnit = async (req, res, next) => {
  try {
    const { unitCode, staffId, unitName } = req.body;

    const existingUnit = await Unit.findOne({ where: { unitCode } });
    if (existingUnit)
      return next(new AppError("Unit code already exists", 409));

    const staff = await User.findOne({
      where: { userId: staffId, role: "staff" },
    });
    if (!staff) return next(new AppError("Staff member not found", 404));

    const unit = await Unit.create({ unitCode, unitName, staffId });

    auditLogger.info("Created new unit", addRequestMetadata({ req, unitCode }));
    res
      .status(201)
      .json({
        success: true,
        message: "Unit created successfully",
        data: unit,
      });
  } catch (error) {
    errorLogger.error(
      "Error creating unit",
      addRequestMetadata({ req, error })
    );
    next(error);
  }
};

// ===== GET ALL UNITS =====
const getAllUnits = async (req, res, next) => {
  try {
    const units = await Unit.findAll({
      include: {
        model: User,
        as: "Staff",
        attributes: ["userId", "firstname", "lastname", "email"],
      },
      order: [["unitCode", "ASC"]],
    });

    appLogger.info("Fetched all units", addRequestMetadata({ req }));
    res.status(200).json({ success: true, data: units });
  } catch (error) {
    errorLogger.error(
      "Error fetching all units",
      addRequestMetadata({ req, error })
    );
    next(error);
  }
};

// ===== FILTER UNITS =====
const filterUnits = async (req, res, next) => {
  try {
    const { unitCode, unitName, staffId } = req.query;
    let conditions = [];
    const isValid = (val) => val && val !== "undefined" && val.trim() !== "";

    if (isValid(unitCode))
      conditions.push({ unitCode: { [Op.like]: `%${unitCode}%` } });
    if (isValid(unitName))
      conditions.push({ unitName: { [Op.like]: `%${unitName}%` } });
    if (isValid(staffId)) conditions.push({ staffId });

    const whereClause = conditions.length > 0 ? { [Op.and]: conditions } : {};

    const units = await Unit.findAll({
      where: whereClause,
      include: {
        model: User,
        as: "Staff",
        attributes: ["userId", "firstname", "lastname", "email"],
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      order: [["unitCode", "ASC"]],
      limit: 50,
    });

    auditLogger.info(
      "Filtered units",
      addRequestMetadata({ req, filters: req.query })
    );
    res.status(200).json({ success: true, count: units.length, data: units });
  } catch (error) {
    errorLogger.error(
      "Error filtering units",
      addRequestMetadata({ req, error })
    );
    next(error);
  }
};

// ===== GET UNIT BY CODE =====
const getUnitByCode = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    if (!identifier || identifier === "undefined") {
      return next(new AppError("A valid unit code is required", 400));
    }

    const units = await Unit.findAll({
      where: { unitCode: identifier },
      include: {
        model: User,
        as: "Staff",
        attributes: ["userId", "firstname", "lastname", "email"],
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (!units.length)
      return next(new AppError(`No unit found for: ${identifier}`, 404));

    appLogger.info(
      "Fetched unit by code",
      addRequestMetadata({ req, identifier })
    );
    res.status(200).json({ success: true, data: units });
  } catch (error) {
    errorLogger.error(
      "Error fetching unit by code",
      addRequestMetadata({ req, error })
    );
    next(error);
  }
};

// ===== UPDATE UNIT =====
const updateUnit = async (req, res, next) => {
  try {
    const { unitCode } = req.params;
    const { newStaffId, newUnitCode, newUnitName } = req.body;

    const unit = await Unit.findOne({ where: { unitCode } });
    if (!unit) return next(new AppError("Unit not found", 404));

    if (newStaffId) {
      const staff = await User.findOne({
        where: { userId: newStaffId, role: "staff" },
      });
      if (!staff) return next(new AppError("Staff member not found", 404));
      unit.staffId = newStaffId;
    }

    if (newUnitCode) unit.unitCode = newUnitCode;
    if (newUnitName) unit.unitName = newUnitName;

    await unit.save();
    auditLogger.info("Updated unit", addRequestMetadata({ req, unitCode }));
    res
      .status(200)
      .json({
        success: true,
        message: "Unit updated successfully",
        data: unit,
      });
  } catch (error) {
    errorLogger.error(
      "Error updating unit",
      addRequestMetadata({ req, error })
    );
    next(error);
  }
};

// ===== DELETE UNIT =====
const deleteUnit = async (req, res, next) => {
  try {
    const { unitCode } = req.params;
    const unit = await Unit.findOne({ where: { unitCode } });
    if (!unit) return next(new AppError("Unit not found", 404));

    await unit.destroy();
    auditLogger.info("Deleted unit", addRequestMetadata({ req, unitCode }));
    res
      .status(200)
      .json({ success: true, message: "Unit deleted successfully" });
  } catch (error) {
    errorLogger.error(
      "Error deleting unit",
      addRequestMetadata({ req, error })
    );
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
