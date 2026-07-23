import React from "react";

export const Loading = ({ message = "Loading...", fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <svg
        className="w-12 h-12 animate-spin text-brass"
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
      <p className="text-slate-300">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        {content}
      </div>
    );
  }

  return <div className="py-12">{content}</div>;
};

export const Skeleton = ({ count = 1, className = "" }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className={`bg-cashmere-700 animate-pulse rounded-2xl ${className}`}
      />
    ))}
  </>
);

export const LoadingState = ({
  title = "Loading your stay options",
  description = "We’re preparing the latest rooms and availability for you.",
  cards = 3,
  className = "",
}) => (
  <div className={`space-y-6 ${className}`}>
    <div className="rounded-[2rem] border border-cashmere-700 bg-cashmere-900/80 p-6 shadow-card">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-4 h-8 w-3/4" />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-2/3" />
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>

    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: cards }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[2rem] border border-cashmere-700 bg-cashmere-900"
        >
          <Skeleton className="h-44 w-full rounded-none" />
          <div className="space-y-3 p-6">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  actionLabel = "Get started",
  className = "",
}) => (
  <div
    className={`flex flex-col items-center justify-center rounded-[2rem] border border-brass-subtle bg-cashmere-900/80 px-8 py-16 text-center shadow-card ${className}`}
  >
    {Icon && (
      <div className="mb-5 rounded-full border border-brass-subtle bg-brass/10 p-4 text-brass">
        <Icon className="h-10 w-10" aria-hidden="true" />
      </div>
    )}
    <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
    {description && (
      <p className="mb-6 max-w-lg text-sm leading-6 text-slate-400">
        {description}
      </p>
    )}
    {action && (
      <button
        onClick={action}
        className="rounded-full bg-brass px-6 py-3 text-sm font-semibold uppercase tracking-[0.26em] text-heritage-900 transition-all hover:bg-brass-light"
        aria-label={actionLabel}
      >
        {actionLabel}
      </button>
    )}
  </div>
);

export const ErrorState = ({
  title = "Something went wrong",
  message,
  details,
  onRetry,
  retryLabel = "Try again",
  className = "",
}) => (
  <div
    className={`rounded-[1.6rem] border-2 border-red-600/50 bg-red-900/10 p-6 ${className}`}
  >
    <div className="flex items-start gap-4">
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600/20 flex items-center justify-center"
        aria-hidden="true"
      >
        <svg
          className="w-5 h-5 text-red-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        {message && <p className="mt-1 text-sm text-red-200">{message}</p>}
        {details && (
          <pre className="mt-3 text-xs bg-black/30 p-3 rounded-lg overflow-auto max-h-32 text-red-100">
            {details}
          </pre>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-full hover:bg-red-700 transition-all"
            aria-label={retryLabel}
          >
            {retryLabel}
          </button>
        )}
      </div>
    </div>
  </div>
);

export const Alert = ({
  variant = "info",
  title,
  message,
  onClose,
  action,
  actionLabel,
  className = "",
}) => {
  const variants = {
    info: {
      border: "border-cashmere-700",
      bg: "bg-cashmere-900",
      text: "text-slate-300",
      icon: (
        <svg className="w-5 h-5 text-brass" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    success: {
      border: "border-green-800/40",
      bg: "bg-green-950/30",
      text: "text-green-300",
      icon: (
        <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    warning: {
      border: "border-amber-800/40",
      bg: "bg-amber-950/30",
      text: "text-amber-300",
      icon: (
        <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    error: {
      border: "border-red-800/40",
      bg: "bg-red-950/30",
      text: "text-red-300",
      icon: (
        <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
  };

  const config = variants[variant] || variants.info;

  return (
    <div
      className={`rounded-xl border ${config.border} ${config.bg} p-4 ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 mt-0.5" aria-hidden="true">
          {config.icon}
        </span>
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={`font-semibold text-white ${config.text}`}>
              {title}
            </h4>
          )}
          {message && (
            <p className={`text-sm ${config.text} ${title ? "mt-1" : ""}`}>
              {message}
            </p>
          )}
          {action && (
            <button
              onClick={action}
              className={`text-sm font-semibold mt-3 underline hover:no-underline ${config.text}`}
            >
              {actionLabel}
            </button>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 text-slate-500 hover:text-slate-300"
            aria-label="Close alert"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export const LoadingOverlay = ({ isLoading, message = "Processing..." }) => {
  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 rounded-lg">
      <div className="flex flex-col items-center gap-3">
        <svg
          className="w-8 h-8 animate-spin text-brass"
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
        <p className="text-white text-sm">{message}</p>
      </div>
    </div>
  );
};

export const Spinner = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <svg
      className={`animate-spin text-brass ${sizes[size]} ${className}`}
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
  );
};
