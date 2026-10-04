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

export default async function ApplyPage({ params, searchParams }: PageProps<"/properties/[slug]/apply">) {
  await connection();
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const interested = query.intent === "interested" || property.status === "RESERVED";

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-line">
        <div className="mx-auto flex h-14 max-w-[72rem] items-center justify-between px-4 sm:px-6">
          <Link href="/" className="-ml-1 rounded-sm px-1 py-1" aria-label="Everyours home">
            <Logo />
          </Link>
          <Link
            href={`/properties/${property.slug}`}
            className="inline-flex h-10 items-center gap-1.5 rounded-sm px-2 text-[0.9375rem] font-medium text-ink-2 hover:text-ink"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to the lot
          </Link>
        </div>
      </header>

      <main id="main" className="flex-1">
        <div className="mx-auto grid max-w-[72rem] gap-10 px-4 pt-8 pb-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-20 lg:pt-14">
          <div className="max-w-xl">
            <h1 className="sr-only">
              {interested ? "Tell us you’re interested in" : "Make it yours:"} {property.name}, {property.lotLabel}
            </h1>
            {property.status === "SOLD" ? (
              <div className="rounded-md border border-line bg-surface p-6">
                <p className="text-xl font-semibold">This lot has been sold.</p>
                <p className="mt-2 text-ink-2">There&rsquo;s more land on the map, with plans from about $100/month.</p>
                <Link href="/" className={buttonClass({ className: "mt-5" })}>
                  Explore the map
                </Link>
              </div>
            ) : (
              <>
                {property.status === "RESERVED" && (
                  <p className="mb-6 rounded-sm bg-earth-soft px-4 py-3 text-[0.9375rem] text-earth">
                    This lot is reserved right now. Leave your details and we&rsquo;ll tell you if it becomes available,
                    or suggest similar land.
                  </p>
                )}
                <LeadForm property={property} />
              </>
            )}
          </div>
          <aside className="max-lg:hidden" aria-label="Your selected lot">
            <div className="sticky top-8">
              <SelectedLot property={property} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
