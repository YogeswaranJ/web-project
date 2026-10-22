// AppointmentDetails.jsx
// Experiment 3a & 4c: Dynamic single appointment details page with receipt printing and actions

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Printer,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Ban,
  FileCheck,
  ShieldCheck
} from "lucide-react";
import { api } from "../api/mockApi";
import { useAuth } from "../context/AuthContext";
import { useAppointmentContext } from "../context/AppointmentContext";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";

export const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { rescheduleAppointment, cancelAppointment } = useAppointmentContext();

  const [appointment, setAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newSlot, setNewSlot] = useState("10:00 AM");

  useEffect(() => {
    let isMounted = true;
    const loadDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await api.getAppointmentById(id, token);
        if (isMounted) {
          setAppointment(data);
          setNewDate(data.appointmentDate);
          setNewSlot(data.timeSlot);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || `Appointment ${id} not found.`);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDetails();
    return () => {
      isMounted = false;
    };
  }, [id, token]);

  const handlePrint = () => {
    window.print();
  };

  const handleCancel = async () => {
    if (window.confirm("Are you sure you want to cancel this scheduled appointment?")) {
      const res = await cancelAppointment(appointment.id);
      if (res.success) {
        setAppointment(res.appointment);
      }
    }
  };

  const handleReschedule = async (e) => {
    e.preventDefault();
    const res = await rescheduleAppointment(appointment.id, newDate, newSlot);
    if (res.success) {
      setAppointment(res.appointment);
      setIsRescheduling(false);
    }
  };

  if (isLoading) {
    return <Loading fullPage message="Fetching appointment records from hospital database..." />;
  }

  if (error || !appointment) {
    return (
      <div className="container details-error-view">
        <div className="error-card">
          <h2>Appointment Record Not Found</h2>
          <p>{error || `No appointment with ID ${id} was found.`}</p>
          <Button variant="primary" icon={ArrowLeft} onClick={() => navigate("/patient/appointments")}>
            Back to Patient Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const isUpcoming = appointment.status === "Upcoming" || appointment.status === "Rescheduled";

  return (
    <div className="appointment-details-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="details-header-bar">
          <Button
            variant="outline"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate("/patient/appointments")}
          >
            Back to Appointments
          </Button>
          <Button variant="outline" size="sm" icon={Printer} onClick={handlePrint}>
            Print Receipt
          </Button>
        </div>

        {/* Printable Receipt Card */}
        <div className="receipt-sheet printable-area">
          <div className="receipt-header">
            <div>
              <span className="hospital-tag">NABH ACCREDITED HOSPITAL</span>
              <h1 className="receipt-title">Hospital OPD Appointment Slip</h1>
              <p className="receipt-ref">Reference ID: <strong>{appointment.id}</strong></p>
            </div>
            <div className="receipt-status-box">
              <span className={`status-pill status-${appointment.status.toLowerCase()}`}>
                {appointment.status}
              </span>
              <small className="issued-date">
                Booked: {new Date(appointment.createdAt).toLocaleDateString()}
              </small>
            </div>
          </div>

          <div className="receipt-divider"></div>

          <div className="receipt-grid">
            <div className="receipt-section">
              <h3 className="section-label">Patient Information</h3>
              <div className="data-row">
                <span>Patient Full Name:</span>
                <strong>{appointment.patientName}</strong>
              </div>
              <div className="data-row">
                <span>Patient ID:</span>
                <strong>{appointment.patientId}</strong>
              </div>
              <div className="data-row">
                <span>Email Address:</span>
                <strong>{appointment.patientEmail}</strong>
              </div>
              <div className="data-row">
                <span>Contact Phone:</span>
                <strong>{appointment.patientPhone}</strong>
              </div>
            </div>

            <div className="receipt-section">
              <h3 className="section-label">Consultant Specialist Details</h3>
              <div className="data-row">
                <span>Doctor Name:</span>
                <strong>{appointment.doctorName}</strong>
              </div>
              <div className="data-row">
                <span>Specialty Department:</span>
                <strong>{appointment.doctorSpecialty}</strong>
              </div>
              <div className="data-row">
                <span>Hospital Campus:</span>
                <strong>{appointment.doctorHospital}</strong>
              </div>
              <div className="data-row">
                <span>Consultation Fee:</span>
                <strong className="fee-amount">₹{appointment.doctorFee || 800}</strong>
              </div>
            </div>
          </div>

          <div className="receipt-divider"></div>

          <div className="receipt-schedule-box">
            <div className="schedule-col">
              <span className="sched-icon-label">
                <Calendar size={16} /> Appointment Date
              </span>
              <strong>{appointment.appointmentDate}</strong>
            </div>
            <div className="schedule-col">
              <span className="sched-icon-label">
                <Clock size={16} /> Scheduled Time Slot
              </span>
              <strong>{appointment.timeSlot} ({appointment.duration || "30 mins"})</strong>
            </div>
            <div className="schedule-col">
              <span className="sched-icon-label">
                <ShieldCheck size={16} /> Check-in Status
              </span>
              <strong>Confirmed OPD Slot</strong>
            </div>
          </div>

          {appointment.symptoms && (
            <div className="receipt-symptoms">
              <span className="receipt-symptoms-label">Reported Symptoms / Chief Complaint:</span>
              <p>{appointment.symptoms}</p>
            </div>
          )}

          <div className="receipt-footer-instructions">
            <p>
              <strong>Important Hospital Instructions:</strong> Please arrive 15 minutes prior to
              your scheduled appointment at OPD Reception Desk Counter 3. Please carry any past
              prescriptions, lab investigation reports, and a valid photo ID.
            </p>
          </div>
        </div>

        {/* Reschedule inline modal/form */}
        {isRescheduling && (
          <div className="reschedule-modal-card">
            <h3>Reschedule Appointment {appointment.id}</h3>
            <form onSubmit={handleReschedule} className="reschedule-form-inner">
              <div className="form-group">
                <label>Select New Date:</label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Select New Time Slot:</label>
                <select value={newSlot} onChange={(e) => setNewSlot(e.target.value)} required>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:30 PM">03:30 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                </select>
              </div>

              <div className="reschedule-modal-actions">
                <Button type="submit" variant="success" size="sm">
                  Confirm Reschedule
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsRescheduling(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Action Buttons below receipt */}
        {isUpcoming && !isRescheduling && (
          <div className="details-action-bar">
            <Button
              variant="outline"
              icon={RotateCcw}
              onClick={() => setIsRescheduling(true)}
            >
              Reschedule Date & Time
            </Button>
            <Button variant="danger" icon={Ban} onClick={handleCancel}>
              Cancel Appointment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetails;
