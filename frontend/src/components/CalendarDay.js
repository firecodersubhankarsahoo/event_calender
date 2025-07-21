import React, { useState } from 'react';
import EventItem from './EventItem';

const CalendarDay = ({ day, onDayClick, onEventClick, onEventDrop }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDayClick = (e) => {
    // Only trigger day click if clicking on the day itself, not on an event
    if (e.target === e.currentTarget || e.target.classList.contains('day-number')) {
      onDayClick(day.date);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    try {
      const eventData = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (eventData && eventData.type === 'event') {
        onEventDrop(eventData.event, day.date);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  const dayClasses = [
    'calendar-day',
    day.isToday ? 'today' : '',
    !day.isCurrentMonth ? 'other-month' : '',
    isDragOver ? 'drag-over' : ''
  ].filter(Boolean).join(' ');

  return (
    <div
      className={dayClasses}
      onClick={handleDayClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="day-number">
        {day.date.getDate()}
      </div>
      
      <div className="events-container">
        {day.events.slice(0, 3).map((event, index) => (
          <EventItem
            key={event.id || `${event.parent_event_id}_${index}`}
            event={event}
            onClick={onEventClick}
          />
        ))}
        
        {day.events.length > 3 && (
          <div className="more-events text-muted small">
            +{day.events.length - 3} more
          </div>
        )}
      </div>
      
      {isDragOver && (
        <div className="drop-zone active">
          <div className="drop-indicator">
            <i className="bi bi-plus-circle"></i>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarDay;
