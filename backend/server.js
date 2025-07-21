const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true, // Allow all origins temporarily for testing
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle preflight requests
app.options('*', cors());

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'event_calendar',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to database:', err.stack);
  } else {
    console.log('Connected to PostgreSQL database');
    release();
  }
});

// Make pool available to other modules
app.locals.db = pool;

// Routes
const eventRoutes = require('./routes/events');
app.use('/api/events', eventRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Event Calendar API is running',
    timestamp: new Date().toISOString(),
    database: 'PostgreSQL'
  });
});

// Database setup endpoint (for initial deployment)
app.get('/api/setup-database', async (req, res) => {
  try {
    // Create events table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          start_date TIMESTAMP NOT NULL,
          end_date TIMESTAMP NOT NULL,
          color VARCHAR(7) DEFAULT '#3B82F6',
          category VARCHAR(50) DEFAULT 'Other',
          is_recurring BOOLEAN DEFAULT FALSE,
          parent_event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create recurrence patterns table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS recurrence_patterns (
          id SERIAL PRIMARY KEY,
          event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
          recurrence_type VARCHAR(20) NOT NULL CHECK (recurrence_type IN ('daily', 'weekly', 'monthly', 'custom')),
          interval_value INTEGER DEFAULT 1,
          days_of_week INTEGER[],
          day_of_month INTEGER,
          end_date TIMESTAMP,
          max_occurrences INTEGER,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);',
      'CREATE INDEX IF NOT EXISTS idx_events_end_date ON events(end_date);',
      'CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);',
      'CREATE INDEX IF NOT EXISTS idx_events_parent_id ON events(parent_event_id);',
      'CREATE INDEX IF NOT EXISTS idx_recurrence_event_id ON recurrence_patterns(event_id);'
    ];

    for (const indexQuery of indexes) {
      await pool.query(indexQuery);
    }

    // Insert sample data
    await pool.query(`
      INSERT INTO events (title, description, start_date, end_date, color, category) VALUES
      ('Welcome Event', 'Welcome to your Event Calendar!', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day' + INTERVAL '1 hour', '#3B82F6', 'Personal'),
      ('Sample Meeting', 'This is a sample meeting event', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days' + INTERVAL '2 hours', '#EF4444', 'Work'),
      ('Demo Event', 'Demo event for testing', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days' + INTERVAL '1 hour', '#10B981', 'Other')
      ON CONFLICT DO NOTHING;
    `);

    res.json({
      message: 'Database setup completed successfully!',
      tables: ['events', 'recurrence_patterns'],
      indexes: 5,
      sampleData: 3
    });
  } catch (error) {
    console.error('Database setup error:', error);
    res.status(500).json({ error: error.message });
  }
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
  console.log(`Server is running on port ${PORT}`);
});
