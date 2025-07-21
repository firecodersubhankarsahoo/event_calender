import React, { useState, useEffect, useCallback } from 'react';
import Calendar from './components/Calendar';
import EventModal from './components/EventModal';
import SearchFilter from './components/SearchFilter';
import { eventAPI } from './services/api';
import { generateCalendarDays, addMonths } from './utils/dateUtils';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const calendarDays = generateCalendarDays(currentDate);
      const startDate = calendarDays[0].date;
      const endDate = calendarDays[calendarDays.length - 1].date;
      
      const eventsData = await eventAPI.getEvents(startDate, endDate);
      setEvents(eventsData);
    } catch (err) {
      setError(err.message);
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  // Load events when current date changes
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handlePreviousMonth = () => {
    setCurrentDate(prevDate => addMonths(prevDate, -1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => addMonths(prevDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setShowEventModal(true);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setSelectedDate(null);
    setShowEventModal(true);
  };

  const handleEventSave = async (eventData) => {
    try {
      if (selectedEvent) {
        // Update existing event
        await eventAPI.updateEvent(selectedEvent.id, eventData);
      } else {
        // Create new event
        await eventAPI.createEvent(eventData);
      }
      
      // Reload events
      await loadEvents();
      setShowEventModal(false);
      setSelectedEvent(null);
      setSelectedDate(null);
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const handleEventDelete = async (eventId) => {
    try {
      await eventAPI.deleteEvent(eventId);
      await loadEvents();
      setShowEventModal(false);
      setSelectedEvent(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEventDrop = async (event, newDate) => {
    try {
      const eventStart = new Date(event.start_date);
      const eventEnd = new Date(event.end_date);
      const duration = eventEnd.getTime() - eventStart.getTime();
      
      const newStartDate = new Date(newDate);
      newStartDate.setHours(eventStart.getHours(), eventStart.getMinutes());
      
      const newEndDate = new Date(newStartDate.getTime() + duration);
      
      const updatedEvent = {
        ...event,
        startDate: newStartDate.toISOString(),
        endDate: newEndDate.toISOString()
      };
      
      await eventAPI.updateEvent(event.id, updatedEvent);
      await loadEvents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearch = useCallback(async (query, category) => {
    setSearchQuery(query);
    setSelectedCategory(category);

    if (!query.trim()) {
      await loadEvents();
      return;
    }

    try {
      setLoading(true);
      setError(null); // Clear previous errors
      const searchResults = await eventAPI.searchEvents(query, category || null);
      setEvents(searchResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [loadEvents]);

  const handleCloseModal = () => {
    setShowEventModal(false);
    setSelectedEvent(null);
    setSelectedDate(null);
    setError(null); // Clear any errors when closing modal
  };

  return (
    <div className="App">
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <header className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="h2 mb-0">
                <i className="bi bi-calendar3 me-2"></i>
                Event Calendar
              </h1>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setSelectedDate(new Date());
                  setSelectedEvent(null);
                  setShowEventModal(true);
                }}
              >
                <i className="bi bi-plus-lg me-1"></i>
                Add Event
              </button>
            </header>

            <SearchFilter
              onSearch={handleSearch}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
            />

            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setError(null)}
                ></button>
              </div>
            )}

            <Calendar
              currentDate={currentDate}
              events={events}
              loading={loading}
              onPreviousMonth={handlePreviousMonth}
              onNextMonth={handleNextMonth}
              onToday={handleToday}
              onDayClick={handleDayClick}
              onEventClick={handleEventClick}
              onEventDrop={handleEventDrop}
              onDateChange={handleDateChange}
            />

            {showEventModal && (
              <EventModal
                show={showEventModal}
                event={selectedEvent}
                selectedDate={selectedDate}
                onSave={handleEventSave}
                onDelete={handleEventDelete}
                onClose={handleCloseModal}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
