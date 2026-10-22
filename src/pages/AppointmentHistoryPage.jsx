// AppointmentHistoryPage.jsx
// Experiment 1a, 3a: /appointments route displaying complete appointment history & status

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Search, PlusCircle, ArrowLeft, Filter } from "lucide-react";
import { useAppointmentContext } from "../context/AppointmentContext";
import AppointmentCard from "../components/appointment/AppointmentCard";
import Button from "../components/common/Button";

export const AppointmentHistoryPage = () => {
  const { appointments, appointmentCount, upcomingAppointments, appointmentHistory } =
    useAppointmentContext();

  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAppointments = appointments.filter((apt) => {
    const matchesFilter =
      activeFilter === "All"
        ? true
        : activeFilter === "Upcoming"
        ? apt.status === "Upcoming" || apt.status === "Rescheduled"
        : activeFilter === "History"
        ? apt.status === "Completed" || apt.status === "Cancelled"
        : apt.status === activeFilter;

    const matchesSearch =
      !searchTerm.trim() ||
      apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctorSpecialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="appointment-history-page">
      <div className="container">
        {/* Header */}
        <div className="page-header-flex">
          <div>
            <h1 className="page-title">Appointment History & Schedules</h1>
            <p className="page-description">
              Review and manage all hospital outpatient consultations, rescheduled slots, and
              prescriptions.
            </p>
          </div>
          <Link to="/book-appointment">
            <Button variant="primary" icon={PlusCircle}>
              Schedule New Appointment
            </Button>
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="history-controls-bar">
          <div className="history-search-input">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by Doctor, Specialty, or Appointment ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="history-filter-pills">
            {[
              { id: "All", label: "All Appointments", count: appointmentCount },
              { id: "Upcoming", label: "Upcoming", count: upcomingAppointments.length },
              { id: "History", label: "Past / Cancelled", count: appointmentHistory.length }
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                className={`filter-tab-pill ${activeFilter === f.id ? "active" : ""}`}
                onClick={() => setActiveFilter(f.id)}
              >
                <span>{f.label}</span>
                <span className="pill-count">{f.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* List of appointments or conditional message */}
        <div className="appointments-list-area">
          {filteredAppointments.length === 0 ? (
            <div className="empty-history-card" role="status">
              <Calendar size={52} className="empty-calendar-icon" />
              {/* Requirement 2h: "No appointments available" */}
              <h3>No appointments available</h3>
              <p>
                {searchTerm
                  ? "No appointments match your search criteria."
                  : "You do not have any appointments in this category."}
              </p>
              <Link to="/book-appointment">
                <Button variant="outline" icon={PlusCircle}>
                  Book Your First Consultation
                </Button>
              </Link>
            </div>
          ) : (
            <div className="history-cards-grid">
              {filteredAppointments.map((apt) => (
                <AppointmentCard key={apt.id} appointment={apt} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentHistoryPage;
