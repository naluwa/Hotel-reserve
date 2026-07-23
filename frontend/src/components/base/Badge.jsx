import React from "react";

export const Badge = ({
  children,
  variant = "default",
  size = "md",
  className = "",
}) => {
  const variants = {
    default: "bg-cashmere-700 text-slate-300 border border-cashmere-700",
    success: "bg-green-950/40 text-green-300 border border-green-800/40",
    warning: "bg-amber-950/40 text-amber-300 border border-amber-800/40",
    error: "bg-red-950/40 text-red-300 border border-red-800/40",
    info: "bg-slate-800 text-slate-300 border border-slate-700",
    brass: "bg-brass/15 text-brass border border-brass/30",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs font-medium uppercase tracking-wider",
    md: "px-2.5 py-1 text-xs font-semibold uppercase tracking-wider",
    lg: "px-3 py-1.5 text-sm font-semibold uppercase tracking-wider",
  };

  return (
    <span
      className={`inline-flex items-center rounded font-semibold ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export const Tag = ({
  label,
  onRemove,
  variant = "default",
  className = "",
}) => (
  <div
    className={`inline-flex items-center gap-2 rounded px-3 py-1 text-xs font-medium
      ${variant === "default" ? "bg-cashmere-700 text-slate-300 border border-cashmere-700" : ""}
      ${className}`}
  >
    <span>{label}</span>
    {onRemove && (
      <button
        type="button"
        onClick={onRemove}
        className="ml-1 text-slate-400 hover:text-white transition-colors"
        aria-label={`Remove ${label}`}
      >
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    )}
  </div>
);

export const StatusBadge = ({ status, className = "" }) => {
  const statusConfig = {
    active: { variant: "success", label: "Active" },
    inactive: { variant: "warning", label: "Inactive" },
    pending: { variant: "info", label: "Pending" },
    completed: { variant: "success", label: "Completed" },
    cancelled: { variant: "error", label: "Cancelled" },
    available: { variant: "success", label: "Available" },
    booked: { variant: "warning", label: "Booked" },
    maintenance: { variant: "error", label: "Maintenance" },
  };

  const config = statusConfig[status] || statusConfig.inactive;

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
};

export default Badge;
