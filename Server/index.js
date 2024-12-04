require("dotenv").config();
const express = require("express");
const connectDB = require("./src/db/connection");
const routes = require("./src/routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Use routes
app.use("/api", routes);

// Server Listener
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
