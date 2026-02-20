const express = require("express");
const redis = require("redis");

const app = express();
app.use(express.json());

const PORT = 3000;

const client = redis.createClient({
  url: "redis://127.0.0.1:6379"
});

client.on("error", (err) => {
  console.log("Redis error:", err.message);
});

// Server start
app.listen(PORT, () => {
  console.log("Server running on port 3000");
});

// Redis connect
(async () => {
  try {
    await client.connect();
    console.log("Redis connected");

    const seats = await client.get("seats");
    if (!seats) {
      await client.set("seats", 100);
    }
  } catch {
    console.log("Redis failed, server still running");
  }
})();

// GET seats
app.get("/seats", async (req, res) => {
  const seats = await client.get("seats");
  res.json({ availableSeats: seats });
});

// POST book
app.post("/book", async (req, res) => {
  const lock = await client.set("seat_lock", "1", { NX: true, PX: 5000 });

  if (!lock) {
    return res.status(429).json({ message: "System busy, try again" });
  }

  try {
    let seats = parseInt(await client.get("seats"));
    if (seats > 0) {
      seats--;
      await client.set("seats", seats);
      res.json({ message: "Seat booked", remaining: seats });
    } else {
      res.status(400).json({ message: "No seats available" });
    }
  } finally {
    await client.del("seat_lock");
  }
});
// Browser-friendly booking (GET)
app.get("/book-seat", async (req, res) => {
  const lock = await client.set("seat_lock", "1", { NX: true, PX: 5000 });

  if (!lock) {
    return res.send("System busy, try again");
  }

  try {
    let seats = parseInt(await client.get("seats"));
    if (seats > 0) {
      seats--;
      await client.set("seats", seats);
      res.send(`Seat booked successfully. Remaining seats: ${seats}`);
    } else {
      res.send("No seats available");
    }
  } finally {
    await client.del("seat_lock");
  }
});
