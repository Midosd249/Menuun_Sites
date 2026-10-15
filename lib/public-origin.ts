export function getMenuunPublicOrigin(): string {
  const fallback = "https://menuun-sites.vercel.app";
  const configured = process.env.MENUUN_PUBLIC_ORIGIN?.trim();
  if (!configured) return fallback;
  try {
    const parsed = new URL(configured);
    if (parsed.protocol !== "https:" || parsed.pathname !== "/" || parsed.search || parsed.hash) return fallback;
    return parsed.origin;
  } catch {
    return fallback;
  }
}
