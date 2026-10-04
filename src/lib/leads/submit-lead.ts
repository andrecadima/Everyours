"use server";

import { headers } from "next/headers";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { checkSubmitter } from "@/lib/leads/bot-protection";
import { checkRateLimit, hashClient } from "@/lib/leads/rate-limit";
import { leadSubmissionSchema, normalizePhone, type LeadSubmission } from "@/lib/leads/schema";

export type SubmitLeadResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };
