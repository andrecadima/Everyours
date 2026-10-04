"use client";

import { List, Map as MapIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { FilterBar } from "@/components/discovery/filter-bar";
import { LotCarousel } from "@/components/discovery/lot-carousel";
import { MapPreview } from "@/components/discovery/map-preview";
import { PropertyEntry } from "@/components/discovery/property-entry";
import { PropertyMap, type MapControls } from "@/components/map/property-map";
import { track } from "@/lib/analytics";
import { applyFilters, DEFAULT_FILTERS, filtersToSearch, type Filters } from "@/lib/filters";
import type { PropertySummary } from "@/lib/property-types";
import { cn } from "@/lib/utils";

const desktopQuery = "(min-width: 1024px)";
function useIsDesktop() {
  return useSyncExternalStore(
    (notify) => {
      const mql = window.matchMedia(desktopQuery);
      mql.addEventListener("change", notify);
      return () => mql.removeEventListener("change", notify);
    },
    () => window.matchMedia(desktopQuery).matches,
    () => true,
  );
}

const DESKTOP_PADDING = { top: 120, right: 96, bottom: 48, left: 72 };
const MOBILE_PADDING = { top: 120, right: 56, bottom: 210, left: 56 };

export function Discovery({ properties, initialFilters }: { properties: PropertySummary[]; initialFilters: Filters }) {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"map" | "list">("map");
  const isDesktop = useIsDesktop();
  const entryRefs = useRef(new Map<string, HTMLElement>());

  const areas = useMemo(() => [...new Set(properties.map((p) => p.area))].sort(), [properties]);
  const visible = useMemo(() => applyFilters(properties, filters), [properties, filters]);
  const effectiveSelected = visible.some((p) => p.id === selectedId) ? selectedId : null;

  const changeFilters = (next: Filters) => {
    setFilters(next);
    const results = applyFilters(properties, next).length;
    track("filters_changed", { ...next, results });
    window.history.replaceState(null, "", `${window.location.pathname}${filtersToSearch(next)}`);
  };

  const select = useCallback(
    (id: string | null, via: "list" | "marker" | "carousel") => {
      setSelectedId(id);
      if (!id) return;
      if (via === "marker") track("map_marker_clicked", { propertyId: id });
      track("property_selected", { propertyId: id, via });
    },
    [],
  );

  // Keep the selected entry in view in the desktop list.
  useEffect(() => {
    if (!isDesktop || !effectiveSelected) return;
    entryRefs.current.get(effectiveSelected)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [effectiveSelected, isDesktop]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const renderPreview = useCallback(
    (p: PropertySummary, controls: MapControls) => <MapPreview property={p} controls={controls} />,
    [],
  );

  const reset = () => changeFilters(DEFAULT_FILTERS);
  const countLabel =
    visible.length === properties.length
      ? `${properties.length} lots around Santa Cruz, Bolivia`
      : `${visible.length} of ${properties.length} lots match`;

  const empty = (
    <div className="rounded-md border border-dashed border-line-strong/60 px-5 py-8 text-center" data-testid="empty-state">
      <p className="font-semibold">No land matches these filters.</p>
      <p className="mt-1 text-sm text-ink-2">Try a higher monthly budget, another size, or a different area.</p>
      <button type="button" onClick={reset} className="mt-4 text-sm font-semibold text-monte underline underline-offset-4">
        Reset filters
      </button>
    </div>
  );

  return (
    <main id="main" className="relative min-h-0 flex-1 lg:grid lg:grid-cols-[minmax(24rem,42%)_1fr]">
      {/* Results panel: the left column on desktop, the list view on mobile. */}
      <section
        aria-labelledby="results-heading"
        className={cn(
          "@container overflow-y-auto overscroll-contain bg-paper lg:border-r lg:border-line",
          "max-lg:absolute max-lg:inset-0 max-lg:z-20",
          mobileView === "list" ? "" : "max-lg:hidden",
        )}
      >
        <div className="sticky top-0 z-10 border-b border-line/70 bg-paper/95 px-4 pt-5 pb-3.5 backdrop-blur-sm sm:px-6 lg:pt-7">
          <h1 id="results-heading" className="text-[1.75rem] leading-tight font-semibold tracking-[-0.025em] sm:text-[2rem]">
            Find your place.
          </h1>
          <p className="mt-1 text-[0.9375rem] text-ink-2" aria-live="polite" data-testid="result-count">
            {countLabel}
          </p>
          <FilterBar
            all={properties}
            areas={areas}
            filters={filters}
            onChange={changeFilters}
            className="scrollbar-none -mx-4 mt-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6"
          />
        </div>

        <div className="px-4 pt-5 pb-28 sm:px-6 lg:pb-10">
          <p className="mb-6 max-w-[60ch] text-sm text-ink-3">
            You&rsquo;re viewing demo listings. Lots, prices, and plans are illustrative, and photos show the
            landscape, not the exact land.
          </p>
          {visible.length === 0 ? (
            empty
          ) : (
            <div className="grid grid-cols-1 gap-x-5 gap-y-9 @[34rem]:grid-cols-2">
              {visible.map((p, i) => (
                <PropertyEntry
                  key={p.id}
                  ref={(el) => {
                    if (el) entryRefs.current.set(p.id, el);
                    else entryRefs.current.delete(p.id);
                  }}
                  property={p}
                  selected={p.id === effectiveSelected}
                  onHover={isDesktop ? setHighlightedId : () => {}}
                  onShowOnMap={(id) => select(id, "list")}
                  priority={i < 2}
                />
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileView("map")}
          className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-30 inline-flex h-11 -translate-x-1/2 items-center gap-2 rounded-sm bg-ink px-5 text-[0.9375rem] font-semibold text-paper shadow-float lg:hidden"
        >
          <MapIcon className="size-4" aria-hidden="true" />
          Show map
        </button>
      </section>

      {/* Map: the right column on desktop, the whole screen on mobile. */}
      <div className="relative h-full min-h-0">
        <PropertyMap
          properties={visible}
          selectedId={effectiveSelected}
          highlightedId={isDesktop ? highlightedId : null}
          onSelect={(id) => select(id, "marker")}
          padding={isDesktop ? DESKTOP_PADDING : MOBILE_PADDING}
          renderPreview={isDesktop ? renderPreview : undefined}
          ariaLabel="Map of available land around Santa Cruz, Bolivia"
          onUnavailable={isDesktop ? undefined : () => setMobileView("list")}
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 pt-3 lg:hidden">
          <FilterBar
            all={properties}
            areas={areas}
            filters={filters}
            onChange={changeFilters}
            floating
            className="scrollbar-none pointer-events-auto overflow-x-auto px-4 pb-2"
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 lg:hidden">
          <div className="flex items-center justify-between px-4 pb-1">
            <p className="rounded-xs bg-surface/90 px-2 py-0.5 text-sm font-medium text-ink-2 shadow-lift">
              {visible.length} {visible.length === 1 ? "lot" : "lots"}
            </p>
            <button
              type="button"
              onClick={() => setMobileView("list")}
              className="inline-flex h-10 items-center gap-2 rounded-sm bg-ink px-4 text-sm font-semibold text-paper shadow-float"
            >
              <List className="size-4" aria-hidden="true" />
              View list
            </button>
          </div>
          {visible.length === 0 ? (
            <div className="px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="rounded-md bg-surface p-1 shadow-float">{empty}</div>
            </div>
          ) : (
            <LotCarousel properties={visible} selectedId={effectiveSelected} onSettle={(id) => select(id, "carousel")} />
          )}
        </div>
      </div>
    </main>
  );
}
