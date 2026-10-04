import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { formatTerm, formatUsd } from "@/lib/format";
import type { PropertyDetail } from "@/lib/property-types";
import { cn } from "@/lib/utils";

/**
 * Affordability without hiding the price: the monthly amount leads, and the
 * plan's own arithmetic (down + months × monthly = total) is shown as proof.
 */
export function PaymentPlan({ property: p, className }: { property: PropertyDetail; className?: string }) {
  const reserved = p.status === "RESERVED";
  const sold = p.status === "SOLD";
  const applyHref = `/properties/${p.slug}/apply`;

  return (
    <section
      aria-labelledby="plan-heading"
      className={cn("rounded-md bg-monte p-6 text-paper shadow-[0_24px_48px_-28px_rgb(22_54_40/0.7)] sm:p-7", className)}
      data-testid="payment-plan"
    >
      <h2 id="plan-heading" className="text-[0.9375rem] font-medium text-monte-ink">
        {reserved ? "Reserved for now. Plan from" : sold ? "This lot has been sold" : "Own this land from"}
      </h2>
      <p className="mt-1 flex items-baseline gap-1">
        <span className="plat text-[3.25rem] leading-none font-semibold tracking-[-0.03em]">
          {formatUsd(p.monthlyPriceFromUsd)}
        </span>
        <span className="text-lg text-monte-ink">/month</span>
      </p>
      <p className="mt-2 text-[0.9375rem] text-monte-ink">
        for {p.termMonths} months, after {formatUsd(p.downPaymentUsd)} down
      </p>

      <dl className="tabular mt-6 border-t border-paper/20 pt-4 text-[0.9375rem]">
        <div className="flex justify-between gap-4 py-1.5">
          <dt className="text-monte-ink">Down payment</dt>
          <dd>{formatUsd(p.downPaymentUsd)}</dd>
        </div>
        <div className="flex justify-between gap-4 py-1.5">
          <dt className="text-monte-ink">Monthly payments</dt>
          <dd>
            {p.termMonths} × {formatUsd(p.monthlyPriceFromUsd)}
          </dd>
        </div>
        <div className="flex justify-between gap-4 py-1.5">
          <dt className="text-monte-ink">Example term</dt>
          <dd>{formatTerm(p.termMonths)}</dd>
        </div>
        <div className="mt-2 flex items-baseline justify-between gap-4 border-t border-paper/20 pt-3.5">
          <dt className="font-semibold">Total price</dt>
          <dd className="plat text-xl font-semibold">{formatUsd(p.totalPriceUsd)}</dd>
        </div>
      </dl>

      <p className="mt-4 text-[0.8125rem] leading-relaxed text-monte-ink">
        Example payment plan. Final terms are confirmed by the Everyours team.
      </p>

      {!sold && (
        <div className="mt-6 flex flex-col gap-2.5">
          <Link
            href={reserved ? `${applyHref}?intent=interested` : applyHref}
            className={buttonClass({ variant: "onDark", size: "lg", className: "w-full" })}
          >
            {reserved ? "I’m interested" : "Make it yours"}
          </Link>
          {!reserved && (
            <Link
              href={`${applyHref}?intent=interested`}
              className="inline-flex h-11 items-center justify-center rounded-sm text-[0.9375rem] font-medium text-paper underline decoration-paper/40 underline-offset-4 hover:decoration-paper"
            >
              I&rsquo;m interested, just questions for now
            </Link>
          )}
          <p className="text-center text-[0.8125rem] text-monte-ink">
            {reserved
              ? "We’ll tell you if it becomes available."
              : "No payment today. Telling us you’re interested doesn’t reserve the lot."}
          </p>
        </div>
      )}
    </section>
  );
}
