export type SocialPlatform = "instagram" | "tiktok" | "snapchat" | "facebook" | "google_maps" | "website";
export function normalizeSocialUrl(platform: SocialPlatform, input: string): string | null;
