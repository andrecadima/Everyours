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

export default async function PropertyPage({ params }: PageProps<"/properties/[slug]">) {
  await connection();
  const p = await getPropertyBySlug((await params).slug);
  if (!p) notFound();

  const sold = p.status === "SOLD";
  const applyHref = `/properties/${p.slug}/apply${p.status === "RESERVED" ? "?intent=interested" : ""}`;

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <TrackPropertyView propertyId={p.id} />
      <main id="main" className="flex-1 pb-28 lg:pb-0">
        <div className="mx-auto max-w-[78rem] px-4 sm:px-6">
          <Link
            href="/"
            className="-ml-2 mt-3 inline-flex h-10 items-center gap-1.5 rounded-sm px-2 text-[0.9375rem] font-medium text-ink-2 hover:text-ink"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            All land
          </Link>

          <div className="mt-2">
            <Gallery photos={p.photos} title={`${p.name}, ${p.lotLabel}`} />
          </div>

          {/* Phones read intro, plan, then details; desktop keeps the plan beside both. */}
          <div className="mt-8 grid gap-10 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_25rem] lg:gap-x-16 lg:gap-y-12">
            <div className="min-w-0 lg:col-start-1 lg:row-start-1">
              <h1 className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="text-[length:var(--text-display)] leading-[var(--text-display--line-height)] font-semibold tracking-[var(--text-display--letter-spacing)]">
                  {p.name}
                </span>
                <span className="plat text-[clamp(1.75rem,1.2rem+2vw,2.75rem)] font-semibold text-monte">
                  {p.lotLabel}
                </span>
              </h1>
              <p className="mt-3 text-lg text-ink-2">
                {p.area}, {p.department}, {p.country}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-[0.8125rem] font-medium">
                <span className="rounded-xs bg-monte-soft px-2 py-1 text-monte-deep">
                  {p.status === "AVAILABLE" ? "Available" : p.status === "RESERVED" ? "Reserved" : "Sold"}
                </span>
                <span className="rounded-xs bg-ink/[0.06] px-2 py-1 text-ink-2">{formatArea(p.areaSquareMeters)}</span>
                {p.isDemo && (
                  <span className="rounded-xs bg-earth-soft px-2 py-1 text-earth">Demo listing, not a real offer</span>
                )}
              </div>

              <p className="mt-8 max-w-[62ch] text-xl leading-relaxed text-ink">{p.description}</p>
            </div>

            <aside
              className="lg:sticky lg:top-6 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start"
              aria-label="Price and payment plan"
            >
              <PaymentPlan property={p} />
            </aside>

            <div className="min-w-0 lg:col-start-1 lg:row-start-2">
              <section aria-labelledby="facts-heading">
                <h2 id="facts-heading" className="text-xl font-semibold tracking-tight">
                  About the land
                </h2>
                <div className="mt-4">
                  <PropertyFacts property={p} />
                </div>
              </section>

              <section aria-labelledby="where-heading" className="mt-12">
                <h2 id="where-heading" className="text-xl font-semibold tracking-tight">
                  Where it is
                </h2>
                <p className="mt-1.5 max-w-[60ch] text-[0.9375rem] text-ink-2">
                  The pink outline is {formatArea(p.areaSquareMeters)} drawn to scale, a square of the lot&rsquo;s area.
                  Exact boundaries come with the survey.
                </p>
                <div className="mt-4 h-[22rem] overflow-hidden rounded-md border border-line sm:h-[26rem]">
                  <LotMap property={p} />
                </div>
              </section>
            </div>
          </div>
        </div>

        <section aria-labelledby="next-heading" className="mt-20 border-t border-line bg-surface">
          <div className="mx-auto grid max-w-[78rem] gap-8 px-4 py-14 sm:px-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <h2 id="next-heading" className="text-2xl font-semibold tracking-tight">
                What happens when you say &ldquo;Make it yours&rdquo;
              </h2>
              <ol className="mt-5 grid max-w-3xl gap-5 text-[0.9375rem] text-ink-2 sm:grid-cols-3">
                <li>
                  <span className="block font-semibold text-ink">You tell us about you</span>
                  Three short steps, about a minute. No payment, no account.
                </li>
                <li>
                  <span className="block font-semibold text-ink">We reach out</span>
                  By WhatsApp, phone, or email, whichever you prefer.
                </li>
                <li>
                  <span className="block font-semibold text-ink">We walk you through it</span>
                  The lot, the paperwork, and the plan, at your pace.
                </li>
              </ol>
            </div>
            {!sold && (
              <Link href={applyHref} className={buttonClass({ size: "lg" })}>
                {p.status === "RESERVED" ? "I’m interested" : "Make it yours"}
              </Link>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />

      {!sold && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm lg:hidden">
          <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
            <p className="leading-tight">
              <span className="plat text-xl font-semibold">{formatUsd(p.monthlyPriceFromUsd)}</span>
              <span className="text-sm text-ink-2">/mo</span>
              <span className="tabular block text-sm text-ink-2">{formatUsd(p.totalPriceUsd)} total</span>
            </p>
            <Link href={applyHref} className={buttonClass({ size: "md" })}>
              {p.status === "RESERVED" ? "I’m interested" : "Make it yours"}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
