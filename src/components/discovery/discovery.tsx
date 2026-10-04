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
