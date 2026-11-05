
const express = require("express");
const router = express.Router();

const {
  submitProject,
  getApprovedProjects,
  getAllProjects,
  updateProjectStatus,
} = require("../controllers/projectController");

const protectAdmin = require("../middleware/authMiddleware");

router.post("/submit", submitProject);
router.get("/approved", getApprovedProjects);
router.get("/all", protectAdmin, getAllProjects);
router.patch("/:id/status", protectAdmin, updateProjectStatus);

module.exports = router;
