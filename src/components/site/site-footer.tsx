import Link from "next/link";
import { LogoMark } from "@/components/site/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[78rem] flex-col gap-6 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div className="max-w-sm">
          <LogoMark className="text-monte" />
          <p className="mt-3 font-semibold">A piece of paradise. Forever yours.</p>
          <p className="mt-1 text-sm text-ink-3">
            Demo version: listings, prices, and payment plans are illustrative and not offers.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-2">
          <Link className="hover:text-ink hover:underline" href="/how-it-works">How it works</Link>
          <Link className="hover:text-ink hover:underline" href="/privacy">Privacy</Link>
          <Link className="hover:text-ink hover:underline" href="/terms">Terms</Link>
          <Link className="hover:text-ink hover:underline" href="/credits">Photo credits</Link>
        </nav>
      </div>
    </footer>
  );
}
