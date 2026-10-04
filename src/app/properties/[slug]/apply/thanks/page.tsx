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

export default async function ThanksPage({ params }: PageProps<"/properties/[slug]/apply/thanks">) {
  await connection();
  const property = await getPropertyBySlug((await params).slug);
  if (!property) notFound();

  return (
    <div className="flex min-h-dvh flex-col bg-monte text-paper">
      <header>
        <div className="mx-auto flex h-14 max-w-[72rem] items-center px-4 sm:px-6">
          <Link href="/" className="-ml-1 rounded-sm px-1 py-1 [&_*]:!text-paper" aria-label="Everyours home">
            <Logo />
          </Link>
        </div>
      </header>
      <main id="main" className="flex flex-1 items-center">
        <div className="mx-auto grid w-full max-w-[72rem] items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <div className="animate-rise">
            <h1 className="text-[clamp(2.75rem,2rem+3.5vw,4.5rem)] leading-[0.98] font-semibold tracking-[-0.035em]">
              This could be yours.
            </h1>
            <p className="mt-6 text-lg text-monte-ink">We&rsquo;ve received your interest in</p>
            <p className="mt-1 text-2xl font-semibold" data-testid="thanks-property">
              {property.name}, {property.lotLabel}
            </p>
            <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-monte-ink">
              The Everyours team will contact you soon to walk you through the next steps.
            </p>
            <p className="mt-3 max-w-[46ch] text-[0.9375rem] text-monte-ink/90">
              An inquiry isn&rsquo;t a reservation: the lot isn&rsquo;t held or purchased until you decide, together
              with our team.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/" className={buttonClass({ variant: "onDark", size: "lg" })}>
                Keep exploring
              </Link>
              <Link
                href={`/properties/${property.slug}`}
                className="inline-flex h-13 items-center rounded-sm border border-paper/30 px-6 font-semibold text-paper transition-colors hover:border-paper/70 hover:bg-paper/5"
              >
                View my selected property
              </Link>
            </div>
          </div>
          <div className="relative">
            <PropertyPhoto
              photo={property.photo}
              priority
              sizes="(min-width: 768px) 45vw, 100vw"
              className="aspect-[4/5] rounded-md max-md:aspect-[4/3]"
            />
            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-sm bg-surface px-3 py-2 text-sm font-medium text-ink shadow-float">
              <span className="block h-3.5 w-[3px] rounded-full bg-tajibo" aria-hidden="true" />
              {property.area}, Santa Cruz
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
