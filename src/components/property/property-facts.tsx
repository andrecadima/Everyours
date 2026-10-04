import { formatArea, formatCoordinates, formatSquareFeet } from "@/lib/format";
import {
  ROAD_ACCESS_LABEL,
  STATUS_LABEL,
  TERRAIN_LABEL,
  UTILITY_LABEL,
  type PropertyDetail,
} from "@/lib/property-types";

export function PropertyFacts({ property: p }: { property: PropertyDetail }) {
  const rows: [string, React.ReactNode][] = [
    ["Lot size", <>{formatArea(p.areaSquareMeters)} <span className="text-ink-3">({formatSquareFeet(p.areaSquareMeters)})</span></>],
    ["Area", `${p.area}${p.area !== p.municipality ? `, ${p.municipality}` : ""}`],
    ["Department", `${p.department}, ${p.country}`],
    ["Road access", p.roadAccess ? ROAD_ACCESS_LABEL[p.roadAccess] : "To be confirmed"],
    ["Terrain", p.terrain ? TERRAIN_LABEL[p.terrain] : "To be confirmed"],
    ["Utilities", p.utilities.length ? p.utilities.map((u) => UTILITY_LABEL[u]).join(", ") : "None connected yet"],
    ["Availability", STATUS_LABEL[p.status]],
    ["Payment options", "Monthly plan or full payment"],
    ["General location", formatCoordinates(p.latitude, p.longitude)],
    ["Reference", p.referenceCode],
  ];
  return (
    <dl className="grid grid-cols-1 border-t border-line sm:grid-cols-2 sm:gap-x-10">
      {rows.map(([label, value]) => (
        <div key={label} className="flex justify-between gap-6 border-b border-line py-3.5 text-[0.9375rem]">
          <dt className="text-ink-2">{label}</dt>
          <dd className="tabular text-right font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
