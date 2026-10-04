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
