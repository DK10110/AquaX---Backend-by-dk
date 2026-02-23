const mongoose = require("mongoose");

/**
 * Alert Schema
 * Defines the structure of Alert documents in MongoDB
 */
const alertSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true, // Alert must have a message
      trim: true,
    },
    type: {
      type: String,
      enum: ["info", "warning", "critical"], // Allowed alert types
      default: "info",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User who receives this alert
      required: true,
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

// Optional: log when schema is loaded
console.log("Alert schema created");

module.exports = mongoose.model("Alert", alertSchema);