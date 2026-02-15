const express = require("express");
const bcrypt = require("bcryptjs");

const Student = require("../models/Student");
const Admin = require("../models/Admin");

const router = express.Router();

/* ======================================================
   STUDENT REGISTER
   ====================================================== */
router.post("/student-register", async (req, res) => {
  try {
    const {
      studentId,
      name,
      email,
      phone,
      course,
      department,
      semester,
      password
    } = req.body;

    // Basic validation
    if (
      !studentId ||
      !name ||
      !email ||
      !phone ||
      !course ||
      !department ||
      !semester ||
      !password
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check existing student (by ID or email)
    const existing = await Student.findOne({
      $or: [{ studentId }, { email }]
    });

    if (existing) {
      return res.status(400).json({ message: "Student already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create student
    const student = await Student.create({
      studentId,
      name,
      email,
      phone,
      course,
      department,
      semester,
      password: hashedPassword
    });

    res.json({
      message: "Registration successful",
      studentId: student.studentId
    });
  } catch (err) {
    console.error("STUDENT REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   STUDENT LOGIN
   ====================================================== */
router.post("/student-login", async (req, res) => {
  try {
    const { studentId, password } = req.body;

    if (!studentId || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(400).json({ message: "Student not found" });
    }

    const match = await bcrypt.compare(password, student.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      role: "student",
      studentId: student.studentId,
      name: student.name
    });
  } catch (err) {
    console.error("STUDENT LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   ADMIN REGISTER (CONTROLLED)
   ====================================================== */
router.post("/admin-register", async (req, res) => {
  try {
    const { email, password, secretKey } = req.body;

    if (!email || !password || !secretKey) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Simple protection
    if (secretKey !== "SRMS_ADMIN_2026") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      email,
      password: hashedPassword
    });

    res.json({ message: "Admin registered successfully" });
  } catch (err) {
    console.error("ADMIN REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   ADMIN LOGIN
   ====================================================== */
router.post("/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      role: "admin"
    });
  } catch (err) {
    console.error("ADMIN LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
