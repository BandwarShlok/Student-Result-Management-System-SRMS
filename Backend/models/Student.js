const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true
  },

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  phone: {
    type: String,
    required: true
  },

  course: {
    type: String,
    required: true
  },

  department: {
    type: String,
    required: true
  },

  semester: {
    type: Number,
    required: true
  },

  password: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Student", StudentSchema);
