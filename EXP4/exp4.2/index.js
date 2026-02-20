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

// Simple homepage (EXP 4.2)
// Home route (EXP 4.2)
app.get("/", (req, res) => {
  res.send(`
    <h1>🎴 Playing Cards REST API is Running!</h1>

    <h3>Available Endpoints:</h3>
    <ul>
      <li><a href="/api/cards">GET /api/cards</a></li>
      <li><a href="/api/cards?category=royal">
        GET /api/cards?category=royal
      </a></li>
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

