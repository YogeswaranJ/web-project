// PatientAppointments.jsx
// Experiment 3e: Nested route /patient/appointments displaying all patient appointments

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Search, Filter, PlusCircle, AlertCircle } from "lucide-react";
import { useAppointmentContext } from "../../context/AppointmentContext";
import AppointmentCard from "../../components/appointment/AppointmentCard";
import Button from "../../components/common/Button";

export const PatientAppointments = () => {
  const { appointments, isLoading, error } = useAppointmentContext();
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = appointments.filter((apt) => {
    const matchesStatus = statusFilter === "All" || apt.status === statusFilter;
    const matchesSearch =
      !searchTerm.trim() ||
      apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctorSpecialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="patient-tab-content">
      <div className="tab-actions-row">
        {/* Search */}
        <div className="tab-search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by doctor, specialty, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Pills */}
        <div className="tab-filters-pills">
          {["All", "Upcoming", "Rescheduled", "Completed", "Cancelled"].map((st) => (
            <button
              key={st}
              type="button"
              className={`filter-pill ${statusFilter === st ? "active" : ""}`}
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Experiment 2h Conditional Rendering: "No appointments available" */}
      {filtered.length === 0 ? (
        <div className="empty-tab-state" role="status">
          <Calendar size={48} className="empty-state-icon" />
          <h3>No appointments available</h3>
          <p>
            {searchTerm || statusFilter !== "All"
              ? "No scheduled appointments matched your current search filters."
              : "You do not have any appointments on record yet."}
          </p>
          <Link to="/book-appointment">
            <Button variant="primary" icon={PlusCircle}>
              Schedule an Appointment
            </Button>
          </Link>
        </div>
      ) : (
        <div className="appointments-cards-grid">
          {filtered.map((apt) => (
            <AppointmentCard key={apt.id} appointment={apt} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;
