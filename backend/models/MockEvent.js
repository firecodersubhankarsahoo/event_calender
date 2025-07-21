// Mock Event model for development without PostgreSQL
// This allows the application to run without database setup

class MockEvent {
  constructor() {
    // In-memory storage for events
    this.events = [
      {
        id: 1,
        title: 'Team Meeting',
        description: 'Weekly team standup meeting',
        start_date: new Date('2024-01-15T10:00:00Z'),
        end_date: new Date('2024-01-15T11:00:00Z'),
        color: '#007bff',
        category: 'Work',
        is_recurring: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        title: 'Doctor Appointment',
        description: 'Annual checkup',
        start_date: new Date('2024-01-16T14:30:00Z'),
        end_date: new Date('2024-01-16T15:30:00Z'),
        color: '#dc3545',
        category: 'Health',
        is_recurring: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        title: 'Birthday Party',
        description: 'John\'s birthday celebration',
        start_date: new Date('2024-01-20T18:00:00Z'),
        end_date: new Date('2024-01-20T22:00:00Z'),
        color: '#28a745',
        category: 'Personal',
        is_recurring: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    this.nextId = 4;
  }

  // Get all events within a date range
  async getEventsByDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return this.events.filter(event => {
      const eventStart = new Date(event.start_date);
      const eventEnd = new Date(event.end_date);
      
      return (eventStart >= start && eventStart <= end) ||
             (eventEnd >= start && eventEnd <= end) ||
             (eventStart <= start && eventEnd >= end);
    });
  }

  // Get event by ID
  async getEventById(id) {
    return this.events.find(event => event.id == id);
  }

  // Create new event
  async createEvent(eventData) {
    const newEvent = {
      id: this.nextId++,
      title: eventData.title,
      description: eventData.description || '',
      start_date: new Date(eventData.startDate),
      end_date: new Date(eventData.endDate),
      color: eventData.color || '#007bff',
      category: eventData.category || 'Other',
      is_recurring: eventData.isRecurring || false,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    this.events.push(newEvent);
    return newEvent;
  }

  // Update event
  async updateEvent(id, eventData) {
    const eventIndex = this.events.findIndex(event => event.id == id);
    
    if (eventIndex === -1) {
      throw new Error('Event not found');
    }
    
    const updatedEvent = {
      ...this.events[eventIndex],
      title: eventData.title || this.events[eventIndex].title,
      description: eventData.description !== undefined ? eventData.description : this.events[eventIndex].description,
      start_date: eventData.startDate ? new Date(eventData.startDate) : this.events[eventIndex].start_date,
      end_date: eventData.endDate ? new Date(eventData.endDate) : this.events[eventIndex].end_date,
      color: eventData.color || this.events[eventIndex].color,
      category: eventData.category || this.events[eventIndex].category,
      updated_at: new Date()
    };
    
    this.events[eventIndex] = updatedEvent;
    return updatedEvent;
  }

  // Delete event
  async deleteEvent(id) {
    const eventIndex = this.events.findIndex(event => event.id == id);
    
    if (eventIndex === -1) {
      throw new Error('Event not found');
    }
    
    const deletedEvent = this.events[eventIndex];
    this.events.splice(eventIndex, 1);
    return deletedEvent;
  }

  // Search events
  async searchEvents(searchTerm, category = null) {
    let filteredEvents = this.events.filter(event => {
      const titleMatch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
      const descriptionMatch = event.description.toLowerCase().includes(searchTerm.toLowerCase());
      return titleMatch || descriptionMatch;
    });
    
    if (category) {
      filteredEvents = filteredEvents.filter(event => event.category === category);
    }
    
    return filteredEvents.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
  }

  // Check for event conflicts
  async checkConflicts(startDate, endDate, excludeEventId = null) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return this.events.filter(event => {
      if (excludeEventId && event.id == excludeEventId) {
        return false;
      }
      
      const eventStart = new Date(event.start_date);
      const eventEnd = new Date(event.end_date);
      
      // Check for overlap
      return eventStart < end && eventEnd > start;
    });
  }
}

module.exports = MockEvent;
