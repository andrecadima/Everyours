import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { Logo } from "@/components/site/logo";
import { cn } from "@/lib/utils";

export function SiteHeader({ current, className }: { current?: "explore" | "how"; className?: string }) {
  const link = (active: boolean) =>
    cn(
      "rounded-sm px-2.5 py-1.5 text-[0.9375rem] font-medium transition-colors hover:text-ink",
      active ? "text-ink" : "text-ink-2",
    );
  return (
    <header className={cn("relative z-30 border-b border-line bg-paper", className)}>
      <div className="flex h-14 items-center gap-2 px-4 sm:px-5">
        <Link href="/" className="-ml-1 rounded-sm px-1 py-1" aria-label="Everyours home">
          <Logo />
        </Link>
        <nav aria-label="Main" className="ml-auto flex items-center gap-0.5 sm:gap-1">
          <Link href="/" className={cn(link(current === "explore"), "max-sm:hidden")} aria-current={current === "explore" ? "page" : undefined}>
            Explore
          </Link>
          <Link
            href="/how-it-works"
            className={cn(link(current === "how"), "whitespace-nowrap", current !== "explore" && current !== "how" && "max-sm:hidden")}
            aria-current={current === "how" ? "page" : undefined}
          >
            How it works
          </Link>
          {current !== "explore" && (
            <Link href="/" className={buttonClass({ size: "sm", className: "ml-2" })}>
              Find your land
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
