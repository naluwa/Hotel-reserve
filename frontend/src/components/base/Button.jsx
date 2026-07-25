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
      primary:
        "bg-brass text-heritage-950 shadow-[0_24px_60px_rgba(255,209,102,0.24)] hover:bg-brass-light hover:-translate-y-0.5 hover:shadow-[0_28px_85px_rgba(255,209,102,0.28)]",
      secondary:
        "bg-white/10 text-white border border-white/15 shadow-panel hover:bg-white/20 hover:text-white",
      outline:
        "border border-white/30 bg-white/5 text-white hover:border-brass/70 hover:bg-brass/10 hover:text-white",
      danger:
        "bg-danger text-white shadow-[0_18px_38px_rgba(239,68,68,0.18)] hover:bg-danger-dark",
      ghost:
        "bg-transparent text-slate-200 hover:text-white hover:bg-white/10 focus-visible:ring-white/40",
    };

    const sizes = {
      sm: "px-4 py-2 text-xs",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
    };

    const baseClasses = `inline-flex items-center justify-center rounded-full font-semibold uppercase tracking-[0.08em] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brass focus:ring-offset-2 focus:ring-offset-slate-950 ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`;
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
            <Icon className="h-4 w-4" aria-hidden="true" />
          )}
          {loading ? (
            <svg
              className="h-4 w-4 animate-spin"
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
          ) : (
            <span>{children}</span>
          )}
          {Icon && iconPosition === "right" && !loading && (
            <Icon className="h-4 w-4" aria-hidden="true" />
          )}
        </span>
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
