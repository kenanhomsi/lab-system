"use client";

import { useEffect, useMemo, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { UserRole } from "@/types/user";

type SubscriptionRow = {
  id: string;
  packageName: string;
  status?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  lastProcedureDate?: string;
  nextProcedureDate?: string;
  remainingTests?: number;
  totalTests?: number;
};

function initialsFromName(name: string | null | undefined): string {
  if (!name?.trim()) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2);
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`;
}

function formatDate(iso: string | undefined, locale: string): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
      dateStyle: "medium",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function isActiveSubscription(row: SubscriptionRow): boolean {
  if (typeof row.isActive === "boolean") return row.isActive;
  return row.status === "active";
}

const quickLinksByRole: Record<UserRole, { href: string; labelKey: string; icon: string }[]> = {
  patient: [
    { href: "/subscriptions", labelKey: "subscriptions", icon: "card_membership" },
    { href: "/my-results", labelKey: "myResults", icon: "lab_research" },
    { href: "/book-appointment", labelKey: "bookAppointment", icon: "calendar_month" },
  ],
  doctor: [
    { href: "/doctor/request-tests", labelKey: "requestTests", icon: "assignment_add" },
    { href: "/doctor/patient-list", labelKey: "patientList", icon: "group" },
    { href: "/my-results", labelKey: "myResults", icon: "lab_research" },
  ],
  lab: [
    { href: "/lab/order-tests", labelKey: "orderTests", icon: "science" },
    { href: "/lab/accounting", labelKey: "accounting", icon: "payments" },
    { href: "/my-results", labelKey: "myResults", icon: "lab_research" },
  ],
  special: [
    { href: "/special/new-payment", labelKey: "newPayment", icon: "add_card" },
    { href: "/special/account-statement", labelKey: "accountStatement", icon: "account_balance" },
    { href: "/special/daily-tasks", labelKey: "dailyTasks", icon: "task_alt" },
  ],
};

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-8 p-6 md:p-8" aria-busy="true">
      <div className="h-40 rounded-3xl bg-slate-200/80 dark:bg-slate-800" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-80 rounded-2xl bg-slate-200/80 dark:bg-slate-800" />
        <div className="h-80 rounded-2xl bg-slate-200/80 dark:bg-slate-800" />
      </div>
    </div>
  );
}

function SectionCard({
  icon,
  title,
  description,
  children,
  className,
  bodyClassName,
}: {
  icon: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200/90 bg-surface-container-lowest shadow-sm ring-1 ring-slate-900/3 dark:border-slate-700/80 dark:bg-slate-900 dark:ring-white/4",
        className,
      )}
    >
      <div className="flex items-start gap-4 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20">
          <Icon name={icon} className="text-[22px]" size="sm" />
        </div>
        <div className="min-w-0 pt-0.5">
          <h2 className="font-headline text-base font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {title}
          </h2>
          {description ? (
            <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{description}</p>
          ) : null}
        </div>
      </div>
      <div className={cn("p-5 md:p-6", bodyClassName)}>{children}</div>
    </section>
  );
}

function InfoRow({
  icon,
  label,
  value,
  mono,
}: {
  icon: string;
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <Icon name={icon} className="text-lg" size="sm" />
      </span>
      <div className="min-w-0 flex-1">
        <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {label}
        </dt>
        <dd
          className={cn(
            "mt-0.5 text-sm font-medium text-slate-900 dark:text-slate-100",
            mono && "font-mono text-[13px] font-normal tracking-tight",
          )}
        >
          {value}
        </dd>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, hint }: { icon: string; title: string; hint: string }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-800/30">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200/80 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <Icon name={icon} className="text-3xl" size="sm" />
      </div>
      <p className="font-headline text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</p>
      <p className="mt-2 max-w-sm text-xs leading-relaxed text-slate-500 dark:text-slate-400">{hint}</p>
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const locale = useLocale();
  const t = useTranslations("dashboard.profile");
  const tRole = useTranslations("auth.roles");
  const tSidebar = useTranslations("sidebar");

  const [subs, setSubs] = useState<SubscriptionRow[] | null>(null);
  const [subsError, setSubsError] = useState<string | null>(null);

  const user = session?.user;
  const role = (user?.role as UserRole) || "patient";

  useEffect(() => {
    if (role !== "patient") {
      setSubs(null);
      setSubsError(null);
      return;
    }

    let cancelled = false;
    setSubs(null);
    setSubsError(null);

    void (async () => {
      try {
        const res = await fetch("/api/subscriptions/my");
        const data = (await res.json()) as SubscriptionRow[] | { error?: string };
        if (cancelled) return;
        if (!res.ok && data && typeof data === "object" && "error" in data) {
          setSubsError(typeof data.error === "string" ? data.error : t("subscriptionError"));
          setSubs([]);
          return;
        }
        if (Array.isArray(data)) {
          setSubs(data);
        } else {
          setSubs([]);
        }
      } catch {
        if (!cancelled) {
          setSubsError(t("subscriptionError"));
          setSubs([]);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [role, t]);

  const quickLinks = quickLinksByRole[role];

  const primarySub = useMemo(() => {
    if (!subs?.length) return null;
    const active = subs.find(isActiveSubscription);
    return active ?? subs[0];
  }, [subs]);

  const testsProgress = useMemo(() => {
    if (!primarySub || typeof primarySub.remainingTests !== "number" || typeof primarySub.totalTests !== "number") {
      return null;
    }
    const total = primarySub.totalTests;
    if (total <= 0) return null;
    const pct = Math.min(100, Math.max(0, (primarySub.remainingTests / total) * 100));
    return { pct, remaining: primarySub.remainingTests, total };
  }, [primarySub]);

  if (status === "loading") {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-surface pb-10">
      <div className="mx-auto max-w-7xl space-y-8 p-6 md:p-8">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary via-[#007f9e] to-primary-container shadow-lg shadow-primary/20 dark:shadow-primary/10">
          <div className="pointer-events-none absolute -inset-e-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -inset-s-20 h-56 w-56 rounded-full bg-black/5 blur-2xl dark:bg-black/20" />
          <div className="relative z-10 p-6 text-white md:p-10">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
              <div
                className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl bg-white/15 text-3xl font-bold tracking-tight text-white ring-4 ring-white/20 backdrop-blur-sm"
                aria-hidden
              >
                {initialsFromName(user?.fullName)}
                <span className="absolute -bottom-1 -inset-e-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400 text-[#003544] shadow-md ring-2 ring-white/30 dark:ring-slate-900/50">
                  <Icon name="verified" className="text-base" size="sm" filled />
                </span>
              </div>
              <div className="min-w-0 text-center sm:text-start">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">{t("pageTitle")}</p>
                <h1 className="mt-1 font-headline text-2xl font-extrabold tracking-tight md:text-3xl">
                  {user?.fullName ?? "—"}
                </h1>
                <p className="mt-1 truncate text-sm font-medium text-white/85">{user?.email ?? "—"}</p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                  <Icon name="workspace_premium" className="text-sm text-amber-200" size="sm" />
                  {tRole(role)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <SectionCard
            icon="person"
            title={t("sectionAccount")}
            description={t("heading")}
          >
            <dl className="divide-y divide-slate-100 dark:divide-slate-800">
              <InfoRow icon="badge" label={t("fullName")} value={user?.fullName ?? "—"} />
              <InfoRow icon="mail" label={t("email")} value={user?.email ?? "—"} />
              <InfoRow
                icon="smartphone"
                label={t("mobile")}
                value={<span dir="ltr">{user?.mobile ?? "—"}</span>}
              />
              <InfoRow icon="clinical_notes" label={t("role")} value={tRole(role)} />
              <InfoRow icon="fingerprint" label={t("userId")} value={user?.id ?? "—"} mono />
              {user?.institutionId ? (
                <InfoRow icon="apartment" label={t("institutionId")} value={user.institutionId} mono />
              ) : null}
            </dl>
          </SectionCard>

          <SectionCard icon="card_membership" title={t("sectionSubscription")}>
            {role !== "patient" ? (
              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="flex gap-3">
                  <Icon name="info" className="shrink-0 text-primary" size="sm" />
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {t("subscriptionsPatientOnly")}
                  </p>
                </div>
              </div>
            ) : subs === null ? (
              <div className="space-y-3" aria-busy="true">
                <div className="h-4 max-w-xs animate-pulse rounded bg-slate-200 dark:bg-slate-700 w-[60%]" />
                <div className="h-4 max-w-sm animate-pulse rounded bg-slate-200 dark:bg-slate-700 w-[75%]" />
                <div className="h-4 max-w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-700 w-[40%]" />
              </div>
            ) : subsError ? (
              <div className="rounded-xl border border-red-200 bg-red-50/80 p-4 dark:border-red-900/40 dark:bg-red-950/30">
                <div className="flex gap-3">
                  <Icon name="error" className="shrink-0 text-red-600 dark:text-red-400" size="sm" />
                  <p className="text-sm text-red-800 dark:text-red-200">{subsError}</p>
                </div>
              </div>
            ) : !primarySub ? (
              <div className="space-y-5">
                <EmptyState
                  icon="subscriptions"
                  title={t("noSubscriptions")}
                  hint={t("noSubscriptionsHint")}
                />
                <Link
                  href="/subscriptions"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-md shadow-primary/25 transition hover:opacity-95"
                >
                  <Icon name="rocket_launch" className="text-lg" size="sm" />
                  {t("manageSubscription")}
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                <div
                  className={cn(
                    "relative overflow-hidden rounded-2xl p-5 text-white shadow-md",
                    isActiveSubscription(primarySub)
                      ? "bg-linear-to-br from-primary to-[#005a72]"
                      : "bg-linear-to-br from-slate-600 to-slate-800 dark:from-slate-700 dark:to-slate-900",
                  )}
                >
                  <div className="pointer-events-none absolute -inset-e-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                  <div className="relative flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                        {isActiveSubscription(primarySub) ? t("statusActive") : t("statusInactive")}
                      </span>
                      <p className="mt-3 font-headline text-lg font-bold leading-snug md:text-xl">
                        {primarySub.packageName}
                      </p>
                    </div>
                    <Link
                      href="/subscriptions"
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-bold ring-1 ring-white/25 transition hover:bg-white/25"
                    >
                      {t("manageSubscription")}
                      <Icon name="chevron_right" className="text-base rtl:rotate-180" size="sm" />
                    </Link>
                  </div>
                  <dl className="relative mt-5 grid gap-3 border-t border-white/20 pt-4 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-[10px] font-bold uppercase tracking-wider text-white/60">{t("validFrom")}</dt>
                      <dd className="mt-0.5 font-medium">{formatDate(primarySub.startDate, locale)}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-bold uppercase tracking-wider text-white/60">{t("validTo")}</dt>
                      <dd className="mt-0.5 font-medium">{formatDate(primarySub.endDate, locale)}</dd>
                    </div>
                    {primarySub.nextProcedureDate ? (
                      <div className="sm:col-span-2">
                        <dt className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          {t("nextProcedure")}
                        </dt>
                        <dd className="mt-0.5 font-medium">{formatDate(primarySub.nextProcedureDate, locale)}</dd>
                      </div>
                    ) : null}
                    {primarySub.lastProcedureDate ? (
                      <div className="sm:col-span-2">
                        <dt className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          {t("lastProcedure")}
                        </dt>
                        <dd className="mt-0.5 font-medium">{formatDate(primarySub.lastProcedureDate, locale)}</dd>
                      </div>
                    ) : null}
                  </dl>
                  {testsProgress ? (
                    <div className="relative mt-4 border-t border-white/20 pt-4">
                      <div className="mb-1.5 flex justify-between text-[10px] font-bold uppercase tracking-wider text-white/70">
                        <span>{t("testsRemaining")}</span>
                        <span>
                          {t("testsRatio", { remaining: testsProgress.remaining, total: testsProgress.total })}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-black/20 dark:bg-black/30">
                        <div
                          className="h-full rounded-full bg-white/90 transition-all duration-500 dark:bg-primary-fixed"
                          style={{ width: `${testsProgress.pct}%` }}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </SectionCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard icon="shield_lock" title={t("sectionActions")} description={t("changePasswordHint")}>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/forgot-password"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-primary/30 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900 sm:flex-none"
              >
                <Icon name="key" className="text-primary" size="sm" />
                {t("changePassword")}
              </Link>
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200/80 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300 dark:hover:bg-red-950/70 sm:flex-none"
                onClick={() => void signOut({ callbackUrl: `/${locale}` })}
              >
                <Icon name="logout" size="sm" />
                {t("signOut")}
              </button>
            </div>
          </SectionCard>

          <SectionCard icon="bolt" title={t("sectionQuick")}>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/dashboard"
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-primary/8 dark:hover:bg-primary/15"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition group-hover:bg-primary/15 group-hover:text-primary dark:bg-slate-800 dark:text-slate-300">
                    <Icon name="dashboard" className="text-xl" size="sm" />
                  </span>
                  <span className="flex-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {t("backToDashboard")}
                  </span>
                  <Icon
                    name="chevron_right"
                    className="text-slate-400 transition group-hover:text-primary rtl:rotate-180"
                    size="sm"
                  />
                </Link>
              </li>
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-primary/8 dark:hover:bg-primary/15"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition group-hover:bg-primary/15 group-hover:text-primary dark:bg-slate-800 dark:text-slate-300">
                      <Icon name={item.icon} className="text-xl" size="sm" />
                    </span>
                    <span className="flex-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {tSidebar(item.labelKey)}
                    </span>
                    <Icon
                      name="chevron_right"
                      className="text-slate-400 transition group-hover:text-primary rtl:rotate-180"
                      size="sm"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
