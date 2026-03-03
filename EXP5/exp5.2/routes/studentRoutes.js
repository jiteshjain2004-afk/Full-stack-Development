const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

/* ----------- Routes ----------- */

// Show all students
router.get("/students", studentController.getAllStudents);

// Show form to add new student
router.get("/students/new", studentController.showNewForm);

// Add new student
router.post("/students", studentController.createStudent);

// Show edit form
router.get("/students/:id/edit", studentController.showEditForm);

// Update student
router.put("/students/:id", studentController.updateStudent);

// Delete student
router.delete("/students/:id", studentController.deleteStudent);

module.exports = router;