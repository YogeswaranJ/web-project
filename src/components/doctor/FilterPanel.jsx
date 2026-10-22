// FilterPanel.jsx
// Experiment 1a & 2a: FilterPanel component for specialty, fee, rating, and day availability

import React from "react";
import { Filter, RotateCcw, Star, DollarSign, Calendar, Sparkles } from "lucide-react";
import { SPECIALTIES } from "../../data/initialDoctors";

const DAYS = ["Any", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const FilterPanel = ({
  selectedSpecialty,
  setSelectedSpecialty,
  minRating,
  setMinRating,
  maxFee,
  setMaxFee,
  selectedDay,
  setSelectedDay,
  resetFilters,
  totalResults
}) => {
  return (
    <aside className="filter-panel" aria-label="Doctor filters">
      <div className="filter-panel-header">
        <div className="filter-title-group">
          <Filter size={18} className="filter-icon" />
          <h3 className="filter-title">Filter Specialists</h3>
        </div>
        <button
          type="button"
          onClick={resetFilters}
          className="filter-reset-btn"
          title="Reset all filters"
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>
      </div>

      <div className="filter-body">
        {/* Specialty Filter */}
        <div className="filter-section">
          <label htmlFor="specialty-select" className="filter-label">
            <Sparkles size={14} /> Medical Specialty
          </label>
          <select
            id="specialty-select"
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="filter-select"
          >
            {SPECIALTIES.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        {/* Available Day Filter */}
        <div className="filter-section">
          <label htmlFor="day-select" className="filter-label">
            <Calendar size={14} /> Available Day
          </label>
          <select
            id="day-select"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="filter-select"
          >
            {DAYS.map((day) => (
              <option key={day} value={day}>
                {day === "Any" ? "Any Day of the Week" : day}
              </option>
            ))}
          </select>
        </div>

        {/* Max Consultation Fee Slider */}
        <div className="filter-section">
          <div className="filter-label-row">
            <label htmlFor="fee-slider" className="filter-label">
              <DollarSign size={14} /> Max Fee
            </label>
            <span className="filter-value-badge">₹{maxFee}</span>
          </div>
          <input
            id="fee-slider"
            type="range"
            min="400"
            max="1500"
            step="50"
            value={maxFee}
            onChange={(e) => setMaxFee(Number(e.target.value))}
            className="filter-range-slider"
          />
          <div className="filter-range-ticks">
            <span>₹400</span>
            <span>₹950</span>
            <span>₹1500</span>
          </div>
        </div>

        {/* Minimum Rating Filter */}
        <div className="filter-section">
          <label className="filter-label">
            <Star size={14} /> Minimum Rating
          </label>
          <div className="rating-pill-group">
            {[0, 4.5, 4.8, 4.9].map((ratingVal) => (
              <button
                key={ratingVal}
                type="button"
                className={`rating-pill-btn ${minRating === ratingVal ? "active" : ""}`}
                onClick={() => setMinRating(ratingVal)}
              >
                {ratingVal === 0 ? (
                  "All"
                ) : (
                  <>
                    <Star size={12} className="star-filled" fill="currentColor" />
                    <span>{ratingVal}+</span>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Filter results counter */}
        <div className="filter-results-counter">
          <span>Matching Doctors:</span>
          <strong>{totalResults} found</strong>
        </div>
      </div>
    </aside>
  );
};

export default FilterPanel;
