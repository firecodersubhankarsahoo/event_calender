import React, { useState } from 'react';
import { MONTHS } from '../utils/dateUtils';

const DatePicker = ({ currentDate, onDateSelect, onClose }) => {
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());

  // Generate year options (current year ± 10 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = currentYear - 10; year <= currentYear + 10; year++) {
    yearOptions.push(year);
  }

  const handleDateSelect = () => {
    const newDate = new Date(selectedYear, selectedMonth, 1);
    onDateSelect(newDate);
  };

  const handleQuickSelect = (monthsToAdd) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + monthsToAdd);
    onDateSelect(newDate);
  };

  return (
    <div className="modal fade show d-block date-picker-modal" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-sm">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-calendar3 me-2"></i>
              Select Date
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <div className="modal-body">
            {/* Quick Navigation */}
            <div className="mb-3">
              <label className="form-label small text-muted">Quick Navigation</label>
              <div className="d-grid gap-2 date-picker-quick-nav">
                <div className="row g-2">
                  <div className="col-6">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm w-100"
                      onClick={() => handleQuickSelect(-12)}
                    >
                      <i className="bi bi-chevron-double-left me-1"></i>
                      Last Year
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm w-100"
                      onClick={() => handleQuickSelect(12)}
                    >
                      Next Year
                      <i className="bi bi-chevron-double-right ms-1"></i>
                    </button>
                  </div>
                </div>
                <div className="row g-2">
                  <div className="col-6">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm w-100"
                      onClick={() => handleQuickSelect(-6)}
                    >
                      <i className="bi bi-chevron-left me-1"></i>
                      6 Months
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm w-100"
                      onClick={() => handleQuickSelect(6)}
                    >
                      6 Months
                      <i className="bi bi-chevron-right ms-1"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <hr />

            {/* Year Selection */}
            <div className="mb-3">
              <label className="form-label">Year</label>
              <select
                className="form-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                {yearOptions.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Month Selection */}
            <div className="mb-3">
              <label className="form-label">Month</label>
              <select
                className="form-select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              >
                {MONTHS.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Selection Preview */}
            <div className="alert alert-info date-picker-preview">
              <i className="bi bi-info-circle me-2"></i>
              <strong>Selected:</strong> {MONTHS[selectedMonth]} {selectedYear}
            </div>
          </div>
          
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleDateSelect}
            >
              <i className="bi bi-check-lg me-1"></i>
              Go to Date
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
