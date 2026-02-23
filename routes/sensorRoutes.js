const express = require("express");
const Sensor = require("../models/Sensor"); // Make sure Sensor model exists
const { protect } = require("../middleware/authMiddleware");

const router = express.Router(); // Router instance

/**
 * @route   POST /sensors
 * @desc    Add a new sensor for the logged-in user
 * @access  Protected
 */
router.post("/", protect, async (req, res) => {
  try {
    if (!req.body.name) {
      console.log(`Sensor creation failed: No name provided by user ${req.user.id}`);
      return res.status(400).json({ message: "Sensor name is required" });
    }

    const sensor = await Sensor.create({
      name: req.body.name,
      user: req.user.id,
    });

    console.log(`Sensor created for user ${req.user.id}: ${sensor.name}`);
    res.status(201).json(sensor);
  } catch (error) {
    console.error("Error creating sensor:", error.message);
    res.status(500).json({ message: "Server error creating sensor" });
  }
});

/**
 * @route   GET /sensors
 * @desc    Get all sensors for the logged-in user
 * @access  Protected
 */
router.get("/", protect, async (req, res) => {
  try {
    const sensors = await Sensor.find({ user: req.user.id });
    console.log(`Fetched ${sensors.length} sensors for user ${req.user.id}`);
    res.json(sensors);
  } catch (error) {
    console.error("Error fetching sensors:", error.message);
    res.status(500).json({ message: "Server error fetching sensors" });
  }
});

/**
 * @route   DELETE /sensors/:id
 * @desc    Delete a sensor by ID
 * @access  Protected
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    await Sensor.findByIdAndDelete(req.params.id);
    console.log(`Sensor ${req.params.id} deleted by user ${req.user.id}`);
    res.json({ message: "Sensor deleted" });
  } catch (error) {
    console.error("Error deleting sensor:", error.message);
    res.status(500).json({ message: "Server error deleting sensor" });
  }
});

module.exports = router;