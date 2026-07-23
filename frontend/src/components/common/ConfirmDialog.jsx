import { Button } from "../base";

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-[2rem] border border-cashmere-700 bg-cashmere-900 p-8 shadow-modal">
        <div className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-brass">
              Confirmation required
            </p>
            <h2 className="mt-3 text-3xl font-serif text-white">{title}</h2>
            <p className="mt-3 text-slate-400">{description}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="w-full sm:w-auto"
            >
              {cancelLabel}
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={onConfirm}
              className="w-full sm:w-auto"
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
