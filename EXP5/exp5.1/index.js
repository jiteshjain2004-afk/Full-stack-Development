const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/Product");

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());

// MongoDB Atlas connection
mongoose
  .connect(
    "mongodb+srv://dbuser:dbpass123@cluster0.sn8whdg.mongodb.net/productDB?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("MongoDB Atlas connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("Product CRUD API is running");
});

// ================= CREATE =================
// POST /products
app.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ================= READ =================
// GET /products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= UPDATE =================
// PUT /products/:id
app.put("/products/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ================= DELETE =================
// DELETE /products/:id
app.delete("/products/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= SERVER =================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});