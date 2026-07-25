import React from "react";

const Input = React.forwardRef(
  (
    {
      as: Component = "input",
      label,
      error,
      hint,
      required = false,
      disabled = false,
      size = "md",
      variant = "default",
      className = "",
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const inputId =
      props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-5 py-3 text-sm",
      lg: "px-6 py-4 text-base",
    };

    const variants = {
      default:
        "border border-white/10 bg-[rgba(15,17,21,0.92)] text-white shadow-sm",
      filled:
        "border-b-2 border-white/10 bg-[rgba(15,17,21,0.92)] text-white shadow-sm",
    };

    const dateInputClass =
      props.type === "date"
        ? "[&::-webkit-calendar-picker-indicator]{cursor:pointer;width:28px;height:28px;filter:saturate(0) brightness(3);accent-color:white;color:white}"
        : "";
    const baseClasses = `w-full rounded-[1.25rem] ${sizes[size]} ${variants[variant]} placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-brass focus:ring-2 focus:ring-brass/20 disabled:opacity-50 disabled:cursor-not-allowed ${error ? "border-danger focus:ring-danger/20" : ""} ${dateInputClass} ${className}`;

    const descriptionIds = [
      ariaDescribedBy,
      error && errorId,
      !error && hint && hintId,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-300"
          >
            {label}
            {required && <span className="text-danger ml-1">*</span>}
          </label>
        )}
        <Component
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={baseClasses}
          aria-label={ariaLabel}
          aria-describedby={descriptionIds || undefined}
          aria-invalid={!!error}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-xs text-danger mt-1">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="text-xs text-slate-500 mt-1">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export const TextArea = React.forwardRef(
  (
    {
      label,
      error,
      hint,
      required = false,
      disabled = false,
      rows = 4,
      className = "",
      ...props
    },
    ref,
  ) => {
    const textareaId =
      props.id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${textareaId}-error`;
    const hintId = `${textareaId}-hint`;

    const baseClasses = `w-full rounded-[1.25rem] px-5 py-3 border border-white/10 bg-slate-950/85 text-white placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-50 disabled:cursor-not-allowed resize-none ${error ? "border-danger focus:ring-danger/20" : ""} ${className}`;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-slate-300"
          >
            {label}
            {required && <span className="text-danger ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          className={baseClasses}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-xs text-danger mt-1">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="text-xs text-slate-500 mt-1">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

TextArea.displayName = "TextArea";

export const Select = React.forwardRef(
  (
    {
      label,
      options = [],
      error,
      hint,
      required = false,
      disabled = false,
      placeholder = "Select an option",
      className = "",
      ...props
    },
    ref,
  ) => {
    const selectId =
      props.id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${selectId}-error`;
    const hintId = `${selectId}-hint`;

    const baseClasses = `w-full rounded-[1.25rem] px-5 py-3 border border-white/10 bg-slate-950/85 text-white outline-none transition-all duration-200 focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-50 disabled:cursor-not-allowed ${error ? "border-danger focus:ring-danger/20" : ""} ${className}`;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-slate-300"
          >
            {label}
            {required && <span className="text-danger ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          className={baseClasses}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-slate-950 text-white"
            >
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={errorId} className="text-xs text-danger mt-1">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="text-xs text-slate-500 mt-1">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

export const Checkbox = React.forwardRef(
  (
    {
      label,
      error,
      required = false,
      disabled = false,
      className = "",
      ...props
    },
    ref,
  ) => {
    const checkboxId =
      props.id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${checkboxId}-error`;

    return (
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            disabled={disabled}
            className={`w-5 h-5 rounded-lg border-2 border-white/10 bg-slate-950 text-brass cursor-pointer focus:ring-2 focus:ring-brass focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            {...props}
          />
          {label && (
            <label
              htmlFor={checkboxId}
              className="text-sm font-medium text-slate-300 cursor-pointer select-none"
            >
              {label}
              {required && <span className="text-danger ml-1">*</span>}
            </label>
          )}
        </div>
        {error && (
          <p id={errorId} className="text-xs text-danger mt-1">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Input;
