// AuthContext.jsx
// Experiment 4b: Context API to maintain patient authentication status and token management

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../api/mockApi";
import { INITIAL_PATIENT } from "../data/initialDoctors";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  // Load existing token and user on application mount (useEffect)
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem("medicare_auth_token");
        const storedUser = localStorage.getItem("medicare_auth_user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
          // Pre-populate with demo user so student / evaluator can test immediately or switch
          const defaultToken = "jwt_mock_demo_student_token";
          localStorage.setItem("medicare_auth_token", defaultToken);
          localStorage.setItem("medicare_auth_user", JSON.stringify(INITIAL_PATIENT));
          setToken(defaultToken);
          setUser(INITIAL_PATIENT);
        }
      } catch (err) {
        console.error("Auth initialization failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login action using useCallback
  const login = useCallback(async (identifier, password) => {
    setIsLoading(true);
    setAuthError("");
    try {
      const res = await api.login({ identifier, password });
      setToken(res.token);
      setUser(res.user);
      return { success: true, user: res.user };
    } catch (err) {
      setAuthError(err.message || "Failed to log in");
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout action using useCallback
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await api.logout();
      setToken(null);
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Profile update
  const updateProfile = useCallback((updatedData) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedData };
      localStorage.setItem("medicare_auth_user", JSON.stringify(merged));
      return merged;
    });
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    authError,
    setAuthError,
    login,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
