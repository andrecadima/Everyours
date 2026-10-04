"use client";

import { Popover } from "radix-ui";
import { Check, ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import {
  BUDGET_OPTIONS,
  SIZE_OPTIONS,
  applyFilters,
  isFiltered,
  type Filters,
} from "@/lib/filters";
import type { PropertySummary } from "@/lib/property-types";
import { cn } from "@/lib/utils";

type Option = { value: string; label: string };

function FilterMenu({
  label,
  options,
  value,
  onChange,
  countFor,
  floating,
}: {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  countFor: (value: string) => number;
  floating?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const active = value !== "any";
  const current = options.find((o) => o.value === value);
  const groupId = useId();

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        className={cn(
          "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-sm border px-3 text-sm font-medium transition-colors",
          active
            ? "border-monte bg-monte text-paper hover:bg-monte-deep"
            : "border-line-strong/50 bg-surface text-ink hover:border-ink-2",
          floating && !active && "border-transparent shadow-lift",
        )}
        aria-label={active ? `${label}: ${current?.label}` : label}
      >
        {active ? current?.label : label}
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          collisionPadding={12}
          className="z-50 w-64 rounded-md border border-line bg-surface p-1.5 shadow-float outline-none data-[state=open]:animate-rise"
        >
          <p id={groupId} className="px-2.5 pt-1.5 pb-1 text-sm font-semibold text-ink">
            {label}
          </p>
          <div role="radiogroup" aria-labelledby={groupId}>
            {options.map((option) => {
              const count = countFor(option.value);
              const checked = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  disabled={count === 0 && !checked}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-sm px-2.5 py-2.5 text-left text-[0.9375rem] transition-colors hover:bg-paper disabled:cursor-not-allowed disabled:opacity-45",
                    checked && "font-medium",
                  )}
                >
                  <Check className={cn("size-4 shrink-0 text-monte", !checked && "invisible")} aria-hidden="true" />
                  <span className="flex-1">{option.label}</span>
                  <span className="tabular text-sm text-ink-3">
                    {count} {count === 1 ? "lot" : "lots"}
                  </span>
                </button>
              );
            })}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
