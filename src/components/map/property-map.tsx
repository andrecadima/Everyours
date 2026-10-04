"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import type { GeoJSONSource, Map as MapLibreMap, Marker, Popup } from "maplibre-gl";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { RefreshCw } from "lucide-react";
import { loadMapStyle } from "@/components/map/map-style";
import { lotFeatureCollection, lotOutline } from "@/lib/lot-geometry";
import type { PropertySummary } from "@/lib/property-types";
import { cn } from "@/lib/utils";

const TAJIBO = "#c22f6c";
const SANTA_CRUZ: [number, number] = [-63.18, -17.78];

type Padding = { top: number; right: number; bottom: number; left: number };

export type MapControls = { close: () => void; zoomToLot: () => void };

type Props = {
  properties: PropertySummary[];
  selectedId: string | null;
  highlightedId?: string | null;
  onSelect?: (id: string | null) => void;
  /** Space kept clear when framing markers (e.g. under a bottom carousel). */
  padding?: Padding;
  /** Desktop preview shown above the selected marker. */
  renderPreview?: (property: PropertySummary, controls: MapControls) => ReactNode;
  /** "lot" shows one property at the scale of its outline. */
  variant?: "discovery" | "lot";
  ariaLabel: string;
  className?: string;
  onUnavailable?: () => void;
};

type MarkerEntry = { marker: Marker; el: HTMLButtonElement; property: PropertySummary; width: number };

const DEFAULT_PADDING: Padding = { top: 72, right: 72, bottom: 72, left: 72 };

/** Zoom at which a lot's side is drawn about `px` pixels wide. */
export function zoomForLot(lat: number, areaSquareMeters: number, px = 56) {
  const metersPerPixelAtZ0 = 156_543.03 * Math.cos((lat * Math.PI) / 180);
  const z = Math.log2((metersPerPixelAtZ0 * px) / Math.sqrt(areaSquareMeters));
  return Math.min(18.5, Math.max(14, z));
}

function boundsOf(list: PropertySummary[]): [[number, number], [number, number]] | null {
  if (!list.length) return null;
  let w = Infinity, s = Infinity, e = -Infinity, n = -Infinity;
  for (const p of list) {
    w = Math.min(w, p.longitude); e = Math.max(e, p.longitude);
    s = Math.min(s, p.latitude); n = Math.max(n, p.latitude);
  }
  return [[w, s], [e, n]];
}

function markerLabel(p: PropertySummary) {
  const status = p.status === "RESERVED" ? " (reserved)" : "";
  return `${p.name}, ${p.lotLabel}${status}: from $${p.monthlyPriceFromUsd} per month`;
}

function createMarkerElement(p: PropertySummary, lotOnly: boolean) {
  const el = document.createElement("button");
  el.type = "button";
  el.className = "eo-marker";
  el.dataset.id = p.id;
  el.dataset.status = p.status;
  el.setAttribute("aria-label", lotOnly ? `${p.name}, ${p.lotLabel}: corner stake` : markerLabel(p));
  const text = lotOnly ? p.lotLabel : `$${p.monthlyPriceFromUsd}<small>/mo</small>`;
  el.innerHTML = `<span class="eo-marker__tag" aria-hidden="true">${text}</span><span class="eo-marker__stake" aria-hidden="true"></span>`;
  if (lotOnly) el.tabIndex = -1;
  return el;
}

export function PropertyMap({
  properties,
  selectedId,
  highlightedId = null,
  onSelect,
  padding = DEFAULT_PADDING,
  renderPreview,
  variant = "discovery",
  ariaLabel,
  className,
  onUnavailable,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const libRef = useRef<typeof import("maplibre-gl") | null>(null);
  const markersRef = useRef(new Map<string, MarkerEntry>());
  const popupRef = useRef<Popup | null>(null);
  const framedKeyRef = useRef<string>("");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  // One detached node hosts the React-rendered preview inside MapLibre's popup.
  const [popupNode] = useState(() => (typeof document === "undefined" ? null : document.createElement("div")));
  const [zoomTick, setZoomTick] = useState(0);

  // Latest values for map event handlers that are registered once.
  const latest = useRef({ onSelect, selectedId, highlightedId, padding, properties });
  useEffect(() => {
    latest.current = { onSelect, selectedId, highlightedId, padding, properties };
  });

  const isLot = variant === "lot";

  /** Collapse tags that would overlap into small stakes; the active one always wins. */
  const declutter = useCallback(() => {
    const map = mapRef.current;
    if (!map || isLot) return;
    const { selectedId: sel, highlightedId: hi } = latest.current;
    const entries = [...markersRef.current.values()].sort((a, b) => {
      const rank = (e: MarkerEntry) => (e.property.id === sel ? 0 : e.property.id === hi ? 1 : e.property.featured ? 2 : 3);
      return rank(a) - rank(b) || a.property.monthlyPriceFromUsd - b.property.monthlyPriceFromUsd;
    });
    const placed: { x1: number; x2: number; y1: number; y2: number }[] = [];
    for (const entry of entries) {
      const pt = map.project([entry.property.longitude, entry.property.latitude]);
      const r = { x1: pt.x - entry.width / 2 - 3, x2: pt.x + entry.width / 2 + 3, y1: pt.y - 46, y2: pt.y - 12 };
      const active = entry.property.id === sel || entry.property.id === hi;
      const hit = placed.some((p) => r.x1 < p.x2 && r.x2 > p.x1 && r.y1 < p.y2 && r.y2 > p.y1);
      const compact = hit && !active;
      entry.el.setAttribute("data-compact", String(compact));
      if (!compact) placed.push(r);
    }
  }, [isLot]);

  // ── Create the map ────────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let cancelled = false;
    let loaded = false;
    const abort = new AbortController();
    const markers = markersRef.current;
    const initial = latest.current.properties;
    setStatus("loading");

    (async () => {
      try {
        const [lib, style] = await Promise.all([import("maplibre-gl"), loadMapStyle(abort.signal)]);
        if (cancelled) return;
        // Served from /public by scripts/copy-maplibre-worker.mjs (bundlers rewrite the default URL).
        lib.setWorkerUrl(`/vendor/maplibre/${lib.getVersion()}/maplibre-gl-worker.mjs`);
        libRef.current = lib;
        const first = initial[0];
        const bounds = boundsOf(initial);
        const map = new lib.Map({
          container,
          style,
          ...(isLot && first
            ? { center: [first.longitude, first.latitude] as [number, number], zoom: 12.5 }
            : bounds
              ? { bounds, fitBoundsOptions: { padding: latest.current.padding, maxZoom: 12 } }
              : { center: SANTA_CRUZ, zoom: 9 }),
          minZoom: 5,
          maxZoom: 19,
          dragRotate: false,
          pitchWithRotate: false,
          touchPitch: false,
          cooperativeGestures: isLot,
          attributionControl: false,
        });
        map.touchZoomRotate.disableRotation();
        map.addControl(new lib.NavigationControl({ showCompass: false }), "top-right");
        map.addControl(new lib.AttributionControl({ compact: true }), "bottom-right");
        if (isLot) map.addControl(new lib.ScaleControl({ unit: "metric", maxWidth: 120 }), "bottom-left");
        mapRef.current = map;
        // Development aid: lets scripts inspect the rendered map (e.g. lot placement checks).
        if (process.env.NODE_ENV === "development") (window as unknown as { __eoMap?: MapLibreMap }).__eoMap = map;

        const timeout = window.setTimeout(() => {
          if (!loaded && !cancelled) setStatus("error");
        }, 15_000);

        map.on("error", () => {
          // Tile hiccups after load are tolerated; failing before load is not.
          if (!loaded && !cancelled) {
            window.clearTimeout(timeout);
            setStatus("error");
          }
        });

        map.on("load", () => {
          loaded = true;
          // Phones: start the attribution folded behind its (i) button.
          if (window.matchMedia("(max-width: 1023px)").matches) {
            container.querySelector(".maplibregl-ctrl-attrib")?.classList.remove("maplibregl-compact-show");
          }
          window.clearTimeout(timeout);
          map.addSource("lots", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
          map.addSource("lot-stakes", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
          map.addLayer({
            id: "lots-fill",
            type: "fill",
            source: "lots",
            minzoom: 13,
            paint: {
              "fill-color": ["case", ["==", ["get", "id"], ""], TAJIBO, "#1f4a37"],
              "fill-opacity": ["case", ["==", ["get", "id"], ""], 0.2, 0.08],
            },
          });
          map.addLayer({
            id: "lots-line",
            type: "line",
            source: "lots",
            minzoom: 13,
            paint: { "line-color": "#4d5a50", "line-width": 1, "line-dasharray": [3, 2] },
          });
          map.addLayer({
            id: "lot-selected-line",
            type: "line",
            source: "lots",
            minzoom: 13,
            filter: ["==", ["get", "id"], ""],
            paint: { "line-color": TAJIBO, "line-width": 2.5 },
          });
          map.addLayer({
            id: "lot-stakes",
            type: "circle",
            source: "lot-stakes",
            minzoom: 14,
            filter: ["==", ["get", "id"], ""],
            paint: { "circle-radius": 4.5, "circle-color": TAJIBO, "circle-stroke-color": "#ffffff", "circle-stroke-width": 2 },
          });
          setStatus("ready");

          // Signature moment on the property page: from the surroundings down
          // to the lot itself, drawn to scale. Once, when it scrolls into view.
          if (isLot && first) {
            const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            const target = { center: [first.longitude, first.latitude] as [number, number], zoom: zoomForLot(first.latitude, first.areaSquareMeters, 40) };
            const observer = new IntersectionObserver(
              (entries) => {
                if (!entries.some((e) => e.isIntersecting)) return;
                observer.disconnect();
                if (reduce) map.jumpTo(target);
                else map.flyTo({ ...target, duration: 2800, curve: 1.6, essential: true });
              },
              { threshold: 0.6 },
            );
            observer.observe(container);
            map.once("remove", () => observer.disconnect());
          }
        });

        map.on("move", () => requestAnimationFrame(declutter));
        map.on("click", () => {
          if (!isLot) latest.current.onSelect?.(null);
        });
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      abort.abort();
      popupRef.current?.remove();
      popupRef.current = null;
      markers.forEach((m) => m.marker.remove());
      markers.clear();
      mapRef.current?.remove();
      mapRef.current = null;
      framedKeyRef.current = "";
    };
  }, [attempt, isLot, declutter]);

  useEffect(() => {
    if (status === "error") onUnavailable?.();
  }, [status, onUnavailable]);

  // ── Markers and lot outlines follow the (filtered) property list ─────────
  useEffect(() => {
    const map = mapRef.current;
    const lib = libRef.current;
    if (status !== "ready" || !map || !lib) return;
    const markers = markersRef.current;
    const ids = new Set(properties.map((p) => p.id));

    for (const [id, entry] of markers) {
      if (!ids.has(id)) {
        entry.marker.remove();
        markers.delete(id);
      }
    }
    for (const p of properties) {
      if (markers.has(p.id)) continue;
      const el = createMarkerElement(p, isLot);
      el.addEventListener("click", (event) => {
        event.stopPropagation();
        if (!isLot) latest.current.onSelect?.(p.id);
      });
      el.addEventListener("mouseenter", () => (el.style.zIndex = "20"));
      el.addEventListener("mouseleave", () => (el.style.zIndex = el.dataset.state === "active" ? "10" : ""));
      const position: [number, number] = isLot
        ? lotOutline(p.latitude, p.longitude, p.areaSquareMeters)[0]
        : [p.longitude, p.latitude];
      const marker = new lib.Marker({ element: el, anchor: "bottom" }).setLngLat(position).addTo(map);
      const tag = el.querySelector<HTMLElement>(".eo-marker__tag");
      markers.set(p.id, { marker, el, property: p, width: tag?.offsetWidth ?? 24 });
    }

    const lots = properties.map((p) => {
      const { outline, stakes } = lotFeatureCollection(p.latitude, p.longitude, p.areaSquareMeters);
      return {
        outline: { ...outline, properties: { id: p.id } },
        stakes: stakes.features.map((f) => ({ ...f, properties: { id: p.id } })),
      };
    });
    (map.getSource("lots") as GeoJSONSource | undefined)?.setData({
      type: "FeatureCollection",
      features: lots.map((l) => l.outline),
    });
    (map.getSource("lot-stakes") as GeoJSONSource | undefined)?.setData({
      type: "FeatureCollection",
      features: lots.flatMap((l) => l.stakes),
    });

    // Re-frame only when the set of visible lots actually changes.
    const key = properties.map((p) => p.id).sort().join(",");
    if (!isLot && framedKeyRef.current && framedKeyRef.current !== key) {
      const b = boundsOf(properties);
      if (b) {
        map.fitBounds(b, { padding: latest.current.padding, maxZoom: 12, duration: 700 });
      }
    }
    framedKeyRef.current = key;
    declutter();
  }, [properties, status, isLot, declutter]);

  // ── Selection state: flags, outline, and the preview ────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (status !== "ready" || !map) return;
    const active = isLot ? properties[0]?.id ?? null : selectedId;
    for (const [id, entry] of markersRef.current) {
      const on = id === active || id === highlightedId;
      entry.el.setAttribute("data-state", on ? "active" : "idle");
      entry.el.setAttribute("aria-pressed", String(id === active));
      entry.marker.getElement().style.zIndex = on ? "10" : "";
    }
    const lit = active ?? highlightedId ?? "";
    if (map.getLayer("lots-fill")) {
      map.setPaintProperty("lots-fill", "fill-color", ["case", ["==", ["get", "id"], lit], TAJIBO, "#1f4a37"]);
      map.setPaintProperty("lots-fill", "fill-opacity", ["case", ["==", ["get", "id"], lit], 0.2, 0.08]);
      map.setFilter("lot-selected-line", ["==", ["get", "id"], lit]);
      map.setFilter("lot-stakes", ["==", ["get", "id"], lit]);
    }
    declutter();
  }, [selectedId, highlightedId, status, properties, isLot, declutter]);

  // "To scale" in the preview: fly down until the lot outline is visible.
  useEffect(() => {
    if (!zoomTick) return;
    const p = latest.current.properties.find((x) => x.id === latest.current.selectedId);
    if (!p) return;
    mapRef.current?.flyTo({
      center: [p.longitude, p.latitude],
      zoom: zoomForLot(p.latitude, p.areaSquareMeters),
      duration: 1800,
      essential: true,
    });
  }, [zoomTick]);

  useEffect(() => {
    const map = mapRef.current;
    const lib = libRef.current;
    if (status !== "ready" || !map || !lib || isLot) return;
    popupRef.current?.remove();
    popupRef.current = null;
    const selected = properties.find((p) => p.id === selectedId);
    if (!selected || !popupNode) return;

    const point = map.project([selected.longitude, selected.latitude]);
    const { padding: pad } = latest.current;
    const canvas = map.getCanvas();
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const comfortable =
      point.x > pad.left + 40 && point.x < w - pad.right - 40 && point.y > pad.top + (renderPreview ? 300 : 60) && point.y < h - pad.bottom - 20;
    if (!comfortable) {
      map.easeTo({
        center: [selected.longitude, selected.latitude],
        offset: [0, renderPreview ? 140 : 0],
        duration: 600,
      });
    }

    if (!renderPreview) return;
    const popup = new lib.Popup({
      anchor: "bottom",
      offset: [0, -54],
      closeButton: false,
      closeOnClick: false,
      focusAfterOpen: false,
      maxWidth: "320px",
      className: "eo-popup",
    })
      .setLngLat([selected.longitude, selected.latitude])
      .setDOMContent(popupNode)
      .addTo(map);
    popupRef.current = popup;
  }, [selectedId, status, properties, isLot, renderPreview, popupNode]);

  const selected = properties.find((p) => p.id === selectedId);

  return (
    <div className={cn("eo-map relative h-full w-full overflow-hidden bg-[#ecebe3]", isLot ? "eo-map--lot" : "eo-map--discovery", className)}>
      {/* Inline position: maplibre's own (unlayered) CSS would override a utility class. */}
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }} role="region" aria-label={ariaLabel} />
      {status === "loading" && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden="true">
          <div className="flex items-center gap-3 rounded-sm bg-surface/90 px-4 py-2.5 text-sm text-ink-2 shadow-lift">
            <span className="size-2 animate-pulse rounded-full bg-monte" />
            Loading the map
          </div>
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 grid place-items-center bg-paper/95 p-6" role="status">
          <div className="max-w-xs text-center">
            <p className="font-semibold text-ink">The map didn&rsquo;t load.</p>
            <p className="mt-1.5 text-sm text-ink-2">
              {isLot
                ? "Everything about this lot is still below. Try loading the map again."
                : "Every lot is still in the list. Try loading the map again, or keep browsing."}
            </p>
            <button
              type="button"
              onClick={() => setAttempt((a) => a + 1)}
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-sm border border-line-strong bg-surface px-4 text-sm font-medium text-ink hover:bg-paper"
            >
              <RefreshCw className="size-4" aria-hidden="true" />
              Try again
            </button>
          </div>
        </div>
      )}
      {popupNode && selected && renderPreview && status === "ready"
        ? createPortal(
            renderPreview(selected, {
              close: () => onSelect?.(null),
              zoomToLot: () => setZoomTick((t) => t + 1),
            }),
            popupNode,
          )
        : null}
    </div>
  );
}
