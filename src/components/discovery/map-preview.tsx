"use client";

import Link from "next/link";
import { Scan, X } from "lucide-react";
import { PropertyPhoto } from "@/components/property/property-photo";
import { buttonClass } from "@/components/ui/button";
import type { MapControls } from "@/components/map/property-map";
import { formatArea, formatUsd } from "@/lib/format";
import type { PropertySummary } from "@/lib/property-types";

/** The concise preview that opens above a selected marker (desktop). */
export function MapPreview({ property: p, controls }: { property: PropertySummary; controls: MapControls }) {
  return (
    <div className="w-[300px] text-ink" data-testid="map-preview">
      <div className="relative">
        <PropertyPhoto photo={p.photo} sizes="300px" className="aspect-[16/9]" />
        <button
          type="button"
          onClick={controls.close}
          className="absolute top-2 right-2 grid size-8 place-items-center rounded-sm bg-surface/95 text-ink shadow-lift hover:bg-white"
          aria-label="Close preview"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
        {p.status === "RESERVED" && (
          <span className="absolute top-2.5 left-2.5 rounded-xs bg-surface/95 px-2 py-0.5 text-[0.8125rem] font-medium text-ink-2">
            Reserved
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="leading-snug font-semibold">
          {p.name}
          <span className="font-normal text-ink-2">, {p.lotLabel}</span>
        </p>
        <p className="mt-0.5 text-sm text-ink-3">
          {p.area}, Santa Cruz <span aria-hidden="true">&ensp;</span>
          <span className="tabular">{formatArea(p.areaSquareMeters)}</span>
        </p>
        <p className="mt-3 flex items-baseline justify-between">
          <span>
            <span className="plat text-[1.375rem] font-semibold">{formatUsd(p.monthlyPriceFromUsd)}</span>
            <span className="text-sm text-ink-2">/mo</span>
          </span>
          <span className="tabular text-sm text-ink-2">{formatUsd(p.totalPriceUsd)} total</span>
        </p>
        <div className="mt-4 flex gap-2">
          <Link href={`/properties/${p.slug}`} className={buttonClass({ size: "sm", className: "flex-1" })}>
            View property
          </Link>
          <button
            type="button"
            onClick={controls.zoomToLot}
            className={buttonClass({ variant: "secondary", size: "sm" })}
            title="Zoom in to see the lot outline"
          >
            <Scan className="size-4" aria-hidden="true" />
            To scale
          </button>
        </div>
      </div>
    </div>
  );
}
