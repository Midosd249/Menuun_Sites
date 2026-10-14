"use client";

import { useState } from "react";

type SalonImageProps = {
  className?: string;
  src: string;
  alt: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
};

/** Client boundary for resilient remote photography; never pass event handlers from a Server Component. */
export default function SalonImage({
  className,
  src,
  alt,
  loading = "lazy",
  fetchPriority,
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
      onError={() => setFailed(true)}
    />
  );
}
