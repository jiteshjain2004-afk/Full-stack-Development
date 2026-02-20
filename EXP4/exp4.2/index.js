import express from "express";
import { connectDB } from "./config/db.js";
import cardRoutes from "./routes/cards.routes.js";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.set("json spaces", 2);


// Connect DB
connectDB();

// Home route
app.get("/", (req, res) => {
  res.send("🎴 Playing Card REST API is Running!");
});

// Routes
app.use("/api/cards", cardRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

