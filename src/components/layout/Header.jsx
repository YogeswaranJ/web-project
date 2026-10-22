// Header.jsx
// Experiment 1a & 3b: Reusable Header with NavLink navigation without reloading

import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  HeartPulse,
  Calendar,
  Users,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
  Bell,
  GraduationCap
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useAppointmentContext } from "../../context/AppointmentContext";

export const Header = ({ onOpenLabModal }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { reminders } = useAppointmentContext();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRemindersDropdown, setShowRemindersDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="site-header">
      {/* Top Academic Lab Banner */}
      <div className="academic-top-bar">
        <div className="container academic-bar-content">
          <div className="academic-badge-info">
            <GraduationCap size={15} />
            <span>
              <strong>Scenario 8:</strong> Hospital Appointment Booking Web Application (React Hooks, Router, Context, REST API)
            </span>
          </div>
          <button
            type="button"
            className="academic-btn-pill"
            onClick={onOpenLabModal}
            title="View Lab Experiments & Verification Checklist"
          >
            📋 Lab Manual Experiments (1-4)
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="main-header-nav">
        <div className="container header-content">
          {/* Hospital Logo */}
          <Link to="/" className="brand-logo" onClick={closeMobileMenu}>
            <div className="brand-icon-box">
              <HeartPulse size={24} className="brand-heart-icon" />
            </div>
            <div className="brand-text-box">
              <span className="brand-name">MediCare<span className="brand-accent">Plus</span></span>
              <span className="brand-sub">Multi-Specialty Hospital</span>
            </div>
          </Link>

          {/* Desktop Nav Links (NavLink with active states - Experiment 3b) */}
          <nav className="desktop-navigation" aria-label="Main navigation">
            <NavLink
              to="/"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/doctors"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              Find Doctors
            </NavLink>
            <NavLink
              to="/book-appointment"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              Book Appointment
            </NavLink>
            <NavLink
              to="/patient"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              Patient Dashboard
            </NavLink>
          </nav>

          {/* Right Header Actions: Reminders, Profile / Login */}
          <div className="header-right-actions">
            {/* Reminders Notification Bell (Experiment 2g) */}
            {isAuthenticated && (
              <div className="reminders-container">
                <button
                  type="button"
                  className="reminders-bell-btn"
                  onClick={() => setShowRemindersDropdown(!showRemindersDropdown)}
                  aria-label="View appointment reminders"
                >
                  <Bell size={19} />
                  {reminders.length > 0 && (
                    <span className="reminder-badge-count">{reminders.length}</span>
                  )}
                </button>

                {showRemindersDropdown && (
                  <div className="reminders-dropdown-card">
                    <div className="reminders-dropdown-header">
                      <h5>Appointment Reminders</h5>
                      <span className="badge-small">{reminders.length} Active</span>
                    </div>
                    <div className="reminders-dropdown-list">
                      {reminders.length === 0 ? (
                        <p className="no-reminders-text">No pending appointment reminders</p>
                      ) : (
                        reminders.map((rem) => (
                          <div key={rem.id} className="reminder-dropdown-item">
                            <Calendar size={14} className="rem-item-icon" />
                            <div>
                              <p className="rem-item-msg">{rem.message}</p>
                              <small className="rem-item-time">{rem.time}</small>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Auth Button or User Badge */}
            {isAuthenticated ? (
              <div className="user-profile-badge">
                <Link to="/patient/profile" className="user-info-chip">
                  <div className="user-avatar-circle">
                    <User size={15} />
                  </div>
                  <div className="user-names">
                    <span className="user-display-name">{user?.name}</span>
                    <span className="user-pid">{user?.id}</span>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn-logout"
                  title="Logout patient session"
                >
                  <LogOut size={16} />
                  <span className="logout-text">Logout</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-login-nav">
                <LogIn size={16} />
                <span>Patient Login</span>
              </Link>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={closeMobileMenu}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <span className="mobile-brand-title">MediCare Plus</span>
              <button
                type="button"
                onClick={closeMobileMenu}
                className="close-drawer-btn"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="mobile-drawer-nav">
              <NavLink to="/" onClick={closeMobileMenu} className="mobile-nav-link" end>
                Home
              </NavLink>
              <NavLink to="/doctors" onClick={closeMobileMenu} className="mobile-nav-link">
                Find Doctors
              </NavLink>
              <NavLink to="/book-appointment" onClick={closeMobileMenu} className="mobile-nav-link">
                Book Appointment
              </NavLink>
              <NavLink to="/patient" onClick={closeMobileMenu} className="mobile-nav-link">
                Patient Dashboard
              </NavLink>
              <NavLink to="/appointments" onClick={closeMobileMenu} className="mobile-nav-link">
                Appointments History
              </NavLink>
              <div className="mobile-drawer-divider"></div>
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    closeMobileMenu();
                    handleLogout();
                  }}
                  className="mobile-logout-btn"
                >
                  <LogOut size={16} /> Logout ({user?.name})
                </button>
              ) : (
                <Link to="/login" onClick={closeMobileMenu} className="mobile-login-btn">
                  <LogIn size={16} /> Patient Login
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
