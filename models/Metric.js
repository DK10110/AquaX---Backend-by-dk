const mongoose = require("mongoose");

const metricSchema = new mongoose.Schema({
  temperature: Number,
  ph: Number,
  turbidity: Number,
  sensor: { type: mongoose.Schema.Types.ObjectId, ref: "Sensor" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Metric", metricSchema);