import type { Metadata } from "next";
import Link from "next/link";
import { PropertyPhoto } from "@/components/property/property-photo";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { buttonClass } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "How it works",
  description: "Find land in Santa Cruz, Bolivia, see the full price and an example monthly plan, and tell us you're interested.",
};

const steps = [
  {
    title: "Find your place",
    body: "Explore available land across Santa Cruz on the map.",
  },
  {
    title: "Choose what feels right",
    body: "See the property, the full price, and an example monthly plan upfront.",
  },
  {
    title: "Make it yours",
    body: "Tell us you’re interested and our team will guide you through the next steps.",
  },
];
