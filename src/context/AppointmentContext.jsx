// AppointmentContext.jsx
// Experiment 2c & 2d: Context API to share doctor & appointment information across all components without prop drilling

import React, { createContext, useContext } from "react";
import { useDoctors } from "../hooks/useDoctors";
import { useAppointments } from "../hooks/useAppointments";

const AppointmentContext = createContext(null);

export const AppointmentProvider = ({ children }) => {
  // Use custom hooks to isolate and reuse state logic (Experiment 2a & 2b)
  const doctorsState = useDoctors();
  const appointmentsState = useAppointments();

  const value = {
    // Doctor states & handlers
    ...doctorsState,
    // Appointment states & handlers
    ...appointmentsState
  };

  return <AppointmentContext.Provider value={value}>{children}</AppointmentContext.Provider>;
};

// Custom hook to consume the AppointmentContext
export const useAppointmentContext = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error("useAppointmentContext must be used within an AppointmentProvider");
  }
  return context;
};
