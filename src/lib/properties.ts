import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import type { PropertyDetail, PropertyPhoto, PropertySummary } from "@/lib/property-types";

type ImageRow = {
  url: string;
  alt: string;
  credit: string | null;
  creditUrl: string | null;
  isIllustrative: boolean;
};

const toPhoto = (image: ImageRow): PropertyPhoto => ({
  url: image.url,
  alt: image.alt,
  credit: image.credit,
  creditUrl: image.creditUrl,
  isIllustrative: image.isIllustrative,
});

const imageSelect = {
  url: true,
  alt: true,
  credit: true,
  creditUrl: true,
  isIllustrative: true,
} as const;

/** Listings shown on the map: everything that is not sold. */
export async function listProperties(): Promise<PropertySummary[]> {
  const rows = await db.property.findMany({
    where: { status: { not: "SOLD" } },
    orderBy: [{ featured: "desc" }, { monthlyPriceFromUsd: "asc" }],
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1, select: imageSelect } },
  });

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    lotLabel: row.lotLabel,
    area: row.area,
    municipality: row.municipality,
    latitude: row.latitude,
    longitude: row.longitude,
    areaSquareMeters: row.areaSquareMeters,
    totalPriceUsd: row.totalPriceUsd,
    monthlyPriceFromUsd: row.monthlyPriceFromUsd,
    status: row.status,
    featured: row.featured,
    isDemo: row.isDemo,
    photo: row.images[0] ? toPhoto(row.images[0]) : null,
  }));
}

/** Cached per request so metadata and the page share one query. */
export const getPropertyBySlug = cache(async (slug: string): Promise<PropertyDetail | null> => {
  if (!/^[a-z0-9-]{1,120}$/.test(slug)) return null;

  const row = await db.property.findUnique({
    where: { slug },
    include: { images: { orderBy: { sortOrder: "asc" }, select: imageSelect } },
  });
  if (!row) return null;

  const photos = row.images.map(toPhoto);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    lotLabel: row.lotLabel,
    area: row.area,
    municipality: row.municipality,
    department: row.department,
    country: row.country,
    latitude: row.latitude,
    longitude: row.longitude,
    areaSquareMeters: row.areaSquareMeters,
    totalPriceUsd: row.totalPriceUsd,
    monthlyPriceFromUsd: row.monthlyPriceFromUsd,
    downPaymentUsd: row.downPaymentUsd,
    termMonths: row.termMonths,
    status: row.status,
    featured: row.featured,
    isDemo: row.isDemo,
    referenceCode: row.referenceCode,
    description: row.description,
    roadAccess: row.roadAccess,
    terrain: row.terrain,
    utilities: row.utilities,
    photo: photos[0] ?? null,
    photos,
  };
});
