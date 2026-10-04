"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { forwardRef } from "react";
import { PropertyPhoto } from "@/components/property/property-photo";
import { formatArea, formatUsd } from "@/lib/format";
import type { PropertySummary } from "@/lib/property-types";
import { cn } from "@/lib/utils";

type Props = {
  property: PropertySummary;
  selected: boolean;
  onHover: (id: string | null) => void;
  onShowOnMap: (id: string) => void;
  priority?: boolean;
};

/** A lot in the discovery list. The whole entry opens the property page. */
export const PropertyEntry = forwardRef<HTMLElement, Props>(function PropertyEntry(
  { property: p, selected, onHover, onShowOnMap, priority },
  ref,
) {
  const reserved = p.status === "RESERVED";
  return (
    <article
      ref={ref}
      data-testid="property-entry"
      data-slug={p.slug}
      aria-current={selected ? "true" : undefined}
      className="group relative"
      onMouseEnter={() => onHover(p.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(p.id)}
      onBlur={() => onHover(null)}
    >
      <div
        className={cn(
          "relative rounded-sm ring-offset-2 ring-offset-paper transition-shadow duration-200",
          selected && "ring-2 ring-tajibo",
        )}
      >
        <PropertyPhoto
          photo={p.photo}
          sizes="(min-width: 1536px) 22vw, (min-width: 1280px) 20vw, (min-width: 1024px) 38vw, 100vw"
          priority={priority}
          className="aspect-[3/2] rounded-sm"
          imgClassName="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
        />
        {reserved && (
          <span className="absolute top-2.5 left-2.5 rounded-xs bg-surface/95 px-2 py-0.5 text-[0.8125rem] font-medium text-ink-2">
            Reserved
          </span>
        )}
        <button
          type="button"
          onClick={() => onShowOnMap(p.id)}
          className="absolute top-2 right-2 z-10 grid size-9 place-items-center rounded-sm bg-surface/95 text-ink shadow-lift transition-colors hover:bg-white max-lg:hidden"
          aria-label={`Show ${p.name}, ${p.lotLabel} on the map`}
        >
          <MapPin className="size-[18px]" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3">
        <h3 className="text-[1.0625rem] leading-snug font-semibold">
          <Link
            href={`/properties/${p.slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-sm focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-monte"
          >
            {p.name}
            <span className="font-normal text-ink-2">, {p.lotLabel}</span>
          </Link>
        </h3>
        <p className="mt-0.5 flex justify-between gap-3 text-sm text-ink-3">
          <span>{p.area}, Santa Cruz</span>
          <span className="tabular">{formatArea(p.areaSquareMeters)}</span>
        </p>
        <p className="mt-2.5 flex items-baseline justify-between gap-3">
          <span>
            <span className="text-sm text-ink-2">From </span>
            <span className="plat text-xl font-semibold text-ink">{formatUsd(p.monthlyPriceFromUsd)}</span>
            <span className="text-sm text-ink-2">/mo</span>
          </span>
          <span className="tabular text-sm text-ink-2">{formatUsd(p.totalPriceUsd)} total</span>
        </p>
      </div>
    </article>
  );
});
