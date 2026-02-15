const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/Student.js");

const router = express.Router();

// LOGIN (Admin + Student using role)
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "SECRET_KEY",
      { expiresIn: "1h" }
    );

    res.json({
      token,
      role: user.role,
      userId: user._id
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
