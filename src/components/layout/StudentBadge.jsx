// StudentBadge.jsx
// Interactive Academic Project Modal detailing Experiment 1-4 requirements, hooks, and verification links

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  CheckCircle,
  FileCode,
  X,
  ExternalLink,
  Layers,
  Code2,
  Workflow,
  ShieldCheck,
  Bug
} from "lucide-react";

export const StudentBadge = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("exp1");
  const [simulateError, setSimulateError] = useState(false);

  if (!isOpen) return null;

  if (simulateError) {
    throw new Error("Simulated Test Error triggered to demonstrate Experiment 4g ErrorBoundary!");
  }

  return (
    <div className="lab-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="lab-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="lab-modal-header">
          <div className="header-title-box">
            <GraduationCap className="academic-cap-icon" size={26} />
            <div>
              <h3>Lab Curriculum Assessment Hub</h3>
              <p>Scenario 8: Hospital Appointment Booking Web Application</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="lab-modal-tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === "exp1" ? "active" : ""}`}
            onClick={() => setActiveTab("exp1")}
          >
            <Code2 size={16} /> Exp 1: React Hooks
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "exp2" ? "active" : ""}`}
            onClick={() => setActiveTab("exp2")}
          >
            <Layers size={16} /> Exp 2: Custom Hooks & Context
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "exp3" ? "active" : ""}`}
            onClick={() => setActiveTab("exp3")}
          >
            <Workflow size={16} /> Exp 3: React Router
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "exp4" ? "active" : ""}`}
            onClick={() => setActiveTab("exp4")}
          >
            <ShieldCheck size={16} /> Exp 4: Auth & Protected Routes
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "api" ? "active" : ""}`}
            onClick={() => setActiveTab("api")}
          >
            <FileCode size={16} /> REST API & CRUD
          </button>
        </div>

        <div className="lab-modal-body">
          {activeTab === "exp1" && (
            <div className="exp-details-panel">
              <h4>Experiment 1: Hospital Appointment Application Using React Hooks</h4>
              <p className="exp-subtitle">
                Topics: <code>useState</code>, <code>useEffect</code>, <code>useRef</code>, <code>useMemo</code>, <code>useCallback</code>, Props, Reusable Components
              </p>
              <ul className="checklist">
                <li>
                  <CheckCircle size={16} className="text-green" />
                  <span>
                    <strong>Reusable Functional Components:</strong> Header, Home, DoctorList, DoctorCard, DoctorProfile, SearchBar, FilterPanel, AppointmentBooking, AppointmentHistory, PatientProfile, Footer.
                  </span>
                </li>
                <li>
                  <CheckCircle size={16} className="text-green" />
                  <span>
                    <strong>useState:</strong> Manages doctor search, specialty, selected doctor, appointment date/time, patient details, appointment history, booking status.
                  </span>
                </li>
                <li>
                  <CheckCircle size={16} className="text-green" />
                  <span>
                    <strong>useEffect:</strong> Loads doctor data on startup; updates available time slots dynamically when specialty or date changes.
                  </span>
                </li>
                <li>
                  <CheckCircle size={16} className="text-green" />
                  <span>
                    <strong>useRef:</strong> Implemented in <code>SearchBar.jsx</code> for auto-focusing doctor search input on page load and demonstrating direct DOM referencing.
                  </span>
                </li>
                <li>
                  <CheckCircle size={16} className="text-green" />
                  <span>
                    <strong>useMemo:</strong> Efficiently computes filtered doctors, available time slots, appointment duration, and appointment summary.
                  </span>
                </li>
                <li>
                  <CheckCircle size={16} className="text-green" />
                  <span>
                    <strong>useCallback:</strong> Memoizes reusable handlers: <code>selectDoctor()</code>, <code>bookAppointment()</code>, <code>rescheduleAppointment()</code>, <code>cancelAppointment()</code>.
                  </span>
                </li>
              </ul>
              <div className="quick-verify-links">
                <Link to="/doctors" onClick={onClose} className="verify-chip">
                  <ExternalLink size={13} /> Test Doctor Search & useRef Auto-Focus
                </Link>
                <Link to="/book-appointment" onClick={onClose} className="verify-chip">
                  <ExternalLink size={13} /> Test Appointment Booking Flow
                </Link>
              </div>
            </div>
          )}

          {activeTab === "exp2" && (
            <div className="exp-details-panel">
              <h4>Experiment 2: Doctor Search and Appointment Management with Custom Hooks & Context API</h4>
              <p className="exp-subtitle">
                Topics: Custom Hooks, Context API, useState, useEffect, useMemo, useCallback
              </p>
              <ul className="checklist">
                <li>
                  <CheckCircle size={16} className="text-green" />
                  <span>
                    <strong>Custom Hook <code>useDoctors()</code>:</strong> Manages doctor data, search, specialty, availability, consultation fee, and rating filtering.
                  </span>
                </li>
                <li>
                  <CheckCircle size={16} className="text-green" />
                  <span>
                    <strong>Custom Hook <code>useAppointments()</code>:</strong> Manages appointments, dates, slots, booking status, rescheduling, and cancellation.
                  </span>
                </li>
                <li>
                  <CheckCircle size={16} className="text-green" />
                  <span>
                    <strong><code>AppointmentContext</code> (Context API):</strong> Shares doctor & appointment state globally without prop drilling.
                  </span>
                </li>
                <li>
                  <CheckCircle size={16} className="text-green" />
                  <span>
                    <strong>Browser Storage & Reminders:</strong> Syncs appointments to <code>localStorage</code> and computes active reminders in real time.
                  </span>
                </li>
                <li>
                  <CheckCircle size={16} className="text-green" />
                  <span>
                    <strong>Conditional Rendering Messages:</strong>
                    <div className="badge-grid">
                      <span className="msg-tag">"No doctors available"</span>
                      <span className="msg-tag">"No appointments available"</span>
                      <span className="msg-tag">"No time slots available"</span>
                      <span className="msg-tag">"No upcoming appointments"</span>
                      <span className="msg-tag">"Appointment cancelled"</span>
                    </div>
                  </span>
                </li>
              </ul>
            </div>
          )}

          {activeTab === "exp3" && (
            <div className="exp-details-panel">
              <h4>Experiment 3: Hospital Appointment Navigation Using React Router</h4>
              <p className="exp-subtitle">
                Topics: React Router, Dynamic Routing, Nested Routing, useParams, useNavigate, Outlet
              </p>
              <ul className="checklist">
                <li>
                  <CheckCircle size={16} className="text-green" />
                  <span>
                    <strong>Configured Routes:</strong> <code>/</code>, <code>/doctors</code>, <code>/doctor/:id</code>, <code>/appointments</code>, <code>/book-appointment</code>, <code>/appointment/:id</code>, <code>/login</code>, <code>/patient</code>
                  </span>
                </li>
                <li>
                  <CheckCircle size={16} className="text-green" />
                  <span>
                    <strong>Link & NavLink:</strong> Seamless client-side navigation without page reload with active tab highlighting.
                  </span>
                </li>
                <li>
                  <CheckCircle size={16} className="text-green" />
                  <span>
                    <strong>Dynamic Routing with <code>useParams()</code>:</strong> View individual profiles via <code>/doctor/:id</code> (e.g., <code>/doctor/101</code>, <code>/doctor/102</code>).
                  </span>
                </li>
                <li>
                  <CheckCircle size={16} className="text-green" />
                  <span>
                    <strong>Nested Routing with <code>&lt;Outlet /&gt;</code>:</strong> Patient dashboard supports <code>/patient/appointments</code>, <code>/patient/upcoming</code>, <code>/patient/history</code>, and <code>/patient/profile</code>.
                  </span>
                </li>
                <li>
                  <CheckCircle size={16} className="text-green" />
                  <span>
                    <strong>Programmatic Navigation via <code>useNavigate()</code>:</strong> Step-by-step appointment booking flow.
                  </span>
                </li>
              </ul>
              <div className="quick-verify-links">
                <Link to="/doctor/101" onClick={onClose} className="verify-chip">
                  <ExternalLink size={13} /> View Doctor 101 Profile (useParams)
                </Link>
                <Link to="/patient/upcoming" onClick={onClose} className="verify-chip">
                  <ExternalLink size={13} /> Test Nested Patient Dashboard (Outlet)
                </Link>
              </div>
            </div>
          )}

          {activeTab === "exp4" && (
            <div className="exp-details-panel">
              <h4>Experiment 4: Protected Routes, Authentication & Error Handling</h4>
              <p className="exp-subtitle">
                Topics: Protected Routes, Context API, Form Validation, Error Boundaries, Reusable Components
              </p>
              <ul className="checklist">
                <li>
                  <CheckCircle size={16} className="text-green" />
                  <span>
                    <strong>AuthContext:</strong> Maintains patient login status, JWT token storage, login/logout callbacks.
                  </span>
                </li>
                <li>
                  <CheckCircle size={16} className="text-green" />
                  <span>
                    <strong>ProtectedRoute:</strong> Protects <code>/patient</code>, <code>/appointments</code>, <code>/book-appointment</code>, <code>/appointment/:id</code>.
                  </span>
                </li>
                <li>
                  <CheckCircle size={16} className="text-green" />
                  <span>
                    <strong>Controlled Form Validation:</strong> Required fields, Email format, 10-digit Phone, Password length, Patient ID format, Date and Time-slot validation.
                  </span>
                </li>
                <li>
                  <CheckCircle size={16} className="text-green" />
                  <span>
                    <strong>ErrorBoundary:</strong> Catches unhandled runtime exceptions with clean fallback and recovery.
                  </span>
                </li>
              </ul>

              <div className="error-test-box">
                <p>Test Error Boundary live:</p>
                <button
                  type="button"
                  className="test-error-btn"
                  onClick={() => setSimulateError(true)}
                >
                  <Bug size={14} /> Trigger Test Error (Demonstrate ErrorBoundary)
                </button>
              </div>
            </div>
          )}

          {activeTab === "api" && (
            <div className="exp-details-panel">
              <h4>REST API CRUD Operations & Token Management (Page 9 - 11)</h4>
              <p className="exp-subtitle">
                Topics: REST API, Axios/Fetch, Async Data, CRUD, Token Management, Loading/Error States
              </p>
              <div className="api-methods-grid">
                <div className="api-method-card">
                  <span className="http-badge get">GET</span>
                  <code>/api/doctors</code>
                  <p>Fetch list of doctors with search & specialty filters</p>
                </div>
                <div className="api-method-card">
                  <span className="http-badge get">GET</span>
                  <code>/api/doctors/:id</code>
                  <p>Dynamically fetch single doctor profile details</p>
                </div>
                <div className="api-method-card">
                  <span className="http-badge post">POST</span>
                  <code>/api/appointments</code>
                  <p>Create new appointment with Bearer Token</p>
                </div>
                <div className="api-method-card">
                  <span className="http-badge put">PUT</span>
                  <code>/api/appointments/:id</code>
                  <p>Reschedule appointment date and time slot</p>
                </div>
                <div className="api-method-card">
                  <span className="http-badge delete">DELETE</span>
                  <code>/api/appointments/:id</code>
                  <p>Cancel appointment with immediate state sync</p>
                </div>
                <div className="api-method-card">
                  <span className="http-badge post">POST</span>
                  <code>/api/auth/login</code>
                  <p>Patient authentication returning mock Bearer token</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lab-modal-footer">
          <div className="student-info-tag">
            <span>Student Assessment: <strong>Scenario 8 Hospital Appointment System</strong></span>
          </div>
          <button type="button" className="btn-modal-done" onClick={onClose}>
            Close Lab Hub
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentBadge;
