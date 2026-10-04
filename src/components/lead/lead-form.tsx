"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { ChoiceGroup, Field, TextInput, inputClass } from "@/components/lead/form-controls";
import { SelectedLot } from "@/components/lead/selected-lot";
import { Turnstile } from "@/components/lead/turnstile";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { COUNTRY_CODES, countryOptions, type CountryCode } from "@/lib/countries";
import {
  BUDGET_RANGES,
  CONTACT_METHODS,
  LEAD_STEPS,
  leadFormSchema,
  type LeadFormInput,
  type LeadFormValues,
} from "@/lib/leads/schema";
import { submitLead } from "@/lib/leads/submit-lead";
import type { PropertySummary } from "@/lib/property-types";
import { cn } from "@/lib/utils";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
