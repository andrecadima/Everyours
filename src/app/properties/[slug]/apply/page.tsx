import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";
import { LeadForm } from "@/components/lead/lead-form";
import { SelectedLot } from "@/components/lead/selected-lot";
import { Logo } from "@/components/site/logo";
import { buttonClass } from "@/components/ui/button";
import { getPropertyBySlug } from "@/lib/properties";

export const metadata: Metadata = {
  title: "Make it yours",
  robots: { index: false },
};
