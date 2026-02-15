const express = require("express");
const Result = require("../models/Result");

const router = express.Router();

/* ===============================
   ADD OR UPDATE RESULT
================================ */
router.post("/add-or-update", async (req, res) => {
  try {
    const { studentId, semester, subjects } = req.body;

    if (!studentId || !semester || !Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ message: "Invalid result data" });
    }

    // Calculate total & percentage
    let totalMarks = 0;
    let isFail = false;

    subjects.forEach(sub => {
      totalMarks += sub.marks;
      if (sub.marks < 33) isFail = true;
    });

    const percentage = (totalMarks / (subjects.length * 100)) * 100;
    const status = isFail ? "FAIL" : "PASS";

    const result = await Result.findOneAndUpdate(
      { studentId, semester },
      {
        studentId,
        semester,
        subjects,
        totalMarks,
        percentage,
        status
      },
      { upsert: true, new: true }
    );

    res.json({
      message: "Result saved successfully",
      result
    });

  } catch (err) {
    console.error("RESULT SAVE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   GET ALL RESULTS
================================ */
router.get("/", async (req, res) => {
  try {
    const results = await Result.find().sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   DELETE RESULT
================================ */
router.delete("/:id", async (req, res) => {
  try {
    await Result.findByIdAndDelete(req.params.id);
    res.json({ message: "Result deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
