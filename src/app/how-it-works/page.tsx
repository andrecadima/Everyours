import type { Metadata } from "next";
import Link from "next/link";
import { PropertyPhoto } from "@/components/property/property-photo";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { buttonClass } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "How it works",
  description: "Find land in Santa Cruz, Bolivia, see the full price and an example monthly plan, and tell us you're interested.",
};

const steps = [
  {
    title: "Find your place",
    body: "Explore available land across Santa Cruz on the map.",
  },
  {
    title: "Choose what feels right",
    body: "See the property, the full price, and an example monthly plan upfront.",
  },
  {
    title: "Make it yours",
    body: "Tell us you’re interested and our team will guide you through the next steps.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader current="how" />
      <main id="main" className="flex-1">
        <section className="mx-auto grid max-w-[72rem] gap-12 px-4 pt-12 pb-20 sm:px-6 lg:grid-cols-[1fr_1fr] lg:gap-20 lg:pt-20">
          <div>
            <h1 className="text-[length:var(--text-display)] leading-[var(--text-display--line-height)] font-semibold tracking-[var(--text-display--letter-spacing)]">
              Land ownership, within reach.
            </h1>
            <ol className="mt-12 space-y-9">
              {steps.map((step, i) => (
                <li key={step.title} className="grid grid-cols-[3rem_1fr] items-baseline gap-2">
                  <span className="plat text-3xl font-semibold text-monte" aria-hidden="true">
                    {i + 1}
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight">
                      <span className="sr-only">Step {i + 1}: </span>
                      {step.title}
                    </h2>
                    <p className="mt-1 max-w-[42ch] text-lg text-ink-2">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-12 rounded-md bg-monte-soft p-5 text-[0.9375rem] leading-relaxed text-monte-deep">
              Payment plans shown are examples; final terms are confirmed with our team. Telling us you&rsquo;re
              interested is free and never reserves or buys a lot.
            </div>
            <Link href="/" className={buttonClass({ size: "lg", className: "mt-8" })}>
              Find your land
            </Link>
          </div>
          <PropertyPhoto
            photo={{
              url: "/images/demo/samaipata-valley.jpg",
              alt: "A tree framing a view across a green valley in Santa Cruz, Bolivia",
              credit: null,
              creditUrl: null,
              isIllustrative: true,
            }}
            priority
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="aspect-[4/5] rounded-md max-lg:aspect-[4/3]"
          />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
