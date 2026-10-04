"use client";

import Image from "next/image";
import { useState } from "react";
import { LogoMark } from "@/components/site/logo";
import type { PropertyPhoto as Photo } from "@/lib/property-types";
import { cn } from "@/lib/utils";

/** next/image with a calm, on-brand fallback when a photo fails to load. */
export function PropertyPhoto({
  photo,
  sizes,
  priority,
  className,
  imgClassName,
}: {
  photo: Photo | null;
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={cn("relative overflow-hidden bg-monte-soft", className)}>
      {photo && !failed ? (
        <Image
          src={photo.url}
          alt={photo.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover", imgClassName)}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center text-monte/50" role="img" aria-label="Photo unavailable">
          <LogoMark className="size-8" />
        </div>
      )}
    </div>
  );
}
