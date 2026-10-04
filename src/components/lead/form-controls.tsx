import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

export const inputClass =
  "block h-12 w-full rounded-sm border border-line-strong bg-surface px-3.5 text-base text-ink placeholder:text-ink-3 transition-[border-color,box-shadow] hover:border-ink-2 focus:border-monte focus:shadow-[0_0_0_3px_rgb(31_74_55/0.18)] focus:outline-none aria-[invalid=true]:border-danger aria-[invalid=true]:focus:shadow-[0_0_0_3px_rgb(179_38_30/0.15)]";

type FieldProps = {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: (ids: { id: string; describedBy: string | undefined; invalid: boolean }) => React.ReactNode;
  className?: string;
};

/** Label, control, hint, and error wired together for assistive tech. */
export function Field({ label, error, hint, optional, children, className }: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-[0.9375rem] font-medium text-ink">
        {label}
        {optional && <span className="text-sm font-normal text-ink-3">Optional</span>}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-sm text-ink-3">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
