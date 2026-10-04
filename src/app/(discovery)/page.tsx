import { connection } from "next/server";
import { Discovery } from "@/components/discovery/discovery";
import { SiteHeader } from "@/components/site/site-header";
import { parseFilters } from "@/lib/filters";
import { listProperties } from "@/lib/properties";

export default async function HomePage({ searchParams }: PageProps<"/">) {
  await connection(); // Listings are live data; never prerender them at build time.
  const [properties, params] = await Promise.all([listProperties(), searchParams]);
  const areas = [...new Set(properties.map((p) => p.area))];

  return (
    <div className="flex h-dvh flex-col">
      <SiteHeader current="explore" />
      <Discovery properties={properties} initialFilters={parseFilters(params, areas)} />
    </div>
  );
}
