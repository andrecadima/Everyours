import { cn } from "@/lib/utils";

/** A corner stake with its flag: the moment a piece of land becomes yours. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("size-6", className)}>
      <rect x="5" y="2.5" width="2.2" height="19" rx="1" fill="currentColor" />
      <path d="M8 3.5h10.2a.8.8 0 0 1 .62 1.3L16.4 8l2.42 3.2a.8.8 0 0 1-.62 1.3H8z" fill="currentColor" />
      <ellipse cx="6.1" cy="21.6" rx="3.6" ry="1" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-monte", className)}>
      <LogoMark className="size-[22px]" />
      <span className="text-[1.3125rem] font-semibold tracking-[-0.03em] text-ink [font-stretch:108%]">everyours</span>
    </span>
  );
}
