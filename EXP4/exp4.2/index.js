import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cardRoutes from "./routes/cards.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// MUST be before routes
app.use(express.json());
app.set("json spaces", 2);

// DB connection
connectDB();

// Home route
app.get("/", (req, res) => {
  res.send(`
    <h1>🎴 Playing Cards REST API</h1>
    <ul>
      <li><a href="/api/cards">GET /api/cards</a></li>
      <li><a href="/api/cards?category=royal">GET /api/cards?category=royal</a></li>
      <li>POST /api/cards</li>
    </ul>
  `);
});

// Routes
app.use("/api/cards", cardRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});