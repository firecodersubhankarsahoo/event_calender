import React, { useState, useEffect } from 'react';
import { 
  EVENT_COLORS, 
  EVENT_CATEGORIES, 
  formatDateTimeForInput,
  parseDateTimeFromInput,
  isValidDateRange
} from '../utils/dateUtils';

const EventModal = ({ show, event, selectedDate, onSave, onDelete, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    color: '#007bff',
    category: 'Other',
    isRecurring: false,
    recurrenceType: 'daily',
    recurrenceInterval: 1,
    recurrenceEndDate: '',
    maxOccurrences: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Initialize form data when modal opens
  useEffect(() => {
    if (show) {
      if (event) {
        // Editing existing event
        const startDateTime = formatDateTimeForInput(new Date(event.start_date));
        const endDateTime = formatDateTimeForInput(new Date(event.end_date));
        
        setFormData({
          title: event.title || '',
          description: event.description || '',
          startDate: startDateTime.date,
          startTime: startDateTime.time,
          endDate: endDateTime.date,
          endTime: endDateTime.time,
          color: event.color || '#007bff',
          category: event.category || 'Other',
          isRecurring: event.is_recurring || false,
          recurrenceType: event.recurrence_type || 'daily',
          recurrenceInterval: event.interval_value || 1,
          recurrenceEndDate: event.recurrence_end_date ? 
            formatDateTimeForInput(new Date(event.recurrence_end_date)).date : '',
          maxOccurrences: event.max_occurrences || ''
        });
      } else if (selectedDate) {
        // Creating new event
        const startDateTime = formatDateTimeForInput(selectedDate);
        const endDate = new Date(selectedDate);
        endDate.setHours(endDate.getHours() + 1);
        const endDateTime = formatDateTimeForInput(endDate);
        
        setFormData({
          title: '',
          description: '',
          startDate: startDateTime.date,
          startTime: startDateTime.time,
          endDate: endDateTime.date,
          endTime: endDateTime.time,
          color: '#007bff',
          category: 'Other',
          isRecurring: false,
          recurrenceType: 'daily',
          recurrenceInterval: 1,
          recurrenceEndDate: '',
          maxOccurrences: ''
        });
      }
      setErrors({});
    }
  }, [show, event, selectedDate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    
    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }
    
    if (formData.startDate && formData.startTime && formData.endDate && formData.endTime) {
      const startDateTime = parseDateTimeFromInput(formData.startDate, formData.startTime);
      const endDateTime = parseDateTimeFromInput(formData.endDate, formData.endTime);
      
      if (!isValidDateRange(startDateTime, endDateTime)) {
        newErrors.endDate = 'End date/time must be after start date/time';
      }
    }
    
    if (formData.isRecurring) {
      if (!formData.recurrenceInterval || formData.recurrenceInterval < 1) {
        newErrors.recurrenceInterval = 'Interval must be at least 1';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const startDateTime = parseDateTimeFromInput(formData.startDate, formData.startTime);
      const endDateTime = parseDateTimeFromInput(formData.endDate, formData.endTime);
      
      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        color: formData.color,
        category: formData.category,
        isRecurring: formData.isRecurring
      };
      
      if (formData.isRecurring) {
        eventData.recurrencePattern = {
          type: formData.recurrenceType,
          interval: parseInt(formData.recurrenceInterval),
          endDate: formData.recurrenceEndDate ? 
            new Date(formData.recurrenceEndDate).toISOString() : null,
          maxOccurrences: formData.maxOccurrences ? 
            parseInt(formData.maxOccurrences) : null
        };
      }
      
      await onSave(eventData);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setLoading(true);
      try {
        await onDelete(event.id);
      } catch (error) {
        setErrors({ submit: error.message });
      } finally {
        setLoading(false);
      }
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {event ? 'Edit Event' : 'Add New Event'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {errors.submit && (
                <div className="alert alert-danger">
                  {errors.submit}
                </div>
              )}
              
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Title *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Event title"
                  />
                  {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                </div>
                
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Event description (optional)"
                  />
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">Start Date *</label>
                  <input
                    type="date"
                    className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                  {errors.startDate && <div className="invalid-feedback">{errors.startDate}</div>}
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">Start Time *</label>
                  <input
                    type="time"
                    className={`form-control ${errors.startTime ? 'is-invalid' : ''}`}
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                  />
                  {errors.startTime && <div className="invalid-feedback">{errors.startTime}</div>}
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">End Date *</label>
                  <input
                    type="date"
                    className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                  />
                  {errors.endDate && <div className="invalid-feedback">{errors.endDate}</div>}
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">End Time *</label>
                  <input
                    type="time"
                    className={`form-control ${errors.endTime ? 'is-invalid' : ''}`}
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                  />
                  {errors.endTime && <div className="invalid-feedback">{errors.endTime}</div>}
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">Color</label>
                  <div className="d-flex gap-2 flex-wrap">
                    {EVENT_COLORS.map(color => (
                      <button
                        key={color.value}
                        type="button"
                        className={`btn btn-sm ${formData.color === color.value ? 'border-dark border-2' : 'border'}`}
                        style={{ backgroundColor: color.value, width: '30px', height: '30px' }}
                        onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    {EVENT_CATEGORIES.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="col-12">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="isRecurring"
                      checked={formData.isRecurring}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label">
                      Recurring Event
                    </label>
                  </div>
                </div>
                
                {formData.isRecurring && (
                  <>
                    <div className="col-md-6">
                      <label className="form-label">Recurrence Type</label>
                      <select
                        className="form-select"
                        name="recurrenceType"
                        value={formData.recurrenceType}
                        onChange={handleInputChange}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label">Every</label>
                      <div className="input-group">
                        <input
                          type="number"
                          className={`form-control ${errors.recurrenceInterval ? 'is-invalid' : ''}`}
                          name="recurrenceInterval"
                          value={formData.recurrenceInterval}
                          onChange={handleInputChange}
                          min="1"
                        />
                        <span className="input-group-text">
                          {formData.recurrenceType === 'daily' ? 'day(s)' :
                           formData.recurrenceType === 'weekly' ? 'week(s)' : 'month(s)'}
                        </span>
                      </div>
                      {errors.recurrenceInterval && <div className="invalid-feedback">{errors.recurrenceInterval}</div>}
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label">End Date (optional)</label>
                      <input
                        type="date"
                        className="form-control"
                        name="recurrenceEndDate"
                        value={formData.recurrenceEndDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label">Max Occurrences (optional)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="maxOccurrences"
                        value={formData.maxOccurrences}
                        onChange={handleInputChange}
                        min="1"
                        placeholder="Leave empty for no limit"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="modal-footer">
              <div className="d-flex justify-content-between w-100">
                <div>
                  {event && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={handleDelete}
                      disabled={loading}
                    >
                      <i className="bi bi-trash me-1"></i>
                      Delete
                    </button>
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-1"></i>
                        {event ? 'Update' : 'Create'} Event
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
