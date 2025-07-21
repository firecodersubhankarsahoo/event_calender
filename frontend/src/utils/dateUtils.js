// Date utility functions for the calendar

export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const EVENT_COLORS = [
  { value: '#007bff', name: 'Blue', class: 'event-blue' },
  { value: '#dc3545', name: 'Red', class: 'event-red' },
  { value: '#28a745', name: 'Green', class: 'event-green' },
  { value: '#ffc107', name: 'Yellow', class: 'event-yellow' },
  { value: '#6f42c1', name: 'Purple', class: 'event-purple' },
  { value: '#e83e8c', name: 'Pink', class: 'event-pink' },
  { value: '#17a2b8', name: 'Cyan', class: 'event-cyan' },
  { value: '#fd7e14', name: 'Orange', class: 'event-orange' },
  { value: '#6c757d', name: 'Gray', class: 'event-gray' },
];

export const EVENT_CATEGORIES = [
  'Work', 'Personal', 'Health', 'Education', 'Social', 'Travel', 'Other'
];

// Get the first day of the month
export const getFirstDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

// Get the last day of the month
export const getLastDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

// Get the start of the calendar view (including previous month days)
export const getCalendarStart = (date) => {
  const firstDay = getFirstDayOfMonth(date);
  const dayOfWeek = firstDay.getDay();
  const start = new Date(firstDay);
  start.setDate(start.getDate() - dayOfWeek);
  return start;
};

// Get the end of the calendar view (including next month days)
export const getCalendarEnd = (date) => {
  const lastDay = getLastDayOfMonth(date);
  const dayOfWeek = lastDay.getDay();
  const end = new Date(lastDay);
  end.setDate(end.getDate() + (6 - dayOfWeek));
  return end;
};

// Generate calendar days for a month
export const generateCalendarDays = (date) => {
  const days = [];
  const start = getCalendarStart(date);
  const end = getCalendarEnd(date);
  const currentMonth = date.getMonth();
  const today = new Date();
  
  const current = new Date(start);
  while (current <= end) {
    days.push({
      date: new Date(current),
      isCurrentMonth: current.getMonth() === currentMonth,
      isToday: isSameDay(current, today),
      events: []
    });
    current.setDate(current.getDate() + 1);
  }
  
  return days;
};

// Check if two dates are the same day
export const isSameDay = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

// Check if a date is today
export const isToday = (date) => {
  return isSameDay(date, new Date());
};

// Format date for display
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  return date.toLocaleDateString('en-US', defaultOptions);
};

// Format time for display
export const formatTime = (date) => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

// Format datetime for input fields
export const formatDateTimeForInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`
  };
};

// Parse datetime from input fields
export const parseDateTimeFromInput = (dateStr, timeStr) => {
  const date = new Date(`${dateStr}T${timeStr}`);
  return date;
};

// Add days to a date
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Add months to a date
export const addMonths = (date, months) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

// Get the start of the day
export const startOfDay = (date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

// Get the end of the day
export const endOfDay = (date) => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

// Check if two date ranges overlap
export const doDateRangesOverlap = (start1, end1, start2, end2) => {
  return start1 < end2 && start2 < end1;
};

// Get color class for an event
export const getEventColorClass = (color) => {
  const colorObj = EVENT_COLORS.find(c => c.value === color);
  return colorObj ? colorObj.class : 'event-blue';
};

// Generate a unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Validate date range
export const isValidDateRange = (startDate, endDate) => {
  return startDate instanceof Date && 
         endDate instanceof Date && 
         startDate < endDate;
};

// Get month name
export const getMonthName = (monthIndex) => {
  return MONTHS[monthIndex];
};

// Get day name
export const getDayName = (dayIndex) => {
  return DAYS_OF_WEEK[dayIndex];
};

// Calculate duration between two dates in minutes
export const getDurationInMinutes = (startDate, endDate) => {
  return Math.round((endDate - startDate) / (1000 * 60));
};

// Format duration for display
export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  } else if (mins === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${mins}m`;
  }
};
