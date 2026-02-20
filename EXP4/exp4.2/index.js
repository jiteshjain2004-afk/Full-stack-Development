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
app.get("/", (req, res) => {
  res.send(
    "Playing Cards REST API is Running!\n\n" +
    "Endpoints:\n" +
    "GET    /api/cards\n" +
    "GET    /api/cards?category=royal\n" +
    "POST   /api/cards\n"
  );
});

// Routes
app.use("/api/cards", cardRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

