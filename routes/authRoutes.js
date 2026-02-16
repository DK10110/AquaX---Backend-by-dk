const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  res.status(201).json({
    token: generateToken(user._id, user.role),
    user
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  res.json({
    token: generateToken(user._id, user.role),
    user
  });
});

// POST /api/auth/register → for registering a new user

// POST /api/auth/login → for logging in

// GET /api/auth/profile → get your own user info(view profile)

// PUT /api/auth/profile → update your profile info

const { protect } = require("../middleware/authMiddleware");

router.get("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

router.put("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.name = req.body.name || user.name;
  await user.save();
  res.json(user);
});

module.exports = router;