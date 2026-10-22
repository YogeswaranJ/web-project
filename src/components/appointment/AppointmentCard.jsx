// AppointmentCard.jsx
// Experiment 4h: Reusable AppointmentCard Component with reschedule, cancel, and status badges

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  RotateCcw,
  Ban
} from "lucide-react";
import Button from "../common/Button";
import { useAppointmentContext } from "../../context/AppointmentContext";

export const AppointmentCard = ({ appointment, onRescheduled, onCancelled }) => {
  const { rescheduleAppointment, cancelAppointment } = useAppointmentContext();

  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState(appointment.appointmentDate);
  const [newSlot, setNewSlot] = useState(appointment.timeSlot);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  const isUpcoming = appointment.status === "Upcoming" || appointment.status === "Rescheduled";
  const isCancelled = appointment.status === "Cancelled";

  const handleCancel = async () => {
    if (window.confirm(`Are you sure you want to cancel appointment ${appointment.id}?`)) {
      setIsSubmitting(true);
      const res = await cancelAppointment(appointment.id);
      setIsSubmitting(false);
      if (res.success) {
        setActionMessage("Appointment cancelled");
        if (onCancelled) onCancelled(appointment.id);
      }
    }
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!newDate || !newSlot) return;
    setIsSubmitting(true);
    const res = await rescheduleAppointment(appointment.id, newDate, newSlot);
    setIsSubmitting(false);
    if (res.success) {
      setIsRescheduling(false);
      setActionMessage("Appointment rescheduled successfully!");
      if (onRescheduled) onRescheduled(res.appointment);
    }
  };

  const getStatusBadge = () => {
    switch (appointment.status) {
      case "Upcoming":
        return (
          <span className="status-badge status-upcoming">
            <CheckCircle2 size={13} /> Upcoming
          </span>
        );
      case "Rescheduled":
        return (
          <span className="status-badge status-rescheduled">
            <RotateCcw size={13} /> Rescheduled
          </span>
        );
      case "Completed":
        return (
          <span className="status-badge status-completed">
            <CheckCircle2 size={13} /> Completed
          </span>
        );
      case "Cancelled":
        return (
          <span className="status-badge status-cancelled">
            <XCircle size={13} /> Cancelled
          </span>
        );
      default:
        return <span className="status-badge">{appointment.status}</span>;
    }
  };

  // Min selectable date is today
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className={`appointment-card ${isCancelled ? "is-cancelled" : ""}`} id={`apt-${appointment.id}`}>
      <div className="appointment-card-header">
        <div className="apt-id-group">
          <span className="apt-id-label">Appointment ID:</span>
          <strong className="apt-id-value">{appointment.id}</strong>
        </div>
        {getStatusBadge()}
      </div>

      <div className="appointment-card-body">
        <div className="apt-doc-details">
          <div className="doc-avatar-small">
            <Stethoscope size={20} />
          </div>
          <div>
            <h4 className="apt-doc-name">{appointment.doctorName}</h4>
            <p className="apt-doc-sub">
              {appointment.doctorSpecialty} • {appointment.doctorHospital}
            </p>
          </div>
        </div>

        <div className="apt-schedule-info">
          <div className="schedule-item">
            <Calendar size={15} className="schedule-icon" />
            <div>
              <span className="schedule-label">Date</span>
              <strong className="schedule-val">{appointment.appointmentDate}</strong>
            </div>
          </div>
          <div className="schedule-item">
            <Clock size={15} className="schedule-icon" />
            <div>
              <span className="schedule-label">Time & Duration</span>
              <strong className="schedule-val">
                {appointment.timeSlot} ({appointment.duration || "30 mins"})
              </strong>
            </div>
          </div>
          <div className="schedule-item">
            <User size={15} className="schedule-icon" />
            <div>
              <span className="schedule-label">Patient</span>
              <strong className="schedule-val">{appointment.patientName}</strong>
            </div>
          </div>
        </div>

        {appointment.symptoms && (
          <div className="apt-symptoms-snippet">
            <span className="symptom-tag">Chief Complaint:</span> {appointment.symptoms}
          </div>
        )}

        {/* Conditional rendering notification message */}
        {actionMessage && (
          <div className={`action-alert-banner ${isCancelled ? "danger" : "success"}`}>
            <AlertCircle size={14} />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Reschedule inline form */}
        {isRescheduling && (
          <form onSubmit={handleRescheduleSubmit} className="reschedule-box">
            <h5 className="reschedule-title">Choose New Date & Time Slot:</h5>
            <div className="reschedule-fields">
              <div className="field-group">
                <label htmlFor={`reschedule-date-${appointment.id}`}>New Date:</label>
                <input
                  id={`reschedule-date-${appointment.id}`}
                  type="date"
                  min={todayStr}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                  className="reschedule-input"
                />
              </div>

              <div className="field-group">
                <label htmlFor={`reschedule-slot-${appointment.id}`}>New Slot:</label>
                <select
                  id={`reschedule-slot-${appointment.id}`}
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  required
                  className="reschedule-select"
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:30 PM">03:30 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                </select>
              </div>
            </div>

            <div className="reschedule-btn-row">
              <Button type="submit" size="sm" variant="success" isLoading={isSubmitting}>
                Confirm Reschedule
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setIsRescheduling(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>

      <div className="appointment-card-footer">
        <Link to={`/appointment/${appointment.id}`} className="apt-details-link">
          <FileText size={14} />
          <span>View Details & Receipt</span>
        </Link>

        {isUpcoming && !isRescheduling && (
          <div className="apt-action-buttons">
            <Button
              variant="outline"
              size="sm"
              icon={RotateCcw}
              onClick={() => setIsRescheduling(true)}
              disabled={isSubmitting}
            >
              Reschedule
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={Ban}
              onClick={handleCancel}
              isLoading={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        )}

        {isCancelled && (
          <p className="cancelled-note" role="status">
            {/* Experiment 2h conditional rendering message requirement */}
            Appointment cancelled
          </p>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
