const express = require("express");
const router = express.Router();
const unitController = require("../controllers/unitController");
const verifyRoles = require("../middlewares/verifyRoles");

// All routes require authentication (handled by verifyJwt middleware in index.js)
// Only staff can manage units
router.post("/", verifyRoles("staff"), unitController.createUnit);
router.get("/", unitController.getAllUnits);
router.get("/:unitCode", unitController.getUnitByCode);
router.put("/:unitCode", verifyRoles("staff"), unitController.updateUnit);
router.delete("/:unitCode", verifyRoles("staff"), unitController.deleteUnit);

module.exports = router;

