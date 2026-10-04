import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { db } from "@/lib/db";
import { BUDGET_RANGES, CONTACT_METHODS } from "@/lib/leads/schema";

export const metadata: Metadata = { title: "Leads (development only)", robots: { index: false, follow: false } };

/**
 * DEVELOPMENT ONLY. There is no authentication here, so this page 404s in
 * production unless ENABLE_DEV_ADMIN="true" (which you should only set after
 * putting real auth in front of it).
 */
export default async function AdminLeadsPage() {
  await connection();
  if (process.env.NODE_ENV === "production" && process.env.ENABLE_DEV_ADMIN !== "true") notFound();

  const leads = await db.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { property: { select: { name: true, lotLabel: true, slug: true } } },
  });
  const label = <T extends { value: string; label: string }>(list: readonly T[], v: string | null) =>
    list.find((o) => o.value === v)?.label ?? "—";

  return (
    <main id="main" className="mx-auto max-w-[90rem] px-4 py-8 sm:px-6">
      <div className="rounded-sm bg-earth-soft px-4 py-3 text-sm font-medium text-earth">
        Development only. No authentication: disabled in production by default.
      </div>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">Leads ({leads.length})</h1>
      {leads.length === 0 ? (
        <p className="mt-4 text-ink-2">No leads yet. Submit the form on any property to see one here.</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-sm border border-line bg-surface">
          <table className="w-full min-w-[60rem] text-left text-sm" data-testid="leads-table">
            <thead className="border-b border-line text-ink-2">
              <tr>
                {["Received", "Lead", "Contact", "Property", "Budget", "Prefers", "Status"].map((h) => (
                  <th key={h} className="px-3 py-2.5 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="tabular">
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-line last:border-0 align-top">
                  <td className="px-3 py-2.5 whitespace-nowrap text-ink-2">
                    {lead.createdAt.toISOString().slice(0, 16).replace("T", " ")} UTC
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="font-medium">
                      {lead.firstName} {lead.lastName}
                    </span>
                    <span className="block text-ink-3">{lead.country}</span>
                    {lead.message && <span className="mt-1 block max-w-xs text-ink-2">&ldquo;{lead.message}&rdquo;</span>}
                  </td>
                  <td className="px-3 py-2.5">
                    {lead.email}
                    <span className="block text-ink-3">{lead.phone}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <a className="underline underline-offset-2" href={`/properties/${lead.property.slug}`}>
                      {lead.property.name}, {lead.property.lotLabel}
                    </a>
                  </td>
                  <td className="px-3 py-2.5">{label(BUDGET_RANGES, lead.monthlyBudgetRange)}</td>
                  <td className="px-3 py-2.5">{label(CONTACT_METHODS, lead.preferredContactMethod)}</td>
                  <td className="px-3 py-2.5">
                    <span className="rounded-xs bg-monte-soft px-1.5 py-0.5 text-monte-deep">{lead.status}</span>
                    <span className="block text-ink-3">{lead.source}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
