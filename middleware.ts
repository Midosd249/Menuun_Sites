import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

export async function middleware(request: NextRequest) {
  const config = getSupabasePublicConfig();
  // Keep the public site renderable in preview environments before auth
  // variables are configured; protected server operations fail closed.
  if (!config) return NextResponse.next({ request });

  let response = NextResponse.next({ request });
  const supabase = createServerClient(config.url, config.publishableKey, {
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

        // Prevent session-bearing responses from being cached/shared by a CDN.
        for (const [name, value] of Object.entries(headers ?? {})) {
          response.headers.set(name, value);
        }
        response.headers.set("Cache-Control", "private, no-store, max-age=0");
      }
    }
  });

  // Verifies the access token and refreshes an expiring session when needed.
  // Do not authorize private routes using the raw session cookie.
  await supabase.auth.getClaims();

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|assets/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"
  ]
};
