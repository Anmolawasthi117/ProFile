const express = require("express");
const { Clerk } = require("@clerk/clerk-sdk-node");
const User = require("../models/User");

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

// Save user or find existing user
router.post("/save", requireAuth, async (req, res) => {
  const { userId } = req;
  const { name, email } = req.body;

  try {
    let user = await User.findOne({ clerkId: userId });
    if (!user) {
      user = new User({ clerkId: userId, name, email, resumes: [] });
      await user.save();
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error saving user", error });
  }
});

module.exports = router;
