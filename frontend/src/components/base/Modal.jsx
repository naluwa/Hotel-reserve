import React, { useEffect, useRef } from "react";

const Modal = React.forwardRef(
  (
    {
      children,
      isOpen = false,
      onClose,
      title,
      description,
      size = "md",
      closeOnBackdropClick = true,
      className = "",
      ...props
    },
    ref,
  ) => {
    const modalRef = useRef(null);

    const sizes = {
      sm: "max-w-md",
      md: "max-w-4xl",
      lg: "max-w-6xl",
      full: "max-w-7xl",
    };

    useEffect(() => {
      const handleEscape = (e) => {
        if (e.key === "Escape" && isOpen && onClose) {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";
        modalRef.current?.focus();
      }

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
      if (closeOnBackdropClick && e.target === e.currentTarget && onClose) {
        onClose();
      }
    };

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        onClick={handleBackdropClick}
        role="presentation"
      >
        <div
          ref={ref || modalRef}
          className={`w-full ${sizes[size]} overflow-hidden rounded-[2rem] border border-cashmere-700 bg-cashmere-900 shadow-modal focus:outline-none ${className}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
          aria-describedby={description ? "modal-description" : undefined}
          {...props}
        >
          <div className="max-h-[90vh] overflow-y-auto">
            {title && (
              <div className="border-b border-cashmere-700 px-8 py-6">
                <h2 id="modal-title" className="font-serif text-3xl text-white">
                  {title}
                </h2>
                {description && (
                  <p id="modal-description" className="mt-2 text-slate-400">
                    {description}
                  </p>
                )}
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    );
  },
);

Modal.displayName = "Modal";

export const ModalContent = ({ children, className = "" }) => (
  <div className={`px-8 py-6 ${className}`}>{children}</div>
);

export const ModalFooter = ({ children, className = "" }) => (
  <div
    className={`border-t border-cashmere-700 px-8 py-6 flex gap-3 justify-end ${className}`}
  >
    {children}
  </div>
);

export default Modal;
