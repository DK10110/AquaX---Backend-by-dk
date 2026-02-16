const express = require("express");
const Sensor = require("../models/Sensor"); // make sure you have a Sensor model
const { protect } = require("../middleware/authMiddleware");

const router = express.Router(); // <-- THIS IS REQUIRED

// Add a new sensor
router.post("/", protect, async (req, res) => {
  const sensor = await Sensor.create({
    name: req.body.name,
    user: req.user.id
  });
  res.status(201).json(sensor);
});

// Get all sensors for user
router.get("/", protect, async (req, res) => {
  const sensors = await Sensor.find({ user: req.user.id });
  res.json(sensors);
});

// Delete a sensor
router.delete("/:id", protect, async (req, res) => {
  await Sensor.findByIdAndDelete(req.params.id);
  res.json({ message: "Sensor deleted" });
});

module.exports = router;