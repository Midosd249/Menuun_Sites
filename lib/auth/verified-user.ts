import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type VerifiedClaims = Record<string, unknown> & { sub: string };

export async function getVerifiedClaims(): Promise<VerifiedClaims | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data.claims || typeof data.claims.sub !== "string") {
    return null;
  }

  return data.claims as VerifiedClaims;
}
