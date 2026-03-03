const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  rollNo: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  }
});

module.exports = mongoose.model("Student", studentSchema);