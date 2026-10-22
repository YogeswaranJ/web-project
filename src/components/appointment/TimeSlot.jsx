// TimeSlot.jsx
// Experiment 4h: Reusable TimeSlot Component with interactive selection, booked status, and accessible states

import React from "react";
import { Clock, Check } from "lucide-react";

export const TimeSlot = ({
  slot,
  isSelected = false,
  isBooked = false,
  onSelect,
  disabled = false
}) => {
  const isActionable = !isBooked && !disabled;

  const handleClick = () => {
    if (isActionable && onSelect) {
      onSelect(slot);
    }
  };

  return (
    <button
      type="button"
      className={`time-slot-btn ${isSelected ? "selected" : ""} ${isBooked ? "booked" : ""} ${
        disabled ? "disabled" : ""
      }`}
      onClick={handleClick}
      disabled={!isActionable}
      aria-pressed={isSelected}
      aria-label={`${slot} ${isBooked ? "(Booked)" : isSelected ? "(Selected)" : "(Available)"}`}
    >
      <Clock size={13} className="time-slot-icon" />
      <span className="time-slot-text">{slot}</span>
      {isSelected && <Check size={12} className="time-slot-check" />}
      {isBooked && <span className="time-slot-booked-badge">Booked</span>}
    </button>
  );
};

export default TimeSlot;
