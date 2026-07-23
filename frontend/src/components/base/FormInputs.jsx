import React from "react";

const Input = React.forwardRef(
  (
    {
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
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-3 text-sm",
      lg: "px-5 py-4 text-base",
    };

    const variants = {
      default: "border border-cashmere-700 bg-black text-white",
      filled: "border-b-2 border-cashmere-700 bg-black text-white",
    };

    const baseClasses = `
    w-full rounded-3xl
    ${sizes[size]}
    ${variants[variant]}
    placeholder:text-slate-500
    outline-none transition-all duration-200
    focus:border-brass focus:ring-2 focus:ring-brass/20
    disabled:opacity-50 disabled:cursor-not-allowed
    ${error ? "border-red-500 focus:ring-red-500/20" : ""}
    ${className}
  `;

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
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
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
          <p id={errorId} className="text-xs text-red-500 mt-1">
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

    const baseClasses = `
    w-full rounded-2xl px-4 py-3
    border border-cashmere-700 bg-black text-white
    placeholder:text-slate-500
    outline-none transition-all duration-200
    focus:border-brass focus:ring-2 focus:ring-brass/20
    disabled:opacity-50 disabled:cursor-not-allowed
    resize-none
    ${error ? "border-red-500 focus:ring-red-500/20" : ""}
    ${className}
  `;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-slate-300"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
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
          <p id={errorId} className="text-xs text-red-500 mt-1">
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

    const baseClasses = `
    w-full rounded-3xl px-4 py-3
    border border-cashmere-700 bg-black text-white
    outline-none transition-all duration-200
    focus:border-brass focus:ring-2 focus:ring-brass/20
    disabled:opacity-50 disabled:cursor-not-allowed
    ${error ? "border-red-500 focus:ring-red-500/20" : ""}
    ${className}
  `;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-slate-300"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
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
              className="bg-heritage-900 text-white"
            >
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={errorId} className="text-xs text-red-500 mt-1">
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
            className={`w-5 h-5 rounded border-2 border-cashmere-700 bg-heritage-900 text-brass cursor-pointer
            focus:ring-2 focus:ring-brass focus:ring-offset-2 focus:ring-offset-cashmere-900
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}`}
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
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
        </div>
        {error && (
          <p id={errorId} className="text-xs text-red-500 mt-1">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Input;
