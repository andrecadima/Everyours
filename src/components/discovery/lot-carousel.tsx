"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { PropertyPhoto } from "@/components/property/property-photo";
import { formatArea, formatUsd } from "@/lib/format";
import type { PropertySummary } from "@/lib/property-types";
import { cn } from "@/lib/utils";

/**
 * Mobile/tablet: lots as a snap carousel over the map. The centred card is the
 * selection; tapping a marker scrolls its card into the centre.
 */
export function LotCarousel({
  properties,
  selectedId,
  onSettle,
}: {
  properties: PropertySummary[];
  selectedId: string | null;
  onSettle: (id: string) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const programmatic = useRef(false);
  const latest = useRef({ selectedId, onSettle });
  useEffect(() => {
    latest.current = { selectedId, onSettle };
  });

  // Follow selections made on the map.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !selectedId) return;
    const card = track.querySelector<HTMLElement>(`[data-id="${selectedId}"]`);
    if (!card) return;
    const target = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2;
    if (Math.abs(track.scrollLeft - target) < 4) return;
    programmatic.current = true;
    track.scrollTo({ left: target, behavior: "smooth" });
  }, [selectedId]);

  // When a swipe settles, the centred card becomes the selection.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let timer = 0;
    const settle = () => {
      if (programmatic.current) {
        programmatic.current = false;
        return;
      }
      const centre = track.scrollLeft + track.clientWidth / 2;
      let best: HTMLElement | null = null;
      let bestDistance = Infinity;
      for (const card of track.querySelectorAll<HTMLElement>("[data-id]")) {
        const d = Math.abs(card.offsetLeft + card.clientWidth / 2 - centre);
        if (d < bestDistance) {
          bestDistance = d;
          best = card;
        }
      }
      const id = best?.dataset.id;
      if (id && id !== latest.current.selectedId) latest.current.onSettle(id);
    };
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, 140);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div
      ref={trackRef}
      className="scrollbar-none flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]"
      aria-label="Lots on the map"
      role="list"
    >
      {properties.map((p) => {
        const selected = p.id === selectedId;
        return (
          <div
            key={p.id}
            role="listitem"
            data-id={p.id}
            data-testid="carousel-card"
            className="w-[min(22rem,calc(100vw-3rem))] shrink-0 snap-center"
          >
            <Link
              href={`/properties/${p.slug}`}
              className={cn(
                "flex gap-3 rounded-md bg-surface p-2 shadow-float transition-shadow",
                selected && "ring-2 ring-tajibo",
              )}
            >
              <PropertyPhoto photo={p.photo} sizes="112px" className="size-28 shrink-0 rounded-sm" />
              <div className="flex min-w-0 flex-1 flex-col py-1 pr-1">
                <p className="truncate leading-snug font-semibold">
                  {p.name}
                  <span className="font-normal text-ink-2">, {p.lotLabel}</span>
                </p>
                <p className="truncate text-sm text-ink-3">
                  {p.area}
                  {p.status === "RESERVED" ? ", reserved" : ""}
                </p>
                <p className="mt-auto">
                  <span className="plat text-lg font-semibold">{formatUsd(p.monthlyPriceFromUsd)}</span>
                  <span className="text-sm text-ink-2">/mo</span>
                </p>
                <p className="tabular text-sm text-ink-2">
                  {formatUsd(p.totalPriceUsd)} total<span aria-hidden="true">&ensp;</span>
                  <span className="text-ink-3">{formatArea(p.areaSquareMeters)}</span>
                </p>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
