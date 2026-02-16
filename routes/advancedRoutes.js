const express = require("express");
const Metric = require("../models/Metric");
const Alert = require("../models/Alert");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router(); // <-- THIS IS REQUIRED

/* ANALYTICS GRAPH ENDPOINT */
router.get("/analytics", protect, async (req, res) => {
  try {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const weeklyData = await Metric.find({
      user: req.user.id,
      createdAt: { $gte: last7Days },
    });

    const monthlyData = await Metric.find({
      user: req.user.id,
      createdAt: { $gte: last30Days },
    });

    const average = (arr, key) =>
      arr.length
        ? arr.reduce((sum, item) => sum + item[key], 0) / arr.length
        : 0;

    res.json({
      weeklyCount: weeklyData.length,
      monthlyCount: monthlyData.length,
      weeklyAverage: {
        temperature: average(weeklyData, "temperature"),
        ph: average(weeklyData, "ph"),
        turbidity: average(weeklyData, "turbidity"),
      },
      monthlyAverage: {
        temperature: average(monthlyData, "temperature"),
        ph: average(monthlyData, "ph"),
        turbidity: average(monthlyData, "turbidity"),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Analytics error" });
  }
});

/* AI PREDICTION ENDPOINT */
router.post("/ai/predict", protect, async (req, res) => {
  try {
    const { temperature, ph, turbidity } = req.body;
    let score = 0;

    if (temperature > 30) score += 25;
    if (temperature > 35) score += 15;
    if (ph < 6.5 || ph > 8.5) score += 30;
    if (ph < 6 || ph > 9) score += 10;
    if (turbidity > 0.1) score += 20;
    if (turbidity > 0.3) score += 20;

    let riskLevel = "Safe";
    if (score >= 70) riskLevel = "High Risk";
    else if (score >= 40) riskLevel = "Moderate Risk";

    let recommendation = "Water quality is stable.";
    if (riskLevel === "Moderate Risk")
      recommendation = "Monitor closely and adjust filtration.";
    if (riskLevel === "High Risk")
      recommendation = "Immediate action required! Check filtration system.";

    res.json({
      inputs: { temperature, ph, turbidity },
      aiScore: score,
      riskLevel,
      recommendation,
    });
  } catch (error) {
    res.status(500).json({ message: "AI prediction error" });
  }
});

/* ADMIN DASHBOARD ENDPOINT */
router.get("/admin/dashboard", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Admin only access" });

    const totalUsers = await User.countDocuments();
    const totalMetrics = await Metric.countDocuments();
    const totalAlerts = await Alert.countDocuments();
    const criticalAlerts = await Alert.countDocuments({ type: "critical" });

    res.json({
      totalUsers,
      totalMetrics,
      totalAlerts,
      criticalAlerts,
      systemStatus:
        criticalAlerts > 10 ? "⚠ System Attention Needed" : "✅ Stable",
    });
  } catch (error) {
    res.status(500).json({ message: "Admin dashboard error" });
  }
});

module.exports = router; // <-- MUST be at the very end