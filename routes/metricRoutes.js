// Metrics Routes with Real-Time WebSocket Alerts
const express = require("express");
const Metric = require("../models/Metric");
const Alert = require("../models/Alert");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route   POST /metrics
 * @desc    Add a new metric and trigger real-time alerts if thresholds exceeded
 * @access  Protected
 */
router.post("/", protect, async (req, res) => {
  try {
    const { temperature, ph, turbidity, sensor } = req.body;

    // Validate input
    if (temperature == null || ph == null || turbidity == null) {
      console.log("Invalid metric data received from user", req.user.id);
      return res.status(400).json({ message: "Invalid data" });
    }

    // Create new metric
    const metric = await Metric.create({
      temperature,
      ph,
      turbidity,
      sensor,
      user: req.user.id,
    });

    console.log(`Metric created for user ${req.user.id}:`, metric);

    // Determine alert
    let alertMessage = null;
    if (temperature > 30) alertMessage = "High temperature!";
    else if (ph < 6.5 || ph > 8.5) alertMessage = "Abnormal pH!";
    else if (turbidity > 0.1) alertMessage = "High turbidity!";

    // Create alert if necessary
    if (alertMessage) {
      const alert = await Alert.create({
        message: alertMessage,
        type: "warning",
        user: req.user.id,
      });

      console.log(`Alert created for user ${req.user.id}:`, alert.message);

      // Emit real-time alert to WebSocket clients
      const io = req.app.get("io");
      io.emit("newAlert", alert);
    }

    res.status(201).json(metric);
  } catch (error) {
    console.error("Error creating metric:", error.message);
    res.status(500).json({ message: "Server error creating metric" });
  }
});

module.exports = router;