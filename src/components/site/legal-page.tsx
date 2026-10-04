import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

/** Plain reading layout for policy-style pages. */
export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" className="flex-1">
        <article className="mx-auto max-w-[44rem] px-4 pt-12 pb-20 sm:px-6 [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-monte [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_li]:mt-2.5 [&_p]:mt-4 [&_p]:leading-relaxed [&_p]:text-ink-2 [&_ul]:mt-6 [&_ul]:text-[0.9375rem] [&_ul]:text-ink-2">
          <h1 className="text-4xl font-semibold tracking-[-0.03em]">{title}</h1>
          {children}
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
