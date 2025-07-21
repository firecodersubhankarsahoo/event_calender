import React, { useState } from 'react';
import { getEventColorClass, formatTime } from '../utils/dateUtils';

const EventItem = ({ event, onClick }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    onClick(event);
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    const dragData = {
      type: 'event',
      event: event
    };
    e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const colorClass = getEventColorClass(event.color);
  const startTime = new Date(event.start_date);
  
  const eventClasses = [
    'event-item',
    colorClass,
    isDragging ? 'dragging' : ''
  ].filter(Boolean).join(' ');

  return (
    <div
      className={eventClasses}
      onClick={handleClick}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      title={`${event.title}\n${formatTime(startTime)}\n${event.description || ''}`}
    >
      <div className="event-time">
        {formatTime(startTime)}
      </div>
      <div className="event-title">
        {event.title}
      </div>
      {event.is_recurring && (
        <i className="bi bi-arrow-repeat ms-1" title="Recurring event"></i>
      )}
    </div>
  );
};

export default EventItem;
