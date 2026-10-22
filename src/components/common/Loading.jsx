// Loading.jsx
// Experiment 4h: Reusable Loading Component with pulse heartbeat medical aesthetic

import React from "react";
import { Activity, Stethoscope } from "lucide-react";

export const Loading = ({
  message = "Loading hospital data...",
  fullPage = false,
  size = "md" // sm, md, lg
}) => {
  const containerClasses = fullPage ? "loading-fullscreen" : "loading-inline";

  return (
    <div className={`loading-wrapper ${containerClasses}`} role="status" aria-live="polite">
      <div className={`loading-spinner-box size-${size}`}>
        <div className="pulse-ring"></div>
        <div className="pulse-icon">
          <Activity className="heartbeat-icon" size={size === "sm" ? 20 : size === "lg" ? 36 : 28} />
        </div>
      </div>
      {message && <p className="loading-message-text">{message}</p>}
      <span className="sr-only">Loading, please wait...</span>
    </div>
  );
};

export default Loading;
