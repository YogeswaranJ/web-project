// PatientDashboard.jsx
// Experiment 3e & 3f: Nested Routing layout with NavLink tabs and <Outlet />

import React from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  History,
  User,
  PlusCircle,
  Activity,
  ShieldCheck,
  CheckCircle2,
  FileText
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useAppointmentContext } from "../../context/AppointmentContext";

export const PatientDashboard = () => {
  const { user } = useAuth();
  const { appointmentCount, upcomingAppointments, appointmentHistory } = useAppointmentContext();

  return (
    <div className="patient-dashboard-page">
      <div className="container">
        {/* Patient Hero Header */}
        <div className="dashboard-hero-card">
          <div className="patient-hero-info">
            <div className="patient-avatar-box">
              <User size={34} />
            </div>
            <div>
              <span className="patient-badge-id">{user?.id || "PID-2024-8841"}</span>
              <h1 className="patient-hero-name">Welcome, {user?.name || "Patient"}</h1>
              <p className="patient-hero-sub">
                {user?.email} • {user?.phone} • Blood Group: {user?.bloodGroup || "O+"}
              </p>
            </div>
          </div>

          <div className="dashboard-stats-strip">
            <div className="dash-stat-box">
              <span className="stat-count">{appointmentCount}</span>
              <span className="stat-name">Total Bookings</span>
            </div>
            <div className="dash-stat-box highlight">
              <span className="stat-count">{upcomingAppointments.length}</span>
              <span className="stat-name">Upcoming</span>
            </div>
            <div className="dash-stat-box">
              <span className="stat-count">{appointmentHistory.length}</span>
              <span className="stat-name">Completed/Past</span>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs (Experiment 3b & 3e: Nested Routing) */}
        <div className="dashboard-tabs-bar">
          <nav className="dashboard-nav-tabs" aria-label="Patient Dashboard Tabs">
            <NavLink
              to="/patient/appointments"
              className={({ isActive }) => `dash-tab-link ${isActive ? "active" : ""}`}
            >
              <Calendar size={16} />
              <span>All Appointments</span>
              <span className="tab-counter">{appointmentCount}</span>
            </NavLink>

            <NavLink
              to="/patient/upcoming"
              className={({ isActive }) => `dash-tab-link ${isActive ? "active" : ""}`}
            >
              <Clock size={16} />
              <span>Upcoming</span>
              <span className="tab-counter">{upcomingAppointments.length}</span>
            </NavLink>

            <NavLink
              to="/patient/history"
              className={({ isActive }) => `dash-tab-link ${isActive ? "active" : ""}`}
            >
              <History size={16} />
              <span>History</span>
              <span className="tab-counter">{appointmentHistory.length}</span>
            </NavLink>

            <NavLink
              to="/patient/profile"
              className={({ isActive }) => `dash-tab-link ${isActive ? "active" : ""}`}
            >
              <User size={16} />
              <span>Patient Profile</span>
            </NavLink>
          </nav>

          <Link to="/book-appointment" className="btn-dash-new-booking">
            <PlusCircle size={16} />
            <span>Book New</span>
          </Link>
        </div>

        {/* Experiment 3f: Use Outlet to display nested patient dashboard components */}
        <main className="dashboard-nested-content" id="nested-dashboard-view">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;
