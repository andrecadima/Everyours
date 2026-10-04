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
