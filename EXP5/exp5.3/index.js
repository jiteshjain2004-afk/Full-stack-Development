require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/Product");

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

mongoose.connection.once("open", () => {
  console.log("✅ MongoDB Connected");
});

/* ROUTES */

// Get all products
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Get average rating using aggregation
app.get("/avg-rating", async (req, res) => {
  const result = await Product.aggregate([
    { $unwind: "$reviews" },
    {
      $group: {
        _id: "$name",
        avgRating: { $avg: "$reviews.rating" }
      }
    }
  ]);
  res.json(result);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});