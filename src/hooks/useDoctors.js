// useDoctors.js
// Experiment 2a: Custom Hook to manage doctor data, search, specialty, availability, fee, and rating filtering

import { useState, useEffect, useMemo, useCallback } from "react";
import { api } from "../api/mockApi";

export const useDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and search states (Experiment 1b & 2a)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [minRating, setMinRating] = useState(0);
  const [maxFee, setMaxFee] = useState(1500);
  const [selectedDay, setSelectedDay] = useState("Any");

  // Load doctor information when application starts (Experiment 1c)
  useEffect(() => {
    let isMounted = true;
    const loadDoctors = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await api.getDoctors();
        if (isMounted) {
          setDoctors(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to fetch doctors");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDoctors();
    return () => {
      isMounted = false;
    };
  }, []);

  // useMemo hook to efficiently calculate filtered doctors (Experiment 1e, 2e)
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      // 1. Search Query (matches doctor name, specialty, or qualification)
      const matchesSearch =
        !searchQuery.trim() ||
        doc.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        doc.qualification.toLowerCase().includes(searchQuery.trim().toLowerCase());

      // 2. Specialty Filter
      const matchesSpecialty =
        selectedSpecialty === "All Specialties" || doc.specialty === selectedSpecialty;

      // 3. Rating Filter
      const matchesRating = Number(doc.rating) >= Number(minRating);

      // 4. Consultation Fee Filter
      const matchesFee = Number(doc.consultationFee) <= Number(maxFee);

      // 5. Available Day Filter
      const matchesDay = selectedDay === "Any" || doc.availableDays.includes(selectedDay);

      return matchesSearch && matchesSpecialty && matchesRating && matchesFee && matchesDay;
    });
  }, [doctors, searchQuery, selectedSpecialty, minRating, maxFee, selectedDay]);

  // Available doctors count (useMemo)
  const availableDoctorsCount = useMemo(() => filteredDoctors.length, [filteredDoctors]);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedSpecialty("All Specialties");
    setMinRating(0);
    setMaxFee(1500);
    setSelectedDay("Any");
  }, []);

  // Helper to fetch individual doctor
  const getDoctorById = useCallback(
    (id) => {
      return doctors.find((doc) => String(doc.id) === String(id)) || null;
    },
    [doctors]
  );

  return {
    doctors,
    filteredDoctors,
    availableDoctorsCount,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedSpecialty,
    setSelectedSpecialty,
    minRating,
    setMinRating,
    maxFee,
    setMaxFee,
    selectedDay,
    setSelectedDay,
    resetFilters,
    getDoctorById
  };
};
