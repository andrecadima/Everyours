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

const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

export async function submitLead(input: LeadSubmission): Promise<SubmitLeadResult> {
  // 1. Never trust the client: validate everything again here.
  const parsed = leadSubmissionSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return { ok: false, error: "Some details need a second look.", fieldErrors };
  }
  const data = parsed.data;

  // 2. Abuse checks: honeypot, timing, optional challenge, then rate limit.
  const h = await headers();
  const ip = (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "local").trim();
  const verdict = await checkSubmitter({
    honeypot: data.website,
    elapsedMs: data.elapsedMs,
    turnstileToken: data.turnstileToken,
    clientIp: ip,
  });
  // Bots get a quiet "success" so they learn nothing; nothing is stored.
  if (verdict === "bot") return { ok: true };
  if (verdict === "challenge_failed") {
    return { ok: false, error: "We couldn't verify this request. Complete the check above and send it again." };
  }
  if (!checkRateLimit(hashClient(ip)).ok) {
    return { ok: false, error: "You've sent several requests in a short time. Wait a few minutes, then try again." };
  }

  try {
    // 3. Same submission retried (double click, flaky network): already stored.
    const existing = await db.lead.findUnique({ where: { submissionKey: data.submissionKey }, select: { id: true } });
    if (existing) return { ok: true };

    const property = await db.property.findUnique({
      where: { slug: data.propertySlug },
      select: { id: true, status: true },
    });
    if (!property || property.status === "SOLD") {
      return { ok: false, error: "This lot is no longer listed. Explore the map to find another one." };
    }

    // 4. The same person asking about the same lot again within minutes.
    const recent = await db.lead.findFirst({
      where: {
        email: data.email,
        propertyId: property.id,
        createdAt: { gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) },
      },
      select: { id: true },
    });
    if (recent) return { ok: true };

    await db.lead.create({
      data: {
        propertyId: property.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: normalizePhone(data.phone, data.country),
        country: data.country,
        preferredContactMethod: data.preferredContactMethod,
        monthlyBudgetRange: data.monthlyBudgetRange ?? null,
        message: data.message ? data.message : null,
        consentAt: new Date(),
        submissionKey: data.submissionKey,
      },
    });
    return { ok: true };
  } catch (error) {
    // A concurrent duplicate of the same submission is still a success.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return { ok: true };
    // Log the failure class only; never the submitted personal data.
    console.error("[lead] submission failed", error instanceof Error ? error.name : "unknown");
    return { ok: false, error: "We couldn't send your details just now. Please try again in a moment." };
  }
}
