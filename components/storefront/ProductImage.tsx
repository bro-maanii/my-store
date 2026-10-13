"use client";

import { ImageOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProductImageProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

export function ProductImage({
  src,
  alt,
  sizes,
  priority = false,
  className = "object-contain",
}: ProductImageProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const hasError = failedSource === src;

  if (hasError) {
    return (
      <div
        className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-50 text-slate-400"
        role="img"
        aria-label={`${alt} image unavailable`}
      >
        <ImageOff aria-hidden="true" className="h-8 w-8" />
        <span className="text-xs font-medium">Image unavailable</span>
      </div>
    );
  }

  return (
    <Image
      fill
      unoptimized
      src={src}
      alt={alt}
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setFailedSource(src)}
    />
  );
}
