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
