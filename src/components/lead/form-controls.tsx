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

export const TextInput = forwardRef<HTMLInputElement, React.ComponentProps<"input">>(function TextInput(
  { className, ...props },
  ref,
) {
  return <input ref={ref} className={cn(inputClass, className)} {...props} />;
});

/** Radio options rendered as large, touch-friendly choices. */
export function ChoiceGroup({
  legend,
  name,
  options,
  value,
  onChange,
  error,
  optional,
  columns = 3,
}: {
  legend: string;
  name: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string;
  optional?: boolean;
  columns?: 2 | 3;
}) {
  const errorId = useId();
  return (
    <fieldset aria-describedby={error ? errorId : undefined}>
      <legend className="mb-2 flex w-full items-baseline justify-between text-[0.9375rem] font-medium">
        {legend}
        {optional && <span className="text-sm font-normal text-ink-3">Optional</span>}
      </legend>
      <div className={cn("grid gap-2", columns === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2")}>
        {options.map((option) => {
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                "relative flex min-h-12 cursor-pointer items-center gap-3 rounded-sm border px-3.5 py-2.5 text-[0.9375rem] transition-colors",
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-monte",
                checked
                  ? "border-monte bg-monte-soft font-medium text-monte-deep"
                  : "border-line-strong/70 bg-surface hover:border-ink-2",
                error && !checked && "border-danger/60",
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-[1.125rem] shrink-0 place-items-center rounded-full border-2",
                  checked ? "border-monte" : "border-line-strong",
                )}
              >
                {checked && <span className="size-2 rounded-full bg-monte" />}
              </span>
              {option.label}
            </label>
          );
        })}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}
