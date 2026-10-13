const FALLBACK_PATH = "/";

export function safeRedirectPath(
  candidate: string | null | undefined,
  fallback = FALLBACK_PATH
): string {
  if (
    !candidate ||
    !candidate.startsWith("/") ||
    candidate.startsWith("//") ||
    candidate.includes("\\") ||
    candidate.includes("\u0000")
  ) {
    return fallback;
  }

  try {
    const url = new URL(candidate, "https://menuun.invalid");
    if (url.origin !== "https://menuun.invalid") return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
