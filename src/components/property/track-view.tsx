"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function TrackPropertyView({ propertyId }: { propertyId: string }) {
  useEffect(() => {
    track("property_viewed", { propertyId });
  }, [propertyId]);
  return null;
}
