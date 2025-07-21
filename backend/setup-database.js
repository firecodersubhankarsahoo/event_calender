const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration
const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "event_calendar",
  password: "sahoo@9832",
  port: 5432,
});

async function setupDatabase() {
  try {
    console.log('Connecting to PostgreSQL database...');
    await client.connect();
    console.log('Connected successfully!');

    console.log('Creating database tables...');

    // Create events table
    const createEventsTable = `
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
    `;

    await client.query(createEventsTable);
    console.log('✓ Events table created');

    // Create recurrence patterns table
    const createRecurrenceTable = `
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
    `;

    await client.query(createRecurrenceTable);
    console.log('✓ Recurrence patterns table created');

    // Create indexes
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);',
      'CREATE INDEX IF NOT EXISTS idx_events_end_date ON events(end_date);',
      'CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);',
      'CREATE INDEX IF NOT EXISTS idx_events_parent_id ON events(parent_event_id);',
      'CREATE INDEX IF NOT EXISTS idx_recurrence_event_id ON recurrence_patterns(event_id);'
    ];

    for (const indexQuery of indexes) {
      await client.query(indexQuery);
    }
    console.log('✓ Indexes created');

    // Insert sample data
    const sampleData = `
      INSERT INTO events (title, description, start_date, end_date, color, category) VALUES
      ('Team Meeting', 'Weekly team standup meeting', '2024-01-15 10:00:00', '2024-01-15 11:00:00', '#3B82F6', 'Work'),
      ('Doctor Appointment', 'Annual checkup', '2024-01-16 14:30:00', '2024-01-16 15:30:00', '#EF4444', 'Health'),
      ('Birthday Party', 'John''s birthday celebration', '2024-01-20 18:00:00', '2024-01-20 22:00:00', '#10B981', 'Personal')
      ON CONFLICT DO NOTHING;
    `;

    await client.query(sampleData);
    console.log('✓ Sample data inserted');

    console.log('\n🎉 Database setup completed successfully!');
    console.log('Tables created:');
    console.log('- events');
    console.log('- recurrence_patterns');
    console.log('\nSample data inserted.');

  } catch (error) {
    console.error('Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
}

// Run the setup
setupDatabase();
