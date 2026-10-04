// Plain, serialisable shapes shared by server and client components.
// Keep Prisma types out of the client bundle.

export type PropertyStatus = "AVAILABLE" | "RESERVED" | "SOLD";
export type RoadAccess = "PAVED" | "GRAVEL" | "DIRT";
export type Terrain = "FLAT" | "GENTLE_SLOPE" | "HILLSIDE";
export type Utility = "ELECTRICITY" | "WATER" | "INTERNET" | "SEWER";

export type PropertyPhoto = {
  url: string;
  alt: string;
  credit: string | null;
  creditUrl: string | null;
  isIllustrative: boolean;
};

/** What the discovery map and list need. */
export type PropertySummary = {
  id: string;
  slug: string;
  name: string;
  lotLabel: string;
  area: string;
  municipality: string;
  latitude: number;
  longitude: number;
  areaSquareMeters: number;
  totalPriceUsd: number;
  monthlyPriceFromUsd: number;
  status: PropertyStatus;
  featured: boolean;
  isDemo: boolean;
  photo: PropertyPhoto | null;
};

/** Everything the property page shows. */
export type PropertyDetail = PropertySummary & {
  referenceCode: string;
  description: string;
  department: string;
  country: string;
  downPaymentUsd: number;
  termMonths: number;
  roadAccess: RoadAccess | null;
  terrain: Terrain | null;
  utilities: Utility[];
  photos: PropertyPhoto[];
};

export const ROAD_ACCESS_LABEL: Record<RoadAccess, string> = {
  PAVED: "Paved road",
  GRAVEL: "Gravel road",
  DIRT: "Dirt road",
};

export const TERRAIN_LABEL: Record<Terrain, string> = {
  FLAT: "Flat",
  GENTLE_SLOPE: "Gentle slope",
  HILLSIDE: "Hillside",
};

export const UTILITY_LABEL: Record<Utility, string> = {
  ELECTRICITY: "Electricity",
  WATER: "Water",
  INTERNET: "Internet",
  SEWER: "Sewer",
};
