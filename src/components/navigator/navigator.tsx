"use client";

import { useEventObserver } from "@/hooks/events-observer";
import { roleStrategy } from "@/strategies/role";
import { useLocale } from "next-intl";

const resolveDashboardRoute = (role: string) => {
  const normalizedRole = role.trim().toLowerCase();
  const strategy = roleStrategy[normalizedRole as keyof typeof roleStrategy];
  if (strategy) {
    return strategy.getDashboardRoute();
  }

  // Fallback convention for newly introduced roles.
  return `/dashboard/${normalizedRole}`;
};

const Navigator = () => {
  const locale = useLocale();

  useEventObserver("LoginSucceeded", (payload) => {
    const primaryRole = payload.roles[0] ?? "";
    const route = primaryRole ? resolveDashboardRoute(primaryRole) : "/dashboard";
    window.location.href = `/${locale}${route}`;
  });

  return <div />;
};
export { Navigator };
