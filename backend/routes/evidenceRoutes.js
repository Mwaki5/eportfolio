const express = require("express");
const router = express.Router();
const evidenceController = require("../controllers/evidenceController");
const verifyRoles = require("../middlewares/verifyRoles");
const upload = require("../middlewares/multer");

// All routes require authentication
router.post(
  "/",
  verifyRoles("student"),
  upload.single("file"),
  evidenceController.createEvidence
);
router.get("/", evidenceController.getAllEvidence);
router.get("/student/:studentId", evidenceController.getEvidenceByStudent);
router.get("/unit/:unitCode", evidenceController.getEvidenceByUnit);
router.put("/:id", verifyRoles("staff"), upload.single("file"), evidenceController.updateEvidence);
router.delete("/:id", verifyRoles("staff"), evidenceController.deleteEvidence);

module.exports = router;

