// POST /api/devices → Add a new device
// GET /api/devices	→ List all your devices
// GET /api/devices/:id  →	Get details of a specific device
// PUT /api/devices/:id	→ Update a device
// DELETE /api/devices/:id	→ Delete a device

const express = require("express");
const Device = require("../models/Device");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, async (req, res) => {
  const device = await Device.create({
    name: req.body.name,
    user: req.user.id
  });
  res.status(201).json(device);
});

router.get("/", protect, async (req, res) => {
  const devices = await Device.find({ user: req.user.id });
  res.json(devices);
});

router.get("/:id", protect, async (req, res) => {
  const device = await Device.findById(req.params.id);
  res.json(device);
});

router.put("/:id", protect, async (req, res) => {
  const device = await Device.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  res.json(device);
});

router.delete("/:id", protect, async (req, res) => {
  await Device.findByIdAndDelete(req.params.id);
  res.json({ message: "Device deleted" });
});

module.exports = router;