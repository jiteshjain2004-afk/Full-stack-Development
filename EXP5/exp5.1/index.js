require("dotenv").config(); // only needed locally, harmless on Render

const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/Product");

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());

// MongoDB connection (ENV VARIABLE)
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Product CRUD API</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
          }
          h1 {
            color: #2c3e50;
          }
          ul {
            line-height: 1.8;
          }
          a {
            color: #3498db;
            text-decoration: none;
            font-size: 18px;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <h1>Product CRUD API is running 🚀</h1>
        <p>Available endpoints:</p>
        <ul>
          <li><a href="/products" target="_blank">/products</a> – View all products</li>
          <li>POST /products – Create a product</li>
          <li>PUT /products/:id – Update a product</li>
          <li>DELETE /products/:id – Delete a product</li>
        </ul>
      </body>
    </html>
  `);
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
  console.log(`Server running on port ${PORT}`);
});