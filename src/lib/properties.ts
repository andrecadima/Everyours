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
