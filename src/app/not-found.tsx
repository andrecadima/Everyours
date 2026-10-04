import Link from "next/link";
import { SiteHeader } from "@/components/site/site-header";
import { buttonClass } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" className="grid flex-1 place-items-center px-6 py-16">
        <div className="max-w-md text-center">
          <p className="plat text-5xl font-semibold text-monte">404</p>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">We couldn&rsquo;t find that land.</h1>
          <p className="mt-2 text-ink-2">
            The link may be old, or the lot is no longer listed. Every available lot is on the map.
          </p>
          <Link href="/" className={buttonClass({ className: "mt-6" })}>
            Explore the map
          </Link>
        </div>
      </main>
    </div>
  );
}
