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

/** The lot travels with the visitor through every step; it is never re-selected. */
export function SelectedLot({ property: p, compact }: { property: PropertySummary; compact?: boolean }) {
  return (
    <div
      className={cn("flex gap-4 rounded-md border border-line bg-surface", compact ? "items-center p-2.5" : "flex-col p-3")}
      data-testid="selected-lot"
    >
      <PropertyPhoto
        photo={p.photo}
        sizes={compact ? "72px" : "360px"}
        className={cn("shrink-0 rounded-sm", compact ? "size-[4.5rem]" : "aspect-[16/10] w-full")}
      />
      <div className={cn("min-w-0", !compact && "px-1 pb-1")}>
        <p className="flex items-center gap-2 leading-snug font-semibold">
          <Flag className="shrink-0 text-tajibo" />
          <span className="truncate">
            <span className="sr-only">Your selection: </span>
            {p.name}
            <span className="font-normal text-ink-2">, {p.lotLabel}</span>
          </span>
        </p>
        <p className="truncate pl-5 text-sm text-ink-3">
          {p.area}, Santa Cruz<span aria-hidden="true">&ensp;</span>
          {formatArea(p.areaSquareMeters)}
        </p>
        {!compact && (
          <>
            <p className="tabular mt-3 text-[0.9375rem]">
              <span className="plat text-lg font-semibold">{formatUsd(p.monthlyPriceFromUsd)}</span>
              <span className="text-ink-2">/mo, {formatUsd(p.totalPriceUsd)} total</span>
            </p>
            <Link
              href={`/properties/${p.slug}`}
              className="mt-3 inline-block text-sm font-medium text-ink-2 underline underline-offset-4 hover:text-ink"
            >
              Back to the lot
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
