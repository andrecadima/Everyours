"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { forwardRef } from "react";
import { PropertyPhoto } from "@/components/property/property-photo";
import { formatArea, formatUsd } from "@/lib/format";
import type { PropertySummary } from "@/lib/property-types";
import { cn } from "@/lib/utils";

type Props = {
  property: PropertySummary;
  selected: boolean;
  onHover: (id: string | null) => void;
  onShowOnMap: (id: string) => void;
  priority?: boolean;
};
