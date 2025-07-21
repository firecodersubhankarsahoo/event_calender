class Event {
  constructor(db) {
    this.db = db;
  }

  // Get all events within a date range
  async getEventsByDateRange(startDate, endDate) {
    const query = `
      SELECT e.*, rp.recurrence_type, rp.interval_value, rp.days_of_week, 
             rp.day_of_month, rp.end_date as recurrence_end_date, rp.max_occurrences
      FROM events e
      LEFT JOIN recurrence_patterns rp ON e.id = rp.event_id
      WHERE (e.start_date >= $1 AND e.start_date <= $2)
         OR (e.end_date >= $1 AND e.end_date <= $2)
         OR (e.start_date <= $1 AND e.end_date >= $2)
      ORDER BY e.start_date ASC
    `;
    
    try {
      const result = await this.db.query(query, [startDate, endDate]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching events: ${error.message}`);
    }
  }

  // Get event by ID
  async getEventById(id) {
    const query = `
      SELECT e.*, rp.recurrence_type, rp.interval_value, rp.days_of_week, 
             rp.day_of_month, rp.end_date as recurrence_end_date, rp.max_occurrences
      FROM events e
      LEFT JOIN recurrence_patterns rp ON e.id = rp.event_id
      WHERE e.id = $1
    `;
    
    try {
      const result = await this.db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error fetching event: ${error.message}`);
    }
  }

  // Create new event
  async createEvent(eventData) {
    const {
      title,
      description,
      startDate,
      endDate,
      color,
      category,
      isRecurring,
      recurrencePattern
    } = eventData;

    const client = await this.db.connect();
    
    try {
      await client.query('BEGIN');

      // Insert event
      const eventQuery = `
        INSERT INTO events (title, description, start_date, end_date, color, category, is_recurring)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      
      const eventResult = await client.query(eventQuery, [
        title, description, startDate, endDate, color, category, isRecurring
      ]);
      
      const event = eventResult.rows[0];

      // If recurring, insert recurrence pattern
      if (isRecurring && recurrencePattern) {
        const recurrenceQuery = `
          INSERT INTO recurrence_patterns 
          (event_id, recurrence_type, interval_value, days_of_week, day_of_month, end_date, max_occurrences)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        
        await client.query(recurrenceQuery, [
          event.id,
          recurrencePattern.type,
          recurrencePattern.interval || 1,
          recurrencePattern.daysOfWeek || null,
          recurrencePattern.dayOfMonth || null,
          recurrencePattern.endDate || null,
          recurrencePattern.maxOccurrences || null
        ]);
      }

      await client.query('COMMIT');
      return event;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Error creating event: ${error.message}`);
    } finally {
      client.release();
    }
  }

  // Update event
  async updateEvent(id, eventData) {
    const {
      title,
      description,
      startDate,
      endDate,
      color,
      category
    } = eventData;

    const query = `
      UPDATE events 
      SET title = $1, description = $2, start_date = $3, end_date = $4, 
          color = $5, category = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `;
    
    try {
      const result = await this.db.query(query, [
        title, description, startDate, endDate, color, category, id
      ]);
      
      if (result.rows.length === 0) {
        throw new Error('Event not found');
      }
      
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating event: ${error.message}`);
    }
  }

  // Delete event
  async deleteEvent(id) {
    const query = 'DELETE FROM events WHERE id = $1 RETURNING *';
    
    try {
      const result = await this.db.query(query, [id]);
      
      if (result.rows.length === 0) {
        throw new Error('Event not found');
      }
      
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting event: ${error.message}`);
    }
  }

  // Search events
  async searchEvents(searchTerm, category = null) {
    let query = `
      SELECT e.*, rp.recurrence_type, rp.interval_value, rp.days_of_week, 
             rp.day_of_month, rp.end_date as recurrence_end_date, rp.max_occurrences
      FROM events e
      LEFT JOIN recurrence_patterns rp ON e.id = rp.event_id
      WHERE (LOWER(e.title) LIKE LOWER($1) OR LOWER(e.description) LIKE LOWER($1))
    `;
    
    const params = [`%${searchTerm}%`];
    
    if (category) {
      query += ' AND e.category = $2';
      params.push(category);
    }
    
    query += ' ORDER BY e.start_date ASC';
    
    try {
      const result = await this.db.query(query, params);
      return result.rows;
    } catch (error) {
      throw new Error(`Error searching events: ${error.message}`);
    }
  }

  // Check for event conflicts
  async checkConflicts(startDate, endDate, excludeEventId = null) {
    let query = `
      SELECT * FROM events 
      WHERE (start_date < $2 AND end_date > $1)
    `;
    
    const params = [startDate, endDate];
    
    if (excludeEventId) {
      query += ' AND id != $3';
      params.push(excludeEventId);
    }
    
    try {
      const result = await this.db.query(query, params);
      return result.rows;
    } catch (error) {
      throw new Error(`Error checking conflicts: ${error.message}`);
    }
  }
}

module.exports = Event;
