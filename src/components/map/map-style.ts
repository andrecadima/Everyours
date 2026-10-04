import type { StyleSpecification } from "maplibre-gl";

/**
 * Basemap: OpenFreeMap "positron" (OpenStreetMap data, free, no API key),
 * recoloured into the Everyours palette with terrain relief added, so the
 * Andes foothills west of Santa Cruz read at a glance.
 *
 * Set NEXT_PUBLIC_MAP_STYLE_URL to use any other MapLibre style as-is.
 */
export const DEFAULT_STYLE_URL = "https://tiles.openfreemap.org/styles/positron";
const TERRAIN_TILES = "https://elevation-tiles-prod.s3.amazonaws.com/terrarium/{z}/{x}/{y}.png";
