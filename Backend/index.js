const express = require("express");
const app = express();
require("dotenv").config();
require("./Models/db"); // Initialize MongoDB connection
const bodyParser = require("body-parser");
const cors = require("cors");

// Import routers
const AuthRouter = require("./Routes/AuthRouter");
const products = require("./Routes/products");
const cartRoutes = require('./Routes/cartRoutes');
const AdminRouter = require('./Routes/AdminRouter');
const OrderRoutes = require('./Routes/OrderRoutes');



// Routes
app.get("/ping", (req, res) => {
  res.send("PONG");
});

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse application/json requests

// Authentication routes
app.use("/auth", AuthRouter);

// Products routes
app.use("/api/products", products);
app.use('/api/cart', cartRoutes);
app.use('/api/admin',  AdminRouter);
app.use('/api/orders', OrderRoutes); 
// Error handling middleware (must be placed after all routes/middleware)
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    success: false,
  });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
