import Link from "next/link";
import { PropertyPhoto } from "@/components/property/property-photo";
import { formatArea, formatUsd } from "@/lib/format";
import type { PropertySummary } from "@/lib/property-types";
import { cn } from "@/lib/utils";

function Flag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 14" aria-hidden="true" className={cn("h-3.5 w-3", className)}>
      <rect x="0.5" y="0" width="1.6" height="14" rx="0.6" fill="currentColor" />
      <path d="M2.6 1h8.2l-2 2.8 2 2.8H2.6z" fill="currentColor" />
    </svg>
  );
}
