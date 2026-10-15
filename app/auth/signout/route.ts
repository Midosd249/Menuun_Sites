import { NextResponse, type NextRequest } from "next/server";
import { safeRedirectPath } from "@/lib/auth/redirect.mjs";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData().catch(() => null);
  const nextPath = safeRedirectPath(
    typeof formData?.get("next") === "string" ? String(formData.get("next")) : null,
    "/login/"
  );

  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch {
    // Always return to a safe local destination; no session details are exposed.
  }

  return NextResponse.redirect(new URL(nextPath, request.url), { status: 303 });
}
