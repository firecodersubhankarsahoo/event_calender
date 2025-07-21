const Event = require('../models/Event');
const MockEvent = require('../models/MockEvent');

class EventController {
  constructor() {
    // Bind methods to preserve 'this' context
    this.getAllEvents = this.getAllEvents.bind(this);
    this.getEventById = this.getEventById.bind(this);
    this.createEvent = this.createEvent.bind(this);
    this.updateEvent = this.updateEvent.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.searchEvents = this.searchEvents.bind(this);
    this.checkConflicts = this.checkConflicts.bind(this);
  }

  // Get all events within a date range
  async getAllEvents(req, res) {
    try {
      const { startDate, endDate } = req.query;
      // Use mock database if available, otherwise use real database
      const eventModel = req.app.locals.db instanceof MockEvent ?
        req.app.locals.db : new Event(req.app.locals.db);
      
      if (!startDate || !endDate) {
        return res.status(400).json({ 
          error: 'startDate and endDate query parameters are required' 
        });
      }

      const events = await eventModel.getEventsByDateRange(startDate, endDate);
      
      // Generate recurring event instances
      const expandedEvents = this.expandRecurringEvents(events, new Date(startDate), new Date(endDate));
      
      res.json(expandedEvents);
    } catch (error) {
      console.error('Error in getAllEvents:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Get single event by ID
  async getEventById(req, res) {
    try {
      const { id } = req.params;
      // Use mock database if available, otherwise use real database
      const eventModel = req.app.locals.db instanceof MockEvent ?
        req.app.locals.db : new Event(req.app.locals.db);

      const event = await eventModel.getEventById(id);

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      res.json(event);
    } catch (error) {
      console.error('Error in getEventById:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Create new event
  async createEvent(req, res) {
    try {
      const eventData = req.body;
      // Use mock database if available, otherwise use real database
      const eventModel = req.app.locals.db instanceof MockEvent ?
        req.app.locals.db : new Event(req.app.locals.db);
      
      // Validate required fields
      if (!eventData.title || !eventData.startDate || !eventData.endDate) {
        return res.status(400).json({ 
          error: 'Title, startDate, and endDate are required' 
        });
      }

      // Check for conflicts (only for overlapping events, not touching boundaries)
      const conflicts = await eventModel.checkConflicts(
        eventData.startDate,
        eventData.endDate
      );

      // Filter out conflicts that only touch at boundaries (not actual overlaps)
      const realConflicts = conflicts.filter(conflict => {
        const conflictStart = new Date(conflict.start_date);
        const conflictEnd = new Date(conflict.end_date);
        const eventStart = new Date(eventData.startDate);
        const eventEnd = new Date(eventData.endDate);

        // Allow events that just touch at boundaries
        return !(eventEnd.getTime() === conflictStart.getTime() ||
                eventStart.getTime() === conflictEnd.getTime());
      });

      if (realConflicts.length > 0) {
        return res.status(409).json({
          error: 'Event conflicts with existing events',
          conflicts: realConflicts
        });
      }

      const event = await eventModel.createEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      console.error('Error in createEvent:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Update existing event
  async updateEvent(req, res) {
    try {
      const { id } = req.params;
      const eventData = req.body;
      // Use mock database if available, otherwise use real database
      const eventModel = req.app.locals.db instanceof MockEvent ?
        req.app.locals.db : new Event(req.app.locals.db);
      
      // Check for conflicts (excluding current event)
      if (eventData.startDate && eventData.endDate) {
        const conflicts = await eventModel.checkConflicts(
          eventData.startDate,
          eventData.endDate,
          id
        );

        // Filter out conflicts that only touch at boundaries
        const realConflicts = conflicts.filter(conflict => {
          const conflictStart = new Date(conflict.start_date);
          const conflictEnd = new Date(conflict.end_date);
          const eventStart = new Date(eventData.startDate);
          const eventEnd = new Date(eventData.endDate);

          // Allow events that just touch at boundaries
          return !(eventEnd.getTime() === conflictStart.getTime() ||
                  eventStart.getTime() === conflictEnd.getTime());
        });

        if (realConflicts.length > 0) {
          return res.status(409).json({
            error: 'Event conflicts with existing events',
            conflicts: realConflicts
          });
        }
      }

      const event = await eventModel.updateEvent(id, eventData);
      res.json(event);
    } catch (error) {
      console.error('Error in updateEvent:', error);
      if (error.message === 'Event not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  // Delete event
  async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      // Use mock database if available, otherwise use real database
      const eventModel = req.app.locals.db instanceof MockEvent ?
        req.app.locals.db : new Event(req.app.locals.db);
      
      const event = await eventModel.deleteEvent(id);
      res.json({ message: 'Event deleted successfully', event });
    } catch (error) {
      console.error('Error in deleteEvent:', error);
      if (error.message === 'Event not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  // Search events
  async searchEvents(req, res) {
    try {
      const { q: searchTerm, category } = req.query;
      // Use mock database if available, otherwise use real database
      const eventModel = req.app.locals.db instanceof MockEvent ?
        req.app.locals.db : new Event(req.app.locals.db);
      
      if (!searchTerm) {
        return res.status(400).json({ error: 'Search term (q) is required' });
      }

      const events = await eventModel.searchEvents(searchTerm, category);
      res.json(events);
    } catch (error) {
      console.error('Error in searchEvents:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Check for event conflicts
  async checkConflicts(req, res) {
    try {
      const { startDate, endDate, excludeId } = req.query;
      // Use mock database if available, otherwise use real database
      const eventModel = req.app.locals.db instanceof MockEvent ?
        req.app.locals.db : new Event(req.app.locals.db);
      
      if (!startDate || !endDate) {
        return res.status(400).json({ 
          error: 'startDate and endDate are required' 
        });
      }

      const conflicts = await eventModel.checkConflicts(startDate, endDate, excludeId);
      res.json({ conflicts });
    } catch (error) {
      console.error('Error in checkConflicts:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Helper method to expand recurring events
  expandRecurringEvents(events, startDate, endDate) {
    const expandedEvents = [];
    
    events.forEach(event => {
      if (!event.is_recurring) {
        expandedEvents.push(event);
        return;
      }

      // Generate recurring instances
      const instances = this.generateRecurringInstances(event, startDate, endDate);
      expandedEvents.push(...instances);
    });

    return expandedEvents;
  }

  // Generate recurring event instances
  generateRecurringInstances(event, rangeStart, rangeEnd) {
    const instances = [];
    const eventStart = new Date(event.start_date);
    const eventEnd = new Date(event.end_date);
    const duration = eventEnd.getTime() - eventStart.getTime();

    let currentDate = new Date(eventStart);
    let instanceCount = 0;
    const maxInstances = event.max_occurrences || 100; // Prevent infinite loops

    while (currentDate <= rangeEnd && instanceCount < maxInstances) {
      if (currentDate >= rangeStart) {
        const instanceEnd = new Date(currentDate.getTime() + duration);
        
        instances.push({
          ...event,
          id: `${event.id}_${instanceCount}`,
          start_date: new Date(currentDate),
          end_date: instanceEnd,
          parent_event_id: event.id
        });
      }

      // Calculate next occurrence
      currentDate = this.getNextOccurrence(currentDate, event);
      instanceCount++;

      // Check if we've passed the recurrence end date
      if (event.recurrence_end_date && currentDate > new Date(event.recurrence_end_date)) {
        break;
      }
    }

    return instances;
  }

  // Calculate next occurrence based on recurrence pattern
  getNextOccurrence(currentDate, event) {
    const nextDate = new Date(currentDate);
    const interval = event.interval_value || 1;

    switch (event.recurrence_type) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + interval);
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + (7 * interval));
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + interval);
        break;
      default:
        nextDate.setDate(nextDate.getDate() + interval);
    }

    return nextDate;
  }
}

module.exports = new EventController();
