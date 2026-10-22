// AppointmentBooking.jsx
// Experiment 1a, 3g, 4f, 4i: Multi-step programmatic appointment flow using useNavigate() and form validations

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import confetti from "canvas-confetti";
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Stethoscope,
  DollarSign,
  FileText,
  Mail,
  Phone,
  Hash,
  Sparkles,
  MapPin
} from "lucide-react";
import { useAppointmentContext } from "../context/AppointmentContext";
import { useAuth } from "../context/AuthContext";
import TimeSlot from "../components/appointment/TimeSlot";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Loading from "../components/common/Loading";

export const AppointmentBooking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    doctors,
    selectedDoctor,
    selectDoctor,
    appointmentDate,
    setAppointmentDate,
    selectedTimeSlot,
    selectTimeSlot,
    availableSlots,
    patientDetails,
    setPatientDetails,
    appointmentDuration,
    appointmentSummary,
    bookAppointment,
    bookingStatus,
    clearAppointment
  } = useAppointmentContext();

  // Multi-step booking state
  // 1: Doctor Selection / Review
  // 2: Date Selection
  // 3: Time Slot Selection
  // 4: Patient Details Form
  // 5: Appointment Summary
  // 6: Booking Confirmation
  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);

  // Sync doctor from URL param if available (e.g. ?doctorId=101)
  useEffect(() => {
    const docId = searchParams.get("doctorId");
    if (docId && doctors.length > 0) {
      const doc = doctors.find((d) => String(d.id) === String(docId));
      if (doc) {
        selectDoctor(doc);
      }
    }
  }, [searchParams, doctors, selectDoctor]);

  // Today's date string for input min attribute
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Validation functions (Experiment 4f)
  const validateStep = (step) => {
    const errors = {};

    if (step === 1) {
      // Doctor selection validation
      if (!selectedDoctor) {
        errors.doctor = "Please select a specialist doctor to proceed.";
      }
    }

    if (step === 2) {
      // Appointment date validation
      if (!appointmentDate) {
        errors.date = "Appointment date is required.";
      } else {
        const selected = new Date(appointmentDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selected < today) {
          errors.date = "Appointment date cannot be in the past.";
        }
      }
    }

    if (step === 3) {
      // Time-slot validation
      if (!selectedTimeSlot) {
        errors.slot = "Please select an available consultation time slot.";
      }
    }

    if (step === 4) {
      // Patient details validation (Experiment 4f)
      if (!patientDetails.name?.trim()) {
        errors.name = "Patient full name is required.";
      }

      // Email validation (regex)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!patientDetails.email?.trim()) {
        errors.email = "Email address is required.";
      } else if (!emailRegex.test(patientDetails.email.trim())) {
        errors.email = "Please enter a valid email address (e.g. patient@example.com).";
      }

      // Phone validation (10 digits)
      const phoneRegex = /^[0-9]{10}$/;
      const cleanedPhone = patientDetails.phone?.replace(/[^0-9]/g, "");
      if (!patientDetails.phone?.trim()) {
        errors.phone = "Phone number is required.";
      } else if (!phoneRegex.test(cleanedPhone)) {
        errors.phone = "Please enter a valid 10-digit phone number.";
      }

      // Patient ID validation
      if (!patientDetails.patientId?.trim()) {
        errors.patientId = "Patient ID is required.";
      } else if (!patientDetails.patientId.startsWith("PID-")) {
        errors.patientId = "Patient ID must follow format PID-XXXX (e.g. PID-2024-8841).";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step Navigation Handlers (Experiment 3g: useNavigate)
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    setFormErrors({});
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  // Final booking execution
  const handleFinalBooking = async () => {
    const res = await bookAppointment();
    if (res.success) {
      setConfirmedAppointment(res.appointment);
      setCurrentStep(6); // Step 6: Confirmation

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.log("Confetti effect triggered");
      }
    }
  };

  const stepsList = [
    { num: 1, label: "Doctor Selection" },
    { num: 2, label: "Date Selection" },
    { num: 3, label: "Time Slot" },
    { num: 4, label: "Patient Details" },
    { num: 5, label: "Summary" },
    { num: 6, label: "Confirmation" }
  ];

  return (
    <div className="booking-page">
      <div className="container">
        {/* Page Title */}
        <div className="booking-header-area">
          <h1 className="booking-title">Book Doctor Appointment</h1>
          <p className="booking-subtitle">
            Follow the guided step-by-step process to reserve your hospital OPD slot.
          </p>
        </div>

        {/* Step Progress Tracker */}
        <div className="step-tracker-container">
          <div className="steps-progress-bar">
            {stepsList.map((step) => {
              const isPassed = currentStep > step.num;
              const isCurrent = currentStep === step.num;
              return (
                <div
                  key={step.num}
                  className={`step-item ${isPassed ? "completed" : ""} ${
                    isCurrent ? "active" : ""
                  }`}
                >
                  <div className="step-circle">
                    {isPassed ? <CheckCircle2 size={16} /> : step.num}
                  </div>
                  <span className="step-label">{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content Card */}
        <div className="booking-card-main">
          {/* ==================================================== */}
          {/* STEP 1: DOCTOR SELECTION & PROFILE REVIEW */}
          {/* ==================================================== */}
          {currentStep === 1 && (
            <div className="step-content">
              <h2 className="step-heading">Step 1: Select or Review Specialist Doctor</h2>

              {formErrors.doctor && (
                <div className="booking-error-banner" role="alert">
                  <AlertCircle size={16} />
                  <span>{formErrors.doctor}</span>
                </div>
              )}

              {selectedDoctor ? (
                <div className="selected-doctor-highlight">
                  <div className="highlight-doc-card">
                    <img
                      src={selectedDoctor.avatar}
                      alt={selectedDoctor.name}
                      className="highlight-avatar"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400";
                      }}
                    />
                    <div className="highlight-doc-info">
                      <span className="spec-tag">{selectedDoctor.specialty}</span>
                      <h3>{selectedDoctor.name}</h3>
                      <p className="doc-sub-text">{selectedDoctor.qualification}</p>
                      <div className="meta-row">
                        <span>
                          <MapPin size={13} /> {selectedDoctor.hospital}
                        </span>
                        <span>
                          <DollarSign size={13} /> Fee: ₹{selectedDoctor.consultationFee}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="change-doctor-prompt">
                    <p>Want to consult a different specialist?</p>
                    <Link to="/doctors" className="change-doc-link">
                      Browse Full Doctor Directory
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="doctor-pick-prompt">
                  <p className="prompt-text">
                    No doctor is currently selected. Please select a specialist from our roster below:
                  </p>
                  <div className="mini-doctor-picker-grid">
                    {doctors.map((doc) => (
                      <div
                        key={doc.id}
                        className={`doc-pick-card ${
                          selectedDoctor?.id === doc.id ? "selected" : ""
                        }`}
                        onClick={() => selectDoctor(doc)}
                      >
                        <img src={doc.avatar} alt={doc.name} className="mini-avatar" />
                        <div>
                          <strong>{doc.name}</strong>
                          <span className="mini-spec">{doc.specialty}</span>
                          <span className="mini-fee">₹{doc.consultationFee}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="step-actions">
                <div></div>
                <Button
                  variant="primary"
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={handleNextStep}
                  disabled={!selectedDoctor}
                >
                  Proceed to Date Selection
                </Button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 2: DATE SELECTION */}
          {/* ==================================================== */}
          {currentStep === 2 && (
            <div className="step-content">
              <h2 className="step-heading">Step 2: Choose Appointment Date</h2>
              <p className="step-subheading">
                Doctor {selectedDoctor?.name} conducts OPD consultations on:{" "}
                <strong>{selectedDoctor?.availableDays.join(", ")}</strong>.
              </p>

              {formErrors.date && (
                <div className="booking-error-banner" role="alert">
                  <AlertCircle size={16} />
                  <span>{formErrors.date}</span>
                </div>
              )}

              <div className="date-picker-box">
                <label htmlFor="appointment-date-picker" className="date-picker-label">
                  <Calendar size={18} /> Select Preferred Date
                </label>
                <input
                  id="appointment-date-picker"
                  type="date"
                  min={todayStr}
                  value={appointmentDate}
                  onChange={(e) => {
                    setAppointmentDate(e.target.value);
                    setFormErrors({});
                  }}
                  className="booking-date-input"
                  required
                />

                {appointmentDate && (
                  <div className="selected-date-preview">
                    <span>Selected Date:</span>
                    <strong>
                      {new Date(appointmentDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </strong>
                  </div>
                )}
              </div>

              <div className="step-actions">
                <Button variant="outline" icon={ArrowLeft} onClick={handlePrevStep}>
                  Back to Doctor
                </Button>
                <Button
                  variant="primary"
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={handleNextStep}
                  disabled={!appointmentDate}
                >
                  Proceed to Time Slot
                </Button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 3: TIME SLOT SELECTION */}
          {/* ==================================================== */}
          {currentStep === 3 && (
            <div className="step-content">
              <h2 className="step-heading">Step 3: Select Available Time Slot</h2>
              <p className="step-subheading">
                Consultation with <strong>{selectedDoctor?.name}</strong> on{" "}
                <strong>{appointmentDate}</strong>.
              </p>

              {formErrors.slot && (
                <div className="booking-error-banner" role="alert">
                  <AlertCircle size={16} />
                  <span>{formErrors.slot}</span>
                </div>
              )}

              {/* Requirement 2h: Conditional rendering "No time slots available" */}
              {availableSlots.length === 0 ? (
                <div className="empty-slots-box" role="status">
                  <Clock size={36} className="empty-icon" />
                  <h4>No time slots available</h4>
                  <p>
                    All slots for this doctor on {appointmentDate} are booked or unavailable. Please
                    choose an alternative date.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setCurrentStep(2)}>
                    Pick Another Date
                  </Button>
                </div>
              ) : (
                <div className="slots-selection-panel">
                  <div className="time-slots-grid">
                    {availableSlots.map(({ slot, isBooked }) => (
                      <TimeSlot
                        key={slot}
                        slot={slot}
                        isSelected={selectedTimeSlot === slot}
                        isBooked={isBooked}
                        onSelect={(selected) => {
                          selectTimeSlot(selected);
                          setFormErrors({});
                        }}
                      />
                    ))}
                  </div>

                  {selectedTimeSlot && (
                    <div className="selected-slot-feedback">
                      <CheckCircle2 size={16} className="text-green" />
                      <span>
                        Selected Time: <strong>{selectedTimeSlot}</strong> (Expected Duration:{" "}
                        {appointmentDuration})
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="step-actions">
                <Button variant="outline" icon={ArrowLeft} onClick={handlePrevStep}>
                  Back to Date
                </Button>
                <Button
                  variant="primary"
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={handleNextStep}
                  disabled={!selectedTimeSlot}
                >
                  Proceed to Patient Details
                </Button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 4: PATIENT DETAILS FORM */}
          {/* ==================================================== */}
          {currentStep === 4 && (
            <div className="step-content">
              <h2 className="step-heading">Step 4: Patient Information & Symptoms</h2>
              <p className="step-subheading">
                Please enter verified patient medical details for hospital OPD registration.
              </p>

              <form
                className="patient-form-grid"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleNextStep();
                }}
              >
                {/* Full Name */}
                <Input
                  label="Patient Full Name"
                  id="patient-name"
                  name="name"
                  value={patientDetails.name}
                  onChange={(e) =>
                    setPatientDetails({ ...patientDetails, name: e.target.value })
                  }
                  placeholder="e.g. Rahul Verma"
                  required
                  error={formErrors.name}
                  icon={User}
                />

                {/* Patient ID (PID-XXXX) */}
                <Input
                  label="Patient Registration ID"
                  id="patient-id"
                  name="patientId"
                  value={patientDetails.patientId}
                  onChange={(e) =>
                    setPatientDetails({ ...patientDetails, patientId: e.target.value })
                  }
                  placeholder="PID-2024-8841"
                  required
                  error={formErrors.patientId}
                  helperText="Format: PID-XXXX"
                  icon={Hash}
                />

                {/* Email Address */}
                <Input
                  label="Email Address"
                  id="patient-email"
                  name="email"
                  type="email"
                  value={patientDetails.email}
                  onChange={(e) =>
                    setPatientDetails({ ...patientDetails, email: e.target.value })
                  }
                  placeholder="name@example.com"
                  required
                  error={formErrors.email}
                  icon={Mail}
                />

                {/* Phone Number */}
                <Input
                  label="10-Digit Mobile Number"
                  id="patient-phone"
                  name="phone"
                  type="tel"
                  value={patientDetails.phone}
                  onChange={(e) =>
                    setPatientDetails({ ...patientDetails, phone: e.target.value })
                  }
                  placeholder="9876543210"
                  required
                  error={formErrors.phone}
                  icon={Phone}
                />

                {/* Symptoms / Chief Complaint */}
                <div className="form-full-width">
                  <label htmlFor="patient-symptoms" className="input-label">
                    Chief Complaint / Medical Symptoms (Optional)
                  </label>
                  <textarea
                    id="patient-symptoms"
                    value={patientDetails.symptoms}
                    onChange={(e) =>
                      setPatientDetails({ ...patientDetails, symptoms: e.target.value })
                    }
                    placeholder="Briefly describe what symptoms or issues you want the specialist to examine..."
                    rows={3}
                    className="symptoms-textarea"
                  ></textarea>
                </div>
              </form>

              <div className="step-actions">
                <Button variant="outline" icon={ArrowLeft} onClick={handlePrevStep}>
                  Back to Time Slot
                </Button>
                <Button
                  variant="primary"
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={handleNextStep}
                >
                  Review Appointment Summary
                </Button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 5: APPOINTMENT SUMMARY (useMemo) */}
          {/* ==================================================== */}
          {currentStep === 5 && (
            <div className="step-content">
              <h2 className="step-heading">Step 5: Review Appointment Summary</h2>
              <p className="step-subheading">
                Please verify all appointment information before final confirmation.
              </p>

              {appointmentSummary && (
                <div className="summary-card">
                  <div className="summary-header">
                    <FileText size={20} className="summary-icon" />
                    <h3>Hospital Appointment Overview</h3>
                  </div>

                  <div className="summary-grid">
                    <div className="summary-item">
                      <span className="summary-label">Specialist Doctor</span>
                      <strong className="summary-val">{appointmentSummary.doctorName}</strong>
                      <small className="summary-sub">{appointmentSummary.specialty}</small>
                    </div>

                    <div className="summary-item">
                      <span className="summary-label">Hospital Department</span>
                      <strong className="summary-val">{appointmentSummary.hospital}</strong>
                    </div>

                    <div className="summary-item">
                      <span className="summary-label">Scheduled Date</span>
                      <strong className="summary-val">{appointmentSummary.appointmentDate}</strong>
                    </div>

                    <div className="summary-item">
                      <span className="summary-label">Time & Duration</span>
                      <strong className="summary-val">
                        {appointmentSummary.timeSlot} ({appointmentSummary.duration})
                      </strong>
                    </div>

                    <div className="summary-item">
                      <span className="summary-label">Patient Name & ID</span>
                      <strong className="summary-val">
                        {appointmentSummary.patientName} ({patientDetails.patientId})
                      </strong>
                    </div>

                    <div className="summary-item">
                      <span className="summary-label">Contact Details</span>
                      <strong className="summary-val">
                        {appointmentSummary.patientEmail} • {appointmentSummary.patientPhone}
                      </strong>
                    </div>

                    <div className="summary-item highlight-fee">
                      <span className="summary-label">OPD Consultation Fee</span>
                      <strong className="summary-fee-val">₹{appointmentSummary.consultationFee}</strong>
                      <small className="fee-note">(Payable at hospital reception desk or online)</small>
                    </div>
                  </div>
                </div>
              )}

              <div className="step-actions">
                <Button variant="outline" icon={ArrowLeft} onClick={handlePrevStep}>
                  Modify Details
                </Button>
                <Button
                  variant="success"
                  size="lg"
                  icon={CheckCircle2}
                  onClick={handleFinalBooking}
                  isLoading={bookingStatus === "loading"}
                >
                  Confirm & Book Appointment
                </Button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 6: BOOKING CONFIRMATION */}
          {/* ==================================================== */}
          {currentStep === 6 && confirmedAppointment && (
            <div className="step-content confirmation-view">
              <div className="confirmation-badge-circle">
                <CheckCircle2 size={56} className="confirm-icon" />
              </div>

              <h2 className="confirm-heading">Appointment Confirmed!</h2>
              <p className="confirm-sub">
                Your hospital consultation slot has been reserved successfully.
              </p>

              <div className="confirmed-details-card">
                <div className="confirm-id-banner">
                  <span>Appointment Reference Number:</span>
                  <strong>{confirmedAppointment.id}</strong>
                </div>

                <div className="confirm-key-values">
                  <div>
                    <span>Consultant:</span>
                    <strong>{confirmedAppointment.doctorName}</strong>
                  </div>
                  <div>
                    <span>Date & Time:</span>
                    <strong>
                      {confirmedAppointment.appointmentDate} at {confirmedAppointment.timeSlot}
                    </strong>
                  </div>
                  <div>
                    <span>Patient Name:</span>
                    <strong>{confirmedAppointment.patientName}</strong>
                  </div>
                  <div>
                    <span>Location:</span>
                    <strong>{confirmedAppointment.doctorHospital}</strong>
                  </div>
                </div>
              </div>

              <div className="confirm-actions-row">
                {/* Experiment 4i: Flow leads to Appointment History */}
                <Button
                  variant="primary"
                  icon={Calendar}
                  onClick={() => navigate("/patient/appointments")}
                >
                  View in Appointment History
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    clearAppointment();
                    navigate("/doctors");
                  }}
                >
                  Book Another Appointment
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;
