import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type VerifiedClaims = Record<string, unknown> & { sub: string };

export async function getVerifiedClaims(): Promise<VerifiedClaims | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getClaims();

  const claims = data?.claims;
  if (error || !claims || typeof claims.sub !== "string") {
    return null;
  }

  return claims as VerifiedClaims;
}
