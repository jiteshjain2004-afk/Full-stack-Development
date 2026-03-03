const mongoose = require("mongoose");

/* Variant Schema */
const variantSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  }
});

/* Review Schema */
const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String
  }
});

/* Product Schema */
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
  },
  variants: [variantSchema],
  reviews: [reviewSchema],
  avgRating: {
    type: Number,
    default: 0
  }
});
// Indexes for performance
productSchema.index({ category: 1 });
productSchema.index({ "variants.sku": 1 });
/* Export Model */
module.exports = mongoose.model("Product", productSchema);