const Student = require("../models/Student");

/* ---------------- Show All Students ---------------- */
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.render("students/index", { students });
  } catch (error) {
    res.status(500).send("Error fetching students");
  }
};

/* ---------------- Show New Student Form ---------------- */
exports.showNewForm = (req, res) => {
  res.render("students/new");
};

/* ---------------- Add New Student ---------------- */
exports.createStudent = async (req, res) => {
  try {
    await Student.create(req.body);
    res.redirect("/students");
  } catch (error) {
    res.status(400).send("Error creating student");
  }
};

/* ---------------- Show Edit Form ---------------- */
exports.showEditForm = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    res.render("students/edit", { student });
  } catch (error) {
    res.status(404).send("Student not found");
  }
};

/* ---------------- Update Student ---------------- */
exports.updateStudent = async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/students");
  } catch (error) {
    res.status(400).send("Error updating student");
  }
};

/* ---------------- Delete Student ---------------- */
exports.deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.redirect("/students");
  } catch (error) {
    res.status(400).send("Error deleting student");
  }
};