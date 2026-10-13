import { NextResponse, type NextRequest } from "next/server";
import { safeRedirectPath } from "@/lib/auth/redirect";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const nextPath = safeRedirectPath(url.searchParams.get("next"), "/login/");

  if (!code) {
    const failure = new URL("/login/", request.url);
    failure.searchParams.set("error", "missing_code");
    return NextResponse.redirect(failure);
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      const failure = new URL("/login/", request.url);
      failure.searchParams.set("error", "callback_failed");
      return NextResponse.redirect(failure);
    }

    return NextResponse.redirect(new URL(nextPath, request.url));
  } catch {
    const failure = new URL("/login/", request.url);
    failure.searchParams.set("error", "auth_unavailable");
    return NextResponse.redirect(failure);
  }
}
