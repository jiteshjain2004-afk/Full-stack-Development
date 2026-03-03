require("dotenv").config();
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const app = express();
connectDB();
/* ---------------- Middleware ---------------- */
app.use(express.urlencoded({ extended: true })); // form data
app.use(express.json()); // json data
app.use(methodOverride("_method")); 
app.use(express.static(path.join(__dirname, "public")));
app.use(studentRoutes);// PUT & DELETE support

/* ---------------- View Engine ---------------- */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* ---------------- Static Files ---------------- */
app.use(express.static(path.join(__dirname, "public")));

/* ---------------- Test Route ---------------- */
app.get("/", (req, res) => {
  res.send("Student Management System is running");
});

/* ---------------- Server ---------------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});