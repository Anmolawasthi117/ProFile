const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const { Clerk } = require("@clerk/clerk-sdk-node");

const router = express.Router();

// Middleware for Clerk authentication
const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authorization.split(" ")[1];
  try {
    const { sub: userId } = await Clerk.verifyToken(token);
    req.userId = userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Save a new resume
router.post("/save", requireAuth, async (req, res) => {
  const { userId } = req;
  const { resumeData } = req.body;

  try {
    const resumeId = new mongoose.Types.ObjectId(); // Create a unique ID for the resume

    // Find the user and add the new resume
    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      {
        $push: {
          resumes: { _id: resumeId, data: resumeData },
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Resume saved", resumeId });
  } catch (error) {
    res.status(500).json({ message: "Error saving resume", error });
  }
});

// Fetch resumes for the authenticated user
router.get("/list", requireAuth, async (req, res) => {
  const { userId } = req;

  try {
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ resumes: user.resumes });
  } catch (error) {
    res.status(500).json({ message: "Error fetching resumes", error });
  }
});

module.exports = router;
