import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { PropertyPhoto } from "@/components/property/property-photo";
import { Logo } from "@/components/site/logo";
import { buttonClass } from "@/components/ui/button";
import { getPropertyBySlug } from "@/lib/properties";

export const metadata: Metadata = {
  title: "We received your interest",
  robots: { index: false },
};
