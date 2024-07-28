const mongoose = require("mongoose");
const generateRandomId = () => Math.floor(Math.random() * 900) + 100;

const ProductSchema = new mongoose.Schema({
  id: { type: Number, required: true, default: generateRandomId },
  title: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
});

module.exports = mongoose.model("Product", ProductSchema);
