const mongoose = require("mongoose");

/**
 * Device Schema
 * Defines the structure of Device documents in MongoDB
 */
const deviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Device must have a name
      trim: true,     // Remove extra spaces
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",    // Reference to the User who owns this device
      required: true,
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

// Optional: log when schema is loaded
console.log("Device schema created");

module.exports = mongoose.model("Device", deviceSchema);