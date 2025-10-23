const redis = require("redis");

// Initialize Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

// Connect to Redis
redisClient.connect().catch(console.error);

// Cache middleware for vitals data
const cacheVitals = async (req, res, next) => {
  try {
    const cachedData = await redisClient.get("vitals:all");
    if (cachedData) {
      console.log("Serving from cache");
      return res.json(JSON.parse(cachedData));
    }
    next();
  } catch (error) {
    console.error("Cache error:", error);
    next();
  }
};

// Cache vitals data
const setVitalsCache = async (vitalsData) => {
  try {
    await redisClient.setEx("vitals:all", 300, JSON.stringify(vitalsData)); // Cache for 5 minutes
    console.log("Vitals data cached");
  } catch (error) {
    console.error("Cache set error:", error);
  }
};

// Clear cache when new data is added
const clearVitalsCache = async () => {
  try {
    await redisClient.del("vitals:all");
    console.log("Vitals cache cleared");
  } catch (error) {
    console.error("Cache clear error:", error);
  }
};

module.exports = {
  redisClient,
  cacheVitals,
  setVitalsCache,
  clearVitalsCache,
};
