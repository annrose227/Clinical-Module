const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
const consultationRoutes = require("./routes/consultationRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const investigationRoutes = require("./routes/investigationRoutes");
const patientHistoryRoutes = require("./routes/patientHistoryRoutes");

app.use("/api/consultations", consultationRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/investigations", investigationRoutes);
app.use("/api/patients", patientHistoryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server only if not in test environment
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
