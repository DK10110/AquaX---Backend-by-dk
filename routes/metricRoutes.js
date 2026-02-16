// With Real-Time WebSocket Alerts
const express = require("express");
const Metric = require("../models/Metric");
const Alert = require("../models/Alert");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, async (req, res) => {
  const { temperature, ph, turbidity, sensor } = req.body;

  if (!temperature || !ph || !turbidity)
    return res.status(400).json({ message: "Invalid data" });

  const metric = await Metric.create({
    temperature,
    ph,
    turbidity,
    sensor,
    user: req.user.id
  });

  let alertMessage = null;

  if (temperature > 30) alertMessage = "High temperature!";
  if (ph < 6.5 || ph > 8.5) alertMessage = "Abnormal pH!";
  if (turbidity > 0.1) alertMessage = "High turbidity!";

  if (alertMessage) {
    const alert = await Alert.create({
      message: alertMessage,
      type: "warning",
      user: req.user.id
    });

    const io = req.app.get("io");
    io.emit("newAlert", alert); // Real-time alert
  }

  res.status(201).json(metric);
});

module.exports = router;