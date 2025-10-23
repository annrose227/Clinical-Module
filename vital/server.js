require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { createClient } = require("redis");

const vitalsRoutes = require("./routes/vitals");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/vitals", vitalsRoutes);

// Mongo connect (keep awaited)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Optional Redis: connect only if REDIS_URL is present, and do not let failures block startup
let redisClient;
if (process.env.REDIS_URL) {
  redisClient = createClient({ url: process.env.REDIS_URL });
  redisClient.on("error", (err) => {
    console.warn("Redis client error:", err && err.message ? err.message : err);
  });
  // attempt connect but don't await — log failure and continue
  (async () => {
    try {
      await redisClient.connect();
      console.log("Connected to Redis");
    } catch (err) {
      console.warn(
        "Redis not available, continuing without cache/queue:",
        err && err.message ? err.message : err
      );
    }
  })();
}

// Start server only when run directly
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = { app, redisClient };
