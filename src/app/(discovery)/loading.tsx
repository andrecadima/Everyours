import { SiteHeader } from "@/components/site/site-header";

export default function Loading() {
  return (
    <div className="flex h-dvh flex-col" aria-busy="true">
      <SiteHeader current="explore" />
      <div className="flex-1 lg:grid lg:grid-cols-[minmax(24rem,42%)_1fr]">
        <div className="px-4 pt-7 sm:px-6 max-lg:hidden">
          <div className="h-9 w-56 rounded-xs bg-ink/[0.06]" />
          <div className="mt-3 h-4 w-64 rounded-xs bg-ink/[0.05]" />
          <div className="mt-6 flex gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-9 w-32 rounded-sm bg-ink/[0.05]" />
            ))}
          </div>
          <div className="mt-8 grid grid-cols-2 gap-5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="aspect-[3/2] animate-pulse rounded-sm bg-ink/[0.06]" />
            ))}
          </div>
        </div>
        <div className="h-full bg-[#ecebe3]" />
      </div>
      <span className="sr-only">Loading land</span>
    </div>
  );
}
