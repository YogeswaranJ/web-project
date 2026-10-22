// Login.jsx
// Experiment 4a, 4d, 4e, 4f: Controlled Login component with form validation and redirect

import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  LogIn,
  Mail,
  Lock,
  HeartPulse,
  AlertCircle,
  CheckCircle2,
  Key,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  // The page user originally intended to visit before being redirected
  const redirectPath = location.state?.from?.pathname || "/patient";

  const [identifier, setIdentifier] = useState("PID-2024-8841");
  const [password, setPassword] = useState("password123");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // Validation function (Experiment 4f)
  const validateForm = () => {
    const errs = {};

    // Required validation
    if (!identifier.trim()) {
      errs.identifier = "Patient ID or Registered Email is required.";
    } else {
      const isEmail = identifier.includes("@");
      if (isEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(identifier.trim())) {
          errs.identifier = "Please enter a valid email address.";
        }
      } else if (!identifier.trim().startsWith("PID-")) {
        errs.identifier = "Patient ID must start with 'PID-' (e.g. PID-2024-8841).";
      }
    }

    // Password validation (required and length >= 6)
    if (!password) {
      errs.password = "Password is required.";
    } else if (password.length < 6) {
      errs.password = "Password must be at least 6 characters in length.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) return;

    setIsSubmitting(true);
    const result = await login(identifier.trim(), password);
    setIsSubmitting(false);

    if (result.success) {
      // Experiment 4e: After successful login, redirect the patient to the requested protected page
      navigate(redirectPath, { replace: true });
    } else {
      setServerError(result.error || "Authentication failed. Please verify your credentials.");
    }
  };

  const handleQuickDemoFill = (type) => {
    if (type === "pid") {
      setIdentifier("PID-2024-8841");
      setPassword("password123");
    } else {
      setIdentifier("rahul.verma@example.com");
      setPassword("password123");
    }
    setErrors({});
    setServerError("");
  };

  return (
    <div className="login-page">
      <div className="container login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-brand-icon">
              <HeartPulse size={30} />
            </div>
            <h1 className="login-title">Patient Portal Login</h1>
            <p className="login-sub">
              Access your hospital appointments, prescriptions, and medical records securely.
            </p>
          </div>

          {/* Quick Demo Credentials Banner */}
          <div className="demo-credentials-box">
            <div className="demo-creds-title">
              <Key size={14} />
              <span>Academic Assessment Quick Login:</span>
            </div>
            <div className="demo-btn-group">
              <button
                type="button"
                className="btn-demo-pill"
                onClick={() => handleQuickDemoFill("pid")}
              >
                Use Patient ID (PID-2024-8841)
              </button>
              <button
                type="button"
                className="btn-demo-pill"
                onClick={() => handleQuickDemoFill("email")}
              >
                Use Email (rahul.verma@example.com)
              </button>
            </div>
          </div>

          {serverError && (
            <div className="login-alert-banner danger" role="alert">
              <AlertCircle size={16} />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {/* Controlled Identifier Input */}
            <Input
              label="Patient ID or Registered Email"
              id="login-identifier"
              name="identifier"
              type="text"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (errors.identifier) setErrors({ ...errors, identifier: "" });
              }}
              placeholder="PID-2024-8841 or patient@example.com"
              required
              error={errors.identifier}
              icon={Mail}
              autoComplete="username"
            />

            {/* Controlled Password Input */}
            <Input
              label="Password"
              id="login-password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
              placeholder="••••••••"
              required
              error={errors.password}
              icon={Lock}
              autoComplete="current-password"
            />

            <div className="login-meta-row">
              <label className="remember-me-checkbox">
                <input type="checkbox" defaultChecked />
                <span>Remember patient session</span>
              </label>
              <a
                href="#forgot"
                className="forgot-password-link"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Demo: Password reset instructions sent to registered mobile & email.");
                }}
              >
                Forgot Password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={LogIn}
              className="btn-submit-login"
              isLoading={isSubmitting}
            >
              Sign In to Patient Portal
            </Button>
          </form>

          <div className="login-footer-security">
            <ShieldCheck size={16} />
            <span>256-Bit SSL Encrypted Healthcare Portal</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
