const express = require("express");
const authMiddleware = require("./middleware/auth");
const labRoutes = require("./routes/lab");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(authMiddleware);

// Routes
app.use("/api/lab", labRoutes);

// Error handling
app.use(errorHandler);

// Database connection check (connection pooling handled in db/index.js)
if (process.env.NODE_ENV !== "test") {
  const db = require("./db");
  db.query("SELECT 1")
    .then(() => console.log("Connected to PostgreSQL database"))
    .catch((err) => {
      console.error("Database connection error:", err);
      process.exit(1);
    });
}

app.listen(port, () => {
  console.log(`LIS server listening at http://localhost:${port}`);
});

module.exports = app;
