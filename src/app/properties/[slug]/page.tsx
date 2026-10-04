import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";
import { Gallery } from "@/components/property/gallery";
import { LotMap } from "@/components/property/lot-map";
import { PaymentPlan } from "@/components/property/payment-plan";
import { PropertyFacts } from "@/components/property/property-facts";
import { TrackPropertyView } from "@/components/property/track-view";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { buttonClass } from "@/components/ui/button";
import { formatArea, formatUsd } from "@/lib/format";
import { getPropertyBySlug } from "@/lib/properties";

export async function generateMetadata({ params }: PageProps<"/properties/[slug]">): Promise<Metadata> {
  await connection();
  const property = await getPropertyBySlug((await params).slug);
  if (!property) return { title: "Land not found" };
  const title = `${property.name}, ${property.lotLabel} in ${property.area}`;
  const description = `${formatArea(property.areaSquareMeters)} of land in ${property.area}, Santa Cruz, Bolivia. ${formatUsd(property.totalPriceUsd)} total, from ${formatUsd(property.monthlyPriceFromUsd)}/month.`;
  return {
    title,
    description,
    alternates: { canonical: `/properties/${property.slug}` },
    openGraph: {
      title,
      description,
      images: property.photo ? [{ url: property.photo.url, alt: property.photo.alt }] : undefined,
    },
  };
}
