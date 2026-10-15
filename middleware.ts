import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

// Protect all private Next.js surfaces, including /owner. Verify identity with Supabase SSR and fail closed when auth is unavailable; tenant membership is enforced separately by RLS and workspace queries.
const PRIVATE_ROUTE_PREFIXES = ["/app", "/platform-admin", "/owner"];

function isPrivateRoute(pathname: string): boolean {
  return PRIVATE_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function loginRedirect(request: NextRequest, response: NextResponse, reason?: string) {
  const destination = new URL("/login/", request.url);
  destination.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
  if (reason) destination.searchParams.set("error", reason);

  const redirectResponse = NextResponse.redirect(destination);
  response.cookies.getAll().forEach(({ name, value, ...options }) => {
    redirectResponse.cookies.set(name, value, options);
  });
  for (const name of ["cache-control", "expires", "pragma"]) {
    const value = response.headers.get(name);
    if (value) redirectResponse.headers.set(name, value);
  }
  redirectResponse.headers.set("Cache-Control", "private, no-store, max-age=0");
  return redirectResponse;
}

export async function middleware(request: NextRequest) {
  const privateRoute = isPrivateRoute(request.nextUrl.pathname);
  const publicConfig = getSupabasePublicConfig();

  // Fail closed for private application surfaces. The static owner workspace
  // handles its own login screen and is intentionally excluded above.
  if (!publicConfig) {
    if (privateRoute) return loginRedirect(request, NextResponse.next({ request }), "auth_unavailable");
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(publicConfig.url, publicConfig.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });

        for (const [name, value] of Object.entries(headers ?? {})) {
          response.headers.set(name, value);
        }
        response.headers.set("Cache-Control", "private, no-store, max-age=0");
      }
    }
  });

  let hasVerifiedIdentity = false;
  try {
    const { data, error } = await supabase.auth.getClaims();
    hasVerifiedIdentity = !error && typeof data.claims?.sub === "string";
  } catch {
    hasVerifiedIdentity = false;
  }

  if (privateRoute && !hasVerifiedIdentity) {
    return loginRedirect(request, response, "login_required");
  }

  if (privateRoute) {
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|assets/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"
  ]
};
