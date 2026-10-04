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
