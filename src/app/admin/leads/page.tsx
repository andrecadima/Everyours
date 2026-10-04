import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { db } from "@/lib/db";
import { BUDGET_RANGES, CONTACT_METHODS } from "@/lib/leads/schema";

export const metadata: Metadata = { title: "Leads (development only)", robots: { index: false, follow: false } };
