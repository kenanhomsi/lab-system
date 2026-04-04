import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { getToken } from "next-auth/jwt";

const intlMiddleware = createIntlMiddleware(routing);

const protectedRoutes: Record<string, string[]> = {
  "/book-appointment": ["patient", "doctor", "lab"],
  "/my-results": ["patient", "doctor", "lab"],
  "/insurance-request": ["patient"],
  "/subscriptions": ["patient"],
  "/doctor": ["doctor"],
  "/lab": ["lab"],
  "/special": ["special"],
};

function getRequiredRoles(pathname: string): string[] | null {
  const pathWithoutLocale = pathname.replace(/^\/(en|ar)/, "");

  for (const [route, roles] of Object.entries(protectedRoutes)) {
    if (pathWithoutLocale === route || pathWithoutLocale.startsWith(route + "/")) {
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
      secret: process.env.AUTH_SECRET || "dev-secret-change-in-production",
    });

    if (!token) {
      const locale = pathname.match(/^\/(en|ar)/)?.[1] || "ar";
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const userRole = token.role as string;
    if (!requiredRoles.includes(userRole)) {
      const locale = pathname.match(/^\/(en|ar)/)?.[1] || "ar";
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
