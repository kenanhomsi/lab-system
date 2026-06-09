import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { getToken } from "next-auth/jwt";
import { getAuthSecret } from "./lib/auth-secret";
import { getMiddlewareHubRewriteBackend } from "./lib/api/signalr-hub-base-url";

const intlMiddleware = createIntlMiddleware(routing);

const protectedRoutes: Record<string, string[]> = {
  "/my-results": ["patient", "doctor", "LabPartner"],
  "/patient/insurance-approval-requests": ["patient"],
  "/order-test-request": ["patient"],
  "/subscriptions": ["patient"],
  "/profile": ["patient", "doctor", "LabPartner", "admin", "special"],
  "/admin": ["admin"],
  "/doctor": ["doctor"],
  "/patient": ["patient"],
  "/lab": ["LabPartner"],
  "/secretary": ["secretary"],
  "/special": ["special"],
};

function getRequiredRoles(pathname: string): string[] | null {
  const pathWithoutLocale = pathname.replace(/^\/(en|ar)/, "");

  for (const [route, roles] of Object.entries(protectedRoutes)) {
    if (
      pathWithoutLocale === route ||
      pathWithoutLocale.startsWith(route + "/")
    ) {
      return roles;
    }
  }
  return null;
}

/** Runtime rewrite: same-origin `/hubs/*` → upstream API (not build-time rewrites). */
function rewriteSignalRHub(request: NextRequest): NextResponse | null {
  const pathname = request.nextUrl.pathname;
  if (!pathname.startsWith("/hubs/")) return null;

  const backend = getMiddlewareHubRewriteBackend();
  if (!backend) return null;

  const target = new URL(`${pathname}${request.nextUrl.search}`, `${backend}/`);
  return NextResponse.rewrite(target);
}

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const hubRewrite = rewriteSignalRHub(request);
  if (hubRewrite) return hubRewrite;

  const requiredRoles = getRequiredRoles(pathname);

  if (requiredRoles) {
    const token = await getToken({
      req: request,
      secret: getAuthSecret(),
    });

    if (!token) {
      const locale = pathname.match(/^\/(en|ar)/)?.[1] || "ar";
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const userRoles = (token.roles as string[]) ?? [];
    const hasAccess = userRoles.some((r) =>
      requiredRoles.map((role) => role.toLowerCase()).includes(r.toLowerCase()),
    );

    if (!hasAccess) {
      const locale = pathname.match(/^\/(en|ar)/)?.[1] || "ar";
      return NextResponse.redirect(new URL(`/${locale}/forbidden`, request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/hubs/:path*",
    "/((?!api|hubs|_next|_vercel|.*\\..*).*)",
  ],
};
