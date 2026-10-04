"use client";

import Link from "next/link";
import { LogoMark } from "@/components/site/logo";
import { Button, buttonClass } from "@/components/ui/button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main" className="grid min-h-dvh place-items-center px-6">
      <div className="max-w-md text-center">
        <LogoMark className="mx-auto size-8 text-monte" />
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">We couldn&rsquo;t load this page.</h1>
        <p className="mt-2 text-ink-2">
          Something on our side didn&rsquo;t respond. Your connection is fine; try again in a moment.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Link href="/" className={buttonClass({ variant: "secondary" })}>
            Back to the map
          </Link>
        </div>
      </div>
    </main>
  );
}
