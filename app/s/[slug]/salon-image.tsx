"use client";

import { useState, type CSSProperties } from "react";

type SalonImageProps = {
  className?: string;
  src: string;
  alt: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  style?: CSSProperties;
};

/** Client boundary for resilient remote photography; never pass event handlers from a Server Component. */
export default function SalonImage({
  className,
  src,
  alt,
  loading = "lazy",
  fetchPriority,
  style,
}: SalonImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading={loading}
      fetchPriority={fetchPriority}
      style={style}
      onError={() => setFailed(true)}
    />
  );
}
