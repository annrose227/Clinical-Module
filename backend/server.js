const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

// Import MongoDB connection
const database = require('./config/database');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/queue', require('./routes/queue'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/whatsapp', require('./routes/whatsapp'));
app.use('/api/telegram', require('./routes/telegram'));
app.use('/api/sms', require('./routes/sms'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Socket.io for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join-queue', (data) => {
    socket.join('queue-updates');
  });
  
  socket.on('join-admin', (data) => {
    socket.join('admin-updates');
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

const PORT = process.env.PORT || 5000;

// Initialize MongoDB connection and start server
async function startServer() {
  try {
    // Connect to MongoDB
    await database.connect();
    
    // Start the server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = { app, io };

// Initialize Telegram service
const telegramService = require('./services/telegramService');

// Seed demo data on startup (for hackathon demo)
if (process.env.NODE_ENV === 'development') {
  const { seedDatabase } = require('./utils/seedData');
  setTimeout(() => {
    seedDatabase();
  }, 2000); // Wait 2 seconds for server to start
}