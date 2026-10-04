"use client";

import { Popover } from "radix-ui";
import { Check, ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import {
  BUDGET_OPTIONS,
  SIZE_OPTIONS,
  applyFilters,
  isFiltered,
  type Filters,
} from "@/lib/filters";
import type { PropertySummary } from "@/lib/property-types";
import { cn } from "@/lib/utils";

type Option = { value: string; label: string };
