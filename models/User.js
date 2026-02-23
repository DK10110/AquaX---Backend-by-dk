const mongoose = require("mongoose");

/**
 * User Schema
 * Defines the structure of User documents in MongoDB
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Ensure name is mandatory
      trim: true, // Remove extra spaces
    },
    email: {
      type: String,
      required: true,
      unique: true, // Email must be unique
      lowercase: true, // Store emails in lowercase
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"], // Only allow specific roles
      default: "user",
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

// Optional: Log when schema is compiled
console.log("User schema created");

module.exports = mongoose.model("User", userSchema);