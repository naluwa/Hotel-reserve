import React from "react";

const Card = React.forwardRef(
  (
    {
      children,
      className = "",
      variant = "default",
      hoverable = false,
      ...props
    },
    ref,
  ) => {
    const variants = {
      default:
        "border border-white/10 bg-slate-950/80 shadow-panel backdrop-blur-xl",
      elevated:
        "bg-slate-950/95 border border-white/10 shadow-card backdrop-blur-xl",
      ghost: "bg-transparent border border-white/10",
    };

    const baseClasses = `rounded-[1.75rem] p-6 ${variants[variant]} ${hoverable ? "transition-all duration-200 hover:-translate-y-1 hover:border-brass/30" : ""} ${className}`;

    return (
      <div ref={ref} className={baseClasses} {...props}>
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export const CardHeader = ({ children, className = "" }) => (
  <div className={`border-b border-white/10 pb-4 mb-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = "" }) => (
  <h3 className={`font-serif text-2xl text-white ${className}`}>{children}</h3>
);

export const CardDescription = ({ children, className = "" }) => (
  <p className={`text-sm text-slate-400 mt-1 ${className}`}>{children}</p>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={`space-y-4 ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = "" }) => (
  <div
    className={`border-t border-white/10 pt-4 mt-4 flex flex-wrap gap-3 ${className}`}
  >
    {children}
  </div>
);

export default Card;
