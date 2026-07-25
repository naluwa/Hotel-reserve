import { useEffect } from "react";

const CFG = {
  SUCCESS: { bar: "bg-success", text: "text-white", label: "Success" },
  ERROR: { bar: "bg-danger", text: "text-white", label: "Error" },
  WARNING: { bar: "bg-warning", text: "text-white", label: "Warning" },
  INFO: { bar: "bg-brass", text: "text-white", label: "Info" },
};

export default ({ message, type, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 4500);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;
  const c = CFG[type] || CFG.INFO;

  return (
    <div
      onClick={onClose}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-sm cursor-pointer bg-cashmere-900 border border-cashmere-700 p-4 shadow-modal"
    >
      <div className={`absolute top-0 left-0 w-full h-0.5 ${c.bar}`} />
      <span
        className={`text-[9px] font-bold uppercase tracking-widest ${c.text}`}
      >
        {c.label}
      </span>
      <p className="text-sm text-slate-200 mt-1">{message}</p>
    </div>
  );
};
