// PatientUpcoming.jsx
// Experiment 3e: Nested route /patient/upcoming displaying upcoming appointments only

import React from "react";
import { Link } from "react-router-dom";
import { Clock, PlusCircle } from "lucide-react";
import { useAppointmentContext } from "../../context/AppointmentContext";
import AppointmentCard from "../../components/appointment/AppointmentCard";
import Button from "../../components/common/Button";

export const PatientUpcoming = () => {
  const { upcomingAppointments } = useAppointmentContext();

  return (
    <div className="patient-tab-content">
      <div className="tab-intro-bar">
        <h3>Upcoming Scheduled Consultations</h3>
        <p>Active appointments scheduled for upcoming dates and times.</p>
      </div>

      {/* Requirement 2h: Conditional rendering "No upcoming appointments" */}
      {upcomingAppointments.length === 0 ? (
        <div className="empty-tab-state" role="status">
          <Clock size={48} className="empty-state-icon" />
          <h3>No upcoming appointments</h3>
          <p>You have no active upcoming consultations scheduled with any doctor at this time.</p>
          <Link to="/book-appointment">
            <Button variant="primary" icon={PlusCircle}>
              Book an Appointment
            </Button>
          </Link>
        </div>
      ) : (
        <div className="appointments-cards-grid">
          {upcomingAppointments.map((apt) => (
            <AppointmentCard key={apt.id} appointment={apt} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientUpcoming;
