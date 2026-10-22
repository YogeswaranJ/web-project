// PatientHistory.jsx
// Experiment 3e: Nested route /patient/history displaying past completed and cancelled appointments

import React from "react";
import { History, Calendar } from "lucide-react";
import { useAppointmentContext } from "../../context/AppointmentContext";
import AppointmentCard from "../../components/appointment/AppointmentCard";

export const PatientHistory = () => {
  const { appointmentHistory } = useAppointmentContext();

  return (
    <div className="patient-tab-content">
      <div className="tab-intro-bar">
        <h3>Past Appointment History</h3>
        <p>Review completed medical consultations and previous cancellations.</p>
      </div>

      {/* Requirement 2h: Conditional rendering "No appointments available" */}
      {appointmentHistory.length === 0 ? (
        <div className="empty-tab-state" role="status">
          <History size={48} className="empty-state-icon" />
          <h3>No appointments available</h3>
          <p>You do not have any past completed or cancelled appointments in your clinical history.</p>
        </div>
      ) : (
        <div className="appointments-cards-grid">
          {appointmentHistory.map((apt) => (
            <AppointmentCard key={apt.id} appointment={apt} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientHistory;
