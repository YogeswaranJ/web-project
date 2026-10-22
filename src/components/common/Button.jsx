// Button.jsx
// Experiment 4h: Reusable Button Component with multiple variants, loading states, and accessible states

import React from "react";
import { Loader2 } from "lucide-react";

export const Button = ({
  children,
  variant = "primary", // 'primary', 'secondary', 'outline', 'danger', 'ghost', 'success'
  size = "md", // 'sm', 'md', 'lg'
  isLoading = false,
  disabled = false,
  icon: Icon = null,
  iconPosition = "left",
  type = "button",
  onClick,
  className = "",
  id,
  ...props
}) => {
  const baseClasses = "btn";
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const loadingClass = isLoading ? "btn-loading" : "";

  return (
    <button
      id={id}
      type={type}
      className={`${baseClasses} ${variantClass} ${sizeClass} ${loadingClass} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading && <Loader2 className="btn-spinner" size={size === "sm" ? 14 : 18} />}
      {!isLoading && Icon && iconPosition === "left" && (
        <Icon className="btn-icon" size={size === "sm" ? 14 : 18} />
      )}
      <span>{children}</span>
      {!isLoading && Icon && iconPosition === "right" && (
        <Icon className="btn-icon" size={size === "sm" ? 14 : 18} />
      )}
    </button>
  );
};

export default Button;
