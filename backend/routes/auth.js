const express = require('express');
const router = express.Router();

// Simple auth for demo - in production use proper JWT/OAuth
const DEMO_USERS = {
  admin: { password: 'admin123', role: 'admin', name: 'Admin User' },
  doctor: { password: 'doctor123', role: 'doctor', name: 'Dr. Smith' },
  staff: { password: 'staff123', role: 'staff', name: 'Staff Member' }
};

// Login
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }
    
    const user = DEMO_USERS[username];
    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // In production, generate proper JWT token
    const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
    
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        username,
        name: user.name,
        role: user.role
      },
      token
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Verify token (middleware)
router.get('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    // Simple token validation for demo
    try {
      const decoded = Buffer.from(token, 'base64').toString();
      const [username] = decoded.split(':');
      const user = DEMO_USERS[username];
      
      if (!user) {
        throw new Error('Invalid token');
      }
      
      res.json({
        success: true,
        user: {
          username,
          name: user.name,
          role: user.role
        }
      });
      
    } catch (tokenError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;