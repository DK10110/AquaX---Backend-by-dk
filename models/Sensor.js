const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema({
  type: String,
  device: { type: mongoose.Schema.Types.ObjectId, ref: "Device" }
}, { timestamps: true });

module.exports = mongoose.model("Sensor", sensorSchema);