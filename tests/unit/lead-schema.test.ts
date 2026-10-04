import assert from "node:assert/strict";
import { test } from "node:test";
import { leadFormSchema, leadSubmissionSchema, normalizePhone } from "../../src/lib/leads/schema";
import { applyFilters, parseFilters } from "../../src/lib/filters";

const valid = {
  firstName: "Ana",
  lastName: "Rivera",
  email: "  Ana@Example.com ",
  phone: "(512) 555-0199",
  country: "US",
  preferredContactMethod: "WHATSAPP",
  consent: true,
} as const;

test("accepts a minimal valid lead and normalises email", () => {
  const parsed = leadFormSchema.parse(valid);
  assert.equal(parsed.email, "ana@example.com");
});

test("consent must be given explicitly", () => {
  assert.equal(leadFormSchema.safeParse({ ...valid, consent: false }).success, false);
});

test("rejects unknown countries, contact methods, and junk names", () => {
  assert.equal(leadFormSchema.safeParse({ ...valid, country: "XX" }).success, false);
  assert.equal(leadFormSchema.safeParse({ ...valid, preferredContactMethod: "FAX" }).success, false);
  assert.equal(leadFormSchema.safeParse({ ...valid, firstName: "<script>" }).success, false);
  assert.equal(leadFormSchema.safeParse({ ...valid, phone: "123" }).success, false);
});

test("submission envelope requires a uuid key and an empty honeypot", () => {
  const base = { ...valid, propertySlug: "las-palmas-lot-14", submissionKey: crypto.randomUUID(), elapsedMs: 9000 };
  assert.equal(leadSubmissionSchema.safeParse(base).success, true);
  assert.equal(leadSubmissionSchema.safeParse({ ...base, submissionKey: "nope" }).success, false);
  assert.equal(leadSubmissionSchema.safeParse({ ...base, website: "spam.example" }).success, false);
  assert.equal(leadSubmissionSchema.safeParse({ ...base, propertySlug: "../etc" }).success, false);
});

test("normalises phone numbers", () => {
  assert.equal(normalizePhone("(512) 555-0199", "US"), "+15125550199");
  assert.equal(normalizePhone("+591 7 123 4567", "BO"), "+59171234567");
  assert.equal(normalizePhone("0044 7700 900123", "GB"), "+447700900123");
});
