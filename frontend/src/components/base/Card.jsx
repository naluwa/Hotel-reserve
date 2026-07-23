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
      default: "border border-cashmere-700 bg-heritage-900",
      elevated: "bg-heritage-900 border border-cashmere-700",
      ghost: "bg-transparent border border-cashmere-700",
    };

    const baseClasses = `
    rounded-xl p-6
    ${variants[variant]}
    ${hoverable ? "transition-colors duration-150 hover:border-slate-600" : ""}
    ${className}
  `;

    return (
      <div ref={ref} className={baseClasses} {...props}>
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export const CardHeader = ({ children, className = "" }) => (
  <div className={`border-b border-cashmere-700 pb-4 mb-4 ${className}`}>
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
    className={`border-t border-cashmere-700 pt-4 mt-4 flex gap-3 ${className}`}
  >
    {children}
  </div>
);

export default Card;
