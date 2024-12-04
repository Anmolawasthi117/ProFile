const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  clerkId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  resumes: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      data: { type: String }, // Store resume content
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
