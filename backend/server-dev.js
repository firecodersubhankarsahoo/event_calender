const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock database for development
const MockEvent = require('./models/MockEvent');
const mockDb = new MockEvent();

// Make mock database available to other modules
app.locals.db = mockDb;

// Routes
const eventRoutes = require('./routes/events');
app.use('/api/events', eventRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Event Calendar API is running (Development Mode with Mock Data)',
    database: 'Mock Database',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Using Mock Database for development`);
  console.log(`🌐 Frontend should be running on http://localhost:3000`);
  console.log(`🔗 API Health Check: http://localhost:${PORT}/api/health`);
});
