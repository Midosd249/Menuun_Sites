/**
 * Accept only a relative, same-origin path. This function is intentionally
 * independent of Next.js so its open-redirect behavior can be unit tested.
 * @param {string | null | undefined} candidate
 * @param {string} [fallback]
 * @returns {string}
 */
export function safeRedirectPath(candidate, fallback = "/") {
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
