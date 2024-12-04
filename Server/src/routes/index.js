const express = require("express");
const userRoutes = require("./userRoutes");
const resumeRoutes = require("./resumeRoutes");

const router = express.Router();

// Mount individual route files
router.use("/users", userRoutes); // Routes for user-related operations
router.use("/resumes", resumeRoutes); // Routes for resume-related operations

module.exports = router;
