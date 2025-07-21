import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  
  baseURL: process.env.REACT_APP_API_URL || 'https://event-calender-t5jy.onrender.com/api',
  timeout: 30000, // Increased timeout for Render cold starts
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Set to false for CORS
});

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      // Redirect to login if needed
    }
    return Promise.reject(error);
  }
);

// Event API functions
export const eventAPI = {
  // Get all events within a date range
  getEvents: async (startDate, endDate) => {
    try {
      const response = await api.get('/events', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch events: ${error.response?.data?.error || error.message}`);
    }
  },

  // Get single event by ID
  getEvent: async (id) => {
    try {
      const response = await api.get(`/events/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch event: ${error.response?.data?.error || error.message}`);
    }
  },

  // Create new event
  createEvent: async (eventData) => {
    try {
      const response = await api.post('/events', eventData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new Error(`Event conflicts with existing events: ${error.response.data.error}`);
      }
      throw new Error(`Failed to create event: ${error.response?.data?.error || error.message}`);
    }
  },

  // Update existing event
  updateEvent: async (id, eventData) => {
    try {
      const response = await api.put(`/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new Error(`Event conflicts with existing events: ${error.response.data.error}`);
      }
      throw new Error(`Failed to update event: ${error.response?.data?.error || error.message}`);
    }
  },

  // Delete event
  deleteEvent: async (id) => {
    try {
      const response = await api.delete(`/events/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete event: ${error.response?.data?.error || error.message}`);
    }
  },

  // Search events
  searchEvents: async (searchTerm, category = null) => {
    try {
      const params = { q: searchTerm };
      if (category) {
        params.category = category;
      }
      
      const response = await api.get('/events/search', { params });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to search events: ${error.response?.data?.error || error.message}`);
    }
  },

  // Check for event conflicts
  checkConflicts: async (startDate, endDate, excludeId = null) => {
    try {
      const params = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };
      
      if (excludeId) {
        params.excludeId = excludeId;
      }
      
      const response = await api.get('/events/conflicts', { params });
      return response.data.conflicts;
    } catch (error) {
      throw new Error(`Failed to check conflicts: ${error.response?.data?.error || error.message}`);
    }
  },
};

// Health check function
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error(`API health check failed: ${error.message}`);
  }
};

export default api;
