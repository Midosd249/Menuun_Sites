const platforms = {
  instagram: { label: "Instagram", host: /(^|\.)instagram\.com$/i, build: value => "https://instagram.com/" + value.replace(/^@/, "") },
  tiktok: { label: "TikTok", host: /(^|\.)tiktok\.com$/i, build: value => "https://www.tiktok.com/@" + value.replace(/^@/, "") },
  snapchat: { label: "Snapchat", host: /(^|\.)snapchat\.com$/i, build: value => "https://www.snapchat.com/add/" + value.replace(/^@/, "") },
  facebook: { label: "Facebook", host: /(^|\.)facebook\.com$/i, build: value => "https://www.facebook.com/" + value.replace(/^@/, "") },
  google_maps: { label: "Google Maps", host: /(^|\.)google\.(com|sa)$/i, build: value => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(value.replace(/^@/, "")) },
  website: { label: "Website", host: null, build: null }
};

export function normalizeSocialUrl(platform, input) {
  const raw = typeof input === "string" ? input.trim() : "";
  if (!raw) return null;
  const config = platforms[platform];
  if (!config) throw new Error("Unsupported social platform");
  if (platform === "website") {
    let url;
    if (!/^https:\/\//i.test(raw)) throw new Error("Website must be a valid HTTPS URL");
    try { url = new URL(raw); } catch { throw new Error("Website must be a valid HTTPS URL"); }
    if (url.protocol !== "https:" || !url.hostname.includes(".") || url.username || url.password) throw new Error("Website must be a valid HTTPS URL");
    return url.toString();
  }
  if (/^https?:\/\//i.test(raw)) {
    let url;
    try { url = new URL(raw); } catch { throw new Error(config.label + " URL is invalid"); }
    if (url.protocol !== "https:" || !config.host.test(url.hostname) || url.username || url.password) throw new Error(config.label + " URL must use its official HTTPS domain");
    return url.toString();
  }
  const handle = raw.replace(/^@/, "");
  if (!/^[\p{L}\p{N}._-]{1,80}$/u.test(handle)) throw new Error(config.label + " handle is invalid");
  return config.build(handle);
}
