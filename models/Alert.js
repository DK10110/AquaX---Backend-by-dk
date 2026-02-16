const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  message: String,
  type: { type: String, enum: ["info","warning","critical"] },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Alert", alertSchema);