import React, { useState } from 'react';
import CalendarDay from './CalendarDay';
import DatePicker from './DatePicker';
import {
  generateCalendarDays,
  formatDate,
  DAYS_OF_WEEK,
  isSameDay
} from '../utils/dateUtils';

const Calendar = ({
  currentDate,
  events,
  loading,
  onPreviousMonth,
  onNextMonth,
  onToday,
  onDayClick,
  onEventClick,
  onEventDrop,
  onDateChange
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const calendarDays = generateCalendarDays(currentDate);
  
  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    const eventDate = new Date(event.start_date);
    const dateKey = eventDate.toDateString();
    
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {});

  // Add events to calendar days
  const daysWithEvents = calendarDays.map(day => ({
    ...day,
    events: eventsByDate[day.date.toDateString()] || []
  }));

  if (loading) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="loading-spinner">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header bg-white">
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="d-flex align-items-center">
              <h3 className="card-title mb-0 me-2">
                {formatDate(currentDate, { month: 'long', year: 'numeric' })}
              </h3>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm calendar-icon-btn"
                onClick={() => setShowDatePicker(true)}
                title="Select Date"
              >
                <i className="bi bi-calendar3"></i>
              </button>
            </div>
          </div>
          <div className="col-md-6">
            <div className="btn-group float-md-end" role="group">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onPreviousMonth}
                title="Previous Month"
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onToday}
                title="Today"
              >
                Today
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onNextMonth}
                title="Next Month"
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card-body p-0">
        <div className="calendar-grid">
          {/* Day headers */}
          {DAYS_OF_WEEK.map(day => (
            <div key={day} className="day-header">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {daysWithEvents.map((day, index) => (
            <CalendarDay
              key={index}
              day={day}
              onDayClick={onDayClick}
              onEventClick={onEventClick}
              onEventDrop={onEventDrop}
            />
          ))}
        </div>
      </div>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DatePicker
          currentDate={currentDate}
          onDateSelect={(date) => {
            onDateChange(date);
            setShowDatePicker(false);
          }}
          onClose={() => setShowDatePicker(false)}
        />
      )}
    </div>
  );
};

export default Calendar;
