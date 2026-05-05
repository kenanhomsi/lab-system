import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { getToken } from "next-auth/jwt";
import { getAuthSecret } from "./lib/auth-secret";

const intlMiddleware = createIntlMiddleware(routing);

const protectedRoutes: Record<string, string[]> = {
  "/my-results": ["patient", "doctor", "LabPartner"],
  "/insurance-request": ["patient"],
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

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

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
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
