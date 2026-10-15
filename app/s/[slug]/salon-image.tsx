"use client";

import { useEffect, useState, type CSSProperties } from "react";

type SalonImageProps = {
  className?: string;
  src: string;
  alt: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  style?: CSSProperties;
  fallbackSrc?: string;
};

/** Client boundary for resilient remote photography; never pass event handlers from a Server Component. */
export default function SalonImage({
  className,
  src,
  alt,
  loading = "lazy",
  fetchPriority,
  style,
  fallbackSrc,
}: SalonImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [failed, setFailed] = useState(false);

  useEffect(() => { setCurrentSrc(src); setFailed(false); }, [src]);

  if (failed) return null;

  return (
    <img
      className={className}
      src={currentSrc}
      alt={alt}
      loading={loading}
      fetchPriority={fetchPriority}
      style={style}
      onError={() => { if (fallbackSrc && currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc); else setFailed(true); }}
    />
  );
}
