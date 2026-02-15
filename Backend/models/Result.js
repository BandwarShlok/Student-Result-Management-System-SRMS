const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subjectCode: { type: String, required: true },
  subjectName: { type: String, required: true },
  marks: { type: Number, required: true },
  grade: String
});

const resultSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  semester: { type: Number, required: true },
  status: { type: String, default: "PASS" },
  subjects: [subjectSchema],
  totalMarks: Number,
  percentage: Number
}, { timestamps: true });

module.exports = mongoose.model("Result", resultSchema);
