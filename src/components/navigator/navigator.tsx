"use client";

import { useEventObserver } from "@/hooks/events-observer";
import { roleStrategy } from "@/strategies/role";
import { useLocale } from "next-intl";

const normalizeRole = (role: string) => role.trim().toLowerCase();

const resolveDashboardRoute = (role: string) => {
  const normalizedRole = normalizeRole(role);
  const strategy = roleStrategy[normalizedRole as keyof typeof roleStrategy];
  if (strategy) {
    return strategy.getDashboardRoute();
  }

  // Fallback convention for newly introduced roles.
  return `/dashboard/${normalizedRole}`;
};

const resolveCallbackUrl = () => {
  const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl");
  if (!callbackUrl?.startsWith("/")) return null;
  if (callbackUrl.startsWith("//")) return null;
  return callbackUrl;
};

const Navigator = () => {
  const locale = useLocale();

  useEventObserver("LoginSucceeded", (payload) => {
    const primaryRole = payload.roles[0] ?? "";
    const route = resolveCallbackUrl() ?? (primaryRole ? resolveDashboardRoute(primaryRole) : "/dashboard");
    console.log("route", route);
    console.log("locale", locale);
    window.location.href = route.startsWith(`/${locale}`) ? route : `/${locale}${route}`;
  });

  return <div />;
};
export { Navigator };
