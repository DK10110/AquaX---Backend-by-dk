const express = require("express");
const Alert = require("../models/Alert");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route   GET /alerts
 * @desc    Get all alerts for the logged-in user
 * @access  Protected
 */
router.get("/", protect, async (req, res) => {
  try {
    const alerts = await Alert.find({ user: req.user.id }).sort({ createdAt: -1 });
    console.log(`Fetched ${alerts.length} alerts for user ${req.user.id}`);
    res.json(alerts);
  } catch (error) {
    console.error("Error fetching alerts:", error.message);
    res.status(500).json({ message: "Server error fetching alerts" });
  }
});

/**
 * @route   DELETE /alerts/:id
 * @desc    Delete a specific alert by ID
 * @access  Protected
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    await Alert.findByIdAndDelete(req.params.id);
    console.log(`Alert ${req.params.id} deleted by user ${req.user.id}`);
    res.json({ message: "Alert deleted" });
  } catch (error) {
    console.error("Error deleting alert:", error.message);
    res.status(500).json({ message: "Server error deleting alert" });
  }
});

/**
 * @route   GET /alerts/critical
 * @desc    Get all critical alerts for the logged-in user
 * @access  Protected
 */
router.get("/critical", protect, async (req, res) => {
  try {
    const criticalAlerts = await Alert.find({ user: req.user.id, type: "critical" });
    console.log(`Fetched ${criticalAlerts.length} critical alerts for user ${req.user.id}`);
    res.json(criticalAlerts);
  } catch (error) {
    console.error("Error fetching critical alerts:", error.message);
    res.status(500).json({ message: "Server error fetching critical alerts" });
  }
});

module.exports = router;