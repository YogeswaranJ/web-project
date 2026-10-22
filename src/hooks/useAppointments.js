// useAppointments.js
// Experiment 2b: Custom hook to manage appointments, appointment dates, time slots, booking status, rescheduling, and cancellation

import { useState, useEffect, useMemo, useCallback } from "react";
import { api } from "../api/mockApi";
import { useAuth } from "../context/AuthContext";

export const useAppointments = () => {
  const { token, user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [patientDetails, setPatientDetails] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    patientId: user?.id || "",
    symptoms: "",
    notes: ""
  });
  const [bookingStatus, setBookingStatus] = useState("idle"); // idle, loading, success, error
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reminders, setReminders] = useState([]);

  // Sync patientDetails when user changes
  useEffect(() => {
    if (user) {
      setPatientDetails((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
        patientId: prev.patientId || user.id || ""
      }));
    }
  }, [user]);

  // Load appointments from API / localStorage on start and token change
  useEffect(() => {
    let isMounted = true;
    const fetchAppointments = async () => {
      if (!token) return;
      try {
        setIsLoading(true);
        setError(null);
        const data = await api.getAppointments(token);
        if (isMounted) {
          setAppointments(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load appointments");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchAppointments();
    return () => {
      isMounted = false;
    };
  }, [token]);

  // Experiment 2g: Use useEffect to synchronize appointment information with browser storage & update appointment reminders
  useEffect(() => {
    if (appointments.length > 0) {
      localStorage.setItem("medicare_appointments_db", JSON.stringify(appointments));

      // Calculate upcoming reminders (appointments scheduled within the next 48 hours)
      const now = new Date();
      const upcomingReminders = appointments
        .filter((apt) => apt.status === "Upcoming" || apt.status === "Rescheduled")
        .filter((apt) => {
          const aptDate = new Date(`${apt.appointmentDate} ${apt.timeSlot}`);
          const diffHours = (aptDate - now) / (1000 * 60 * 60);
          return diffHours > -2 && diffHours < 48; // within 48h
        })
        .map((apt) => ({
          id: apt.id,
          doctorName: apt.doctorName,
          date: apt.appointmentDate,
          time: apt.timeSlot,
          message: `Reminder: You have an appointment with ${apt.doctorName} on ${apt.appointmentDate} at ${apt.timeSlot}`
        }));

      setReminders(upcomingReminders);
    }
  }, [appointments]);

  // Update available slots dynamically when selectedDoctor or appointmentDate changes (Experiment 1c & 2b)
  useEffect(() => {
    let isMounted = true;
    const loadSlots = async () => {
      if (selectedDoctor && appointmentDate) {
        try {
          const slots = await api.getAvailableSlots(selectedDoctor.id, appointmentDate);
          if (isMounted) {
            setAvailableSlots(slots);
          }
        } catch {
          // Fallback to doctor's configured time slots
          if (isMounted && selectedDoctor.availableTimeSlots) {
            setAvailableSlots(
              selectedDoctor.availableTimeSlots.map((slot) => ({
                slot,
                isBooked: false
              }))
            );
          }
        }
      } else if (selectedDoctor) {
        // Just show default doctor slots
        setAvailableSlots(
          (selectedDoctor.availableTimeSlots || []).map((slot) => ({
            slot,
            isBooked: false
          }))
        );
      } else {
        setAvailableSlots([]);
      }
    };

    loadSlots();
    return () => {
      isMounted = false;
    };
  }, [selectedDoctor, appointmentDate]);

  // ==========================================
  // useMemo Calculations (Experiment 1e & 2e)
  // ==========================================

  // Total Appointment Count
  const appointmentCount = useMemo(() => appointments.length, [appointments]);

  // Upcoming appointments (filtered & sorted)
  const upcomingAppointments = useMemo(() => {
    return appointments.filter(
      (apt) => apt.status === "Upcoming" || apt.status === "Rescheduled"
    );
  }, [appointments]);

  // Appointment history (completed or cancelled appointments)
  const appointmentHistory = useMemo(() => {
    return appointments.filter(
      (apt) => apt.status === "Completed" || apt.status === "Cancelled"
    );
  }, [appointments]);

  // Available time slots calculation
  const computedAvailableSlots = useMemo(() => {
    return availableSlots.filter((s) => !s.isBooked);
  }, [availableSlots]);

  // Estimated appointment duration based on doctor specialty
  const appointmentDuration = useMemo(() => {
    if (!selectedDoctor) return "30 mins";
    if (selectedDoctor.specialty === "Cardiology" || selectedDoctor.specialty === "Neurology") {
      return "45 mins";
    }
    return "30 mins";
  }, [selectedDoctor]);

  // Appointment summary calculation
  const appointmentSummary = useMemo(() => {
    if (!selectedDoctor) return null;
    return {
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      hospital: selectedDoctor.hospital,
      consultationFee: selectedDoctor.consultationFee,
      appointmentDate: appointmentDate || "Not Selected",
      timeSlot: selectedTimeSlot || "Not Selected",
      duration: appointmentDuration,
      patientName: patientDetails.name || "Not Entered",
      patientEmail: patientDetails.email || "Not Entered",
      patientPhone: patientDetails.phone || "Not Entered"
    };
  }, [selectedDoctor, appointmentDate, selectedTimeSlot, appointmentDuration, patientDetails]);

  // ==========================================
  // useCallback Operations (Experiment 1f & 2f)
  // ==========================================

  // Select Doctor
  const selectDoctor = useCallback((doctor) => {
    setSelectedDoctor(doctor);
    setSelectedTimeSlot("");
  }, []);

  // Select Time Slot
  const selectTimeSlot = useCallback((slot) => {
    setSelectedTimeSlot(slot);
  }, []);

  // Clear / Reset Current Appointment flow
  const clearAppointment = useCallback(() => {
    setSelectedDoctor(null);
    setAppointmentDate("");
    setSelectedTimeSlot("");
    setBookingStatus("idle");
    setStatusMessage("");
  }, []);

  // Book Appointment
  const bookAppointment = useCallback(
    async (overrideData = null) => {
      setBookingStatus("loading");
      setStatusMessage("");
      try {
        const payload = overrideData || {
          doctorId: selectedDoctor?.id,
          doctorName: selectedDoctor?.name,
          doctorSpecialty: selectedDoctor?.specialty,
          doctorHospital: selectedDoctor?.hospital,
          doctorFee: selectedDoctor?.consultationFee,
          patientName: patientDetails.name,
          patientEmail: patientDetails.email,
          patientPhone: patientDetails.phone,
          patientId: patientDetails.patientId,
          symptoms: patientDetails.symptoms,
          appointmentDate,
          timeSlot: selectedTimeSlot,
          duration: appointmentDuration
        };

        const newApt = await api.createAppointment(payload, token);
        setAppointments((prev) => [newApt, ...prev]);
        setBookingStatus("success");
        setStatusMessage("Appointment booked successfully!");
        return { success: true, appointment: newApt };
      } catch (err) {
        setBookingStatus("error");
        setStatusMessage(err.message || "Failed to book appointment");
        return { success: false, error: err.message };
      }
    },
    [
      selectedDoctor,
      patientDetails,
      appointmentDate,
      selectedTimeSlot,
      appointmentDuration,
      token
    ]
  );

  // Reschedule Appointment
  const rescheduleAppointment = useCallback(
    async (id, newDate, newSlot) => {
      setIsLoading(true);
      try {
        const updated = await api.rescheduleAppointment(
          id,
          { appointmentDate: newDate, timeSlot: newSlot },
          token
        );
        setAppointments((prev) =>
          prev.map((apt) => (String(apt.id) === String(id) ? updated : apt))
        );
        setStatusMessage("Appointment rescheduled successfully!");
        return { success: true, appointment: updated };
      } catch (err) {
        setError(err.message || "Failed to reschedule appointment");
        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  // Cancel Appointment
  const cancelAppointment = useCallback(
    async (id) => {
      setIsLoading(true);
      try {
        const cancelled = await api.cancelAppointment(id, token);
        setAppointments((prev) =>
          prev.map((apt) => (String(apt.id) === String(id) ? cancelled : apt))
        );
        // Requirement 2h: "Appointment cancelled"
        setStatusMessage("Appointment cancelled");
        return { success: true, appointment: cancelled };
      } catch (err) {
        setError(err.message || "Failed to cancel appointment");
        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  return {
    appointments,
    selectedDoctor,
    setSelectedDoctor,
    selectDoctor,
    appointmentDate,
    setAppointmentDate,
    selectedTimeSlot,
    setSelectedTimeSlot,
    selectTimeSlot,
    availableSlots,
    computedAvailableSlots,
    patientDetails,
    setPatientDetails,
    bookingStatus,
    setBookingStatus,
    statusMessage,
    isLoading,
    error,
    reminders,
    appointmentCount,
    upcomingAppointments,
    appointmentHistory,
    appointmentDuration,
    appointmentSummary,
    bookAppointment,
    rescheduleAppointment,
    cancelAppointment,
    clearAppointment
  };
};
