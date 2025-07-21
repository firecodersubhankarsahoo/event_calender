-- Create database (run this first)
-- CREATE DATABASE event_calendar;

-- Connect to the database and run the following:

-- Events table
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

-- Recurrence patterns table
CREATE TABLE IF NOT EXISTS recurrence_patterns (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    recurrence_type VARCHAR(20) NOT NULL CHECK (recurrence_type IN ('daily', 'weekly', 'monthly', 'custom')),
    interval_value INTEGER DEFAULT 1,
    days_of_week INTEGER[], -- Array of days (0=Sunday, 1=Monday, etc.)
    day_of_month INTEGER,
    end_date TIMESTAMP,
    max_occurrences INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_end_date ON events(end_date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_parent_id ON events(parent_event_id);
CREATE INDEX IF NOT EXISTS idx_recurrence_event_id ON recurrence_patterns(event_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON events 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Sample data (optional)
INSERT INTO events (title, description, start_date, end_date, color, category) VALUES
('Team Meeting', 'Weekly team standup meeting', '2024-01-15 10:00:00', '2024-01-15 11:00:00', '#3B82F6', 'Work'),
('Doctor Appointment', 'Annual checkup', '2024-01-16 14:30:00', '2024-01-16 15:30:00', '#EF4444', 'Health'),
('Birthday Party', 'John''s birthday celebration', '2024-01-20 18:00:00', '2024-01-20 22:00:00', '#10B981', 'Personal');
