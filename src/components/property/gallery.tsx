import Link from "next/link";
import { PropertyPhoto } from "@/components/property/property-photo";
import type { PropertyPhoto as Photo } from "@/lib/property-types";

/** Hero plus two supporting photos on desktop; a swipeable strip on phones. */
export function Gallery({ photos, title }: { photos: Photo[]; title: string }) {
  const [hero, ...rest] = photos;
  const illustrative = photos.some((p) => p.isIllustrative);
  return (
    <figure aria-label={`Photos for ${title}`}>
      <div className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-[2fr_1fr] md:grid-rows-2 md:gap-2 md:overflow-visible md:px-0">
        <PropertyPhoto
          photo={hero ?? null}
          priority
          sizes="(min-width: 768px) 66vw, 88vw"
          className="aspect-[4/3] w-[88%] shrink-0 snap-center rounded-sm md:row-span-2 md:aspect-auto md:h-full md:min-h-[26rem] md:w-auto lg:min-h-[32rem]"
        />
        {rest.slice(0, 2).map((photo) => (
          <PropertyPhoto
            key={photo.url}
            photo={photo}
            sizes="(min-width: 768px) 33vw, 88vw"
            className="aspect-[4/3] w-[88%] shrink-0 snap-center rounded-sm md:aspect-auto md:h-full md:w-auto"
          />
        ))}
      </div>
      {illustrative && (
        <figcaption className="mt-2.5 text-[0.8125rem] text-ink-3">
          Illustrative landscape photos, not this exact lot.{" "}
          <Link href="/credits" className="underline underline-offset-2 hover:text-ink">
            Photo credits
          </Link>
        </figcaption>
      )}
    </figure>
  );
}
