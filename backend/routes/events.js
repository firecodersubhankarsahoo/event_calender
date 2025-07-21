const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// GET /api/events - Get all events within date range
router.get('/', eventController.getAllEvents);

// GET /api/events/search - Search events
router.get('/search', eventController.searchEvents);

// GET /api/events/conflicts - Check for event conflicts
router.get('/conflicts', eventController.checkConflicts);

// GET /api/events/:id - Get single event by ID
router.get('/:id', eventController.getEventById);

// POST /api/events - Create new event
router.post('/', eventController.createEvent);

// PUT /api/events/:id - Update existing event
router.put('/:id', eventController.updateEvent);

// DELETE /api/events/:id - Delete event
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
