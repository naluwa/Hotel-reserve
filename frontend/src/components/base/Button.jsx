import React from "react";

const Button = React.forwardRef(
  (
    {
      children,
      className = "",
      variant = "primary",
      size = "md",
      disabled = false,
      loading = false,
      icon: Icon,
      iconPosition = "left",
      fullWidth = false,
      type = "button",
      "aria-label": ariaLabel,
      "aria-busy": ariaBusy,
      "aria-disabled": ariaDisabled,
      ...props
    },
    ref,
  ) => {
    const variants = {
      primary: "bg-brass text-heritage-900 hover:bg-brass-light",
      secondary: "bg-cashmere-700 text-white hover:bg-cashmere-600",
      outline:
        "border border-cashmere-700 text-slate-300 hover:border-brass hover:text-brass",
      danger: "bg-red-600 text-white hover:bg-red-700",
      ghost: "text-slate-300 hover:text-white",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
    };

    const baseClasses = `
    inline-flex items-center justify-center
    rounded-3xl font-bold uppercase tracking-[0.05em]
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-brass focus:ring-offset-2 focus:ring-offset-cashmere-900
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `;

    const containerClasses = "inline-flex items-center justify-center gap-2";

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={baseClasses}
        aria-label={ariaLabel}
        aria-busy={ariaBusy || loading}
        aria-disabled={ariaDisabled || disabled}
        {...props}
      >
        <span className={containerClasses}>
          {Icon && iconPosition === "left" && !loading && (
            <Icon className="w-4 h-4" aria-hidden="true" />
          )}
          {loading && (
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          <span>{children}</span>
          {Icon && iconPosition === "right" && !loading && (
            <Icon className="w-4 h-4" aria-hidden="true" />
          )}
        </span>
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
