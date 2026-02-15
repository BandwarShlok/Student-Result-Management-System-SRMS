// routes/studentRoutes.js
const express = require("express");
const Student = require("../models/Student");

const router = express.Router();

/* ============================
   ADD STUDENT (FIXED)
============================ */
router.post("/add", async (req, res) => {
  try {
    const { studentId, name, email, course, department, semester } = req.body;

    if (!studentId || !name || !email || !course || !department || !semester) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const student = await Student.create({
      studentId,
      name,
      email,
      course,
      department,
      semester
    });

    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Student already exists or invalid data" });
  }
});

/* ============================
   GET ALL STUDENTS
============================ */
router.get("/", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

/* ============================
   GET STUDENT BY ID
============================ */
router.get("/by-id/:studentId", async (req, res) => {
  const student = await Student.findOne({ studentId: req.params.studentId });
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }
  res.json(student);
});

module.exports = router;
