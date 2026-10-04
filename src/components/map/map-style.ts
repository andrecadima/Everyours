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

const PAINT: Record<string, Record<string, unknown>> = {
  background: { "background-color": "#ecebe3" },
  park: { "fill-color": "#cbdab9" },
  landcover_wood: { "fill-color": "#c9d7b7" },
  landuse_residential: { "fill-color": "#e5e3d9" },
  water: { "fill-color": "#b7cbc7" },
  waterway: { "line-color": "#a3bdb9" },
  building: { "fill-color": "#dddace", "fill-outline-color": "#cfcbbf" },
  highway_minor: { "line-color": "#fbfbf8" },
  highway_path: { "line-color": "#f6f5ef" },
  highway_major_casing: { "line-color": "#d3cfc2" },
  highway_major_inner: { "line-color": "#fbfbf8" },
  highway_major_subtle: { "line-color": "#d9d6ca" },
  highway_motorway_casing: { "line-color": "#c9c4b5" },
  highway_motorway_inner: { "line-color": "#fbf9f2" },
  highway_motorway_subtle: { "line-color": "#d3cfc2" },
  boundary_2: { "line-color": "#aaa597" },
  boundary_3: { "line-color": "#b8b4a7" },
  waterway_line_label: { "text-color": "#56726e", "text-halo-color": "#ecebe3" },
  water_name_point_label: { "text-color": "#56726e", "text-halo-color": "#ecebe3" },
  water_name_line_label: { "text-color": "#56726e", "text-halo-color": "#ecebe3" },
  "highway-name-minor": { "text-color": "#6b726c", "text-halo-color": "#fbfbf8" },
  "highway-name-major": { "text-color": "#6b726c", "text-halo-color": "#fbfbf8" },
};

const HIDDEN = new Set(["highway-shield-non-us", "highway-shield-us-interstate", "road_shield_us", "boundary_3"]);
