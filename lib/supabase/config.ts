export type SupabasePublicConfig = {
  url: string;
  publishableKey: string;
};

/**
 * Returns public Supabase configuration only when both required values exist.
 * This helper deliberately never reads or accepts a service-role/secret key.
 */
export function getSupabasePublicConfig(
  env: NodeJS.ProcessEnv = process.env
): SupabasePublicConfig | null {
  const url = env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url || !publishableKey) return null;

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.hostname !== "localhost" && parsed.hostname !== "127.0.0.1") {
      return null;
    }
  } catch {
    return null;
  }

  return { url, publishableKey };
}

export function requireSupabasePublicConfig(
  env: NodeJS.ProcessEnv = process.env
): SupabasePublicConfig {
  const config = getSupabasePublicConfig(env);
  if (!config) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
    );
  }
  return config;
}
