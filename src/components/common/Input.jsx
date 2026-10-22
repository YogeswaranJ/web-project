// Input.jsx
// Experiment 4h: Reusable Controlled Input Component with validation states, labels, and accessible error messages

import React, { forwardRef } from "react";

export const Input = forwardRef(
  (
    {
      label,
      id,
      name,
      type = "text",
      value,
      onChange,
      onBlur,
      placeholder,
      error = "",
      helperText = "",
      required = false,
      disabled = false,
      icon: Icon = null,
      className = "",
      autoComplete,
      min,
      max,
      ...props
    },
    ref
  ) => {
    const inputId = id || name || `input-${Math.random().toString(36).substring(2, 9)}`;
    const errorId = `${inputId}-error`;

    return (
      <div className={`input-group-container ${error ? "has-error" : ""} ${className}`}>
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
            {required && <span className="input-required-mark">*</span>}
          </label>
        )}

        <div className="input-wrapper">
          {Icon && (
            <span className="input-icon-slot">
              <Icon size={18} />
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            autoComplete={autoComplete}
            min={min}
            max={max}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? errorId : undefined}
            className={`input-field ${Icon ? "has-icon" : ""}`}
            {...props}
          />
        </div>

        {error ? (
          <p id={errorId} className="input-error-text" role="alert">
            {error}
          </p>
        ) : helperText ? (
          <p className="input-helper-text">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
