// DoctorList.jsx
// Experiment 1a, 1d, 1e & 2h: Doctor directory with SearchBar (useRef), FilterPanel, and conditional rendering

import React from "react";
import { UserX, RefreshCcw } from "lucide-react";
import { useAppointmentContext } from "../context/AppointmentContext";
import SearchBar from "../components/doctor/SearchBar";
import FilterPanel from "../components/doctor/FilterPanel";
import DoctorCard from "../components/doctor/DoctorCard";
import Loading from "../components/common/Loading";
import Button from "../components/common/Button";

export const DoctorList = () => {
  const {
    filteredDoctors,
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
    availableDoctorsCount
  } = useAppointmentContext();

  return (
    <div className="doctor-list-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header-banner">
          <h1 className="page-title">Find Hospital Doctors & Specialists</h1>
          <p className="page-description">
            Search our directory of certified consultants, compare ratings and fees, and schedule an
            appointment online.
          </p>
        </div>

        {/* Experiment 1d: SearchBar with auto-focus using useRef */}
        <div className="search-section-wrap">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            autoFocus={true}
            placeholder="Search doctors by name, specialty (e.g. Cardiology), or qualification..."
          />
        </div>

        {/* Main Content Layout: Sidebar Filters + Doctor Cards Grid */}
        <div className="doctor-page-layout">
          <FilterPanel
            selectedSpecialty={selectedSpecialty}
            setSelectedSpecialty={setSelectedSpecialty}
            minRating={minRating}
            setMinRating={setMinRating}
            maxFee={maxFee}
            setMaxFee={setMaxFee}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            resetFilters={resetFilters}
            totalResults={availableDoctorsCount}
          />

          <main className="doctor-results-area" id="doctor-results">
            {/* Loading State */}
            {isLoading && <Loading message="Loading doctor directory from hospital database..." />}

            {/* Error State */}
            {error && (
              <div className="error-alert-box" role="alert">
                <p>Failed to load doctors: {error}</p>
                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            )}

            {/* Results Grid or Conditional Empty State */}
            {!isLoading && !error && (
              <>
                {filteredDoctors.length === 0 ? (
                  <div className="empty-state-card" role="status">
                    <div className="empty-icon-wrap">
                      <UserX size={44} />
                    </div>
                    {/* Experiment 2h exact requirement string */}
                    <h3 className="empty-title">No doctors available</h3>
                    <p className="empty-desc">
                      We couldn't find any medical specialists matching your active search and filter
                      criteria.
                    </p>
                    <Button variant="outline" icon={RefreshCcw} onClick={resetFilters}>
                      Reset All Filters
                    </Button>
                  </div>
                ) : (
                  <div className="doctor-grid">
                    {filteredDoctors.map((doctor) => (
                      <DoctorCard key={doctor.id} doctor={doctor} />
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DoctorList;
