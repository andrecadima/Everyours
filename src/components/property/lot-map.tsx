"use client";

import { PropertyMap } from "@/components/map/property-map";
import type { PropertySummary } from "@/lib/property-types";

export function LotMap({ property }: { property: PropertySummary }) {
  return (
    <PropertyMap
      variant="lot"
      properties={[property]}
      selectedId={property.id}
      ariaLabel={`Map showing the approximate outline of ${property.name}, ${property.lotLabel}`}
    />
  );
}
