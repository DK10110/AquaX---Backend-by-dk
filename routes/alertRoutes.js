const express = require("express");
const Alert = require("../models/Alert");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  const alerts = await Alert.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(alerts);
});

router.delete("/:id", protect, async (req, res) => {
  await Alert.findByIdAndDelete(req.params.id);
  res.json({ message: "Alert deleted" });
});

router.get("/critical", protect, async (req, res) => {
  const criticalAlerts = await Alert.find({ user: req.user.id, type: "critical" });
  res.json(criticalAlerts);
});

module.exports = router;