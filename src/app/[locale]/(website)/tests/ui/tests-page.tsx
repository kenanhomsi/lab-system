"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MedicalTestItem } from "@/components/tables/medical-tests-table/types";
import { getMedicalTestsPublic } from "@/lib/clients/website-public-client";
import { BANNER_PLACEMENT } from "@/lib/banners/locations";
import { PageBannerOverflowClient, PageBannerSlotClient } from "@/components/layout/page-banner-slot-client";

const PAGE_SIZE = 24;

/** Active category / pagination chip — vibrant teal gradient with glow */
const CHIP_ACTIVE =
  "clinical-gradient text-on-primary shadow-md shadow-primary/30 ring-2 ring-primary/25 ring-offset-2 ring-offset-surface-container-lowest";

/** Inactive category chip — soft primary tint instead of flat gray */
const CHIP_INACTIVE =
  "border border-primary/25 bg-linear-to-br from-primary-container/60 to-primary/8 text-primary shadow-sm hover:border-primary/40 hover:from-primary-container hover:to-primary/12 hover:shadow-md hover:shadow-primary/10";

const categoryIcon = (category: string): string => {
  const value = category.trim().toLowerCase();
  if (value.includes("blood") || value.includes("hema") || value.includes("دمو")) return "water_drop";
  if (value.includes("horm") || value.includes("هرم")) return "biotech";
  if (value.includes("chem") || value.includes("كيم")) return "science";
  if (value.includes("immun") || value.includes("مناع")) return "shield_with_heart";
  if (value.includes("micro") || value.includes("virus") || value.includes("فير")) return "microbiology";
  if (value.includes("sero") || value.includes("مصل")) return "bloodtype";
  return "biotech";
};

export function TestsPage() {
  const t = useTranslations("tests");
  const locale = useLocale();
  const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);

  const [items, setItems] = useState<MedicalTestItem[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<"generic" | "unauthorized" | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const loadTests = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await getMedicalTestsPublic({
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch || undefined,
      });
      setItems(response.items);
      setTotalCount(response.totalCount);
      setTotalPages(response.totalPages);
      setHasNextPage(response.hasNextPage);
      setHasPreviousPage(response.hasPreviousPage);
    } catch (error) {
      setItems([]);
      setTotalCount(0);
      setTotalPages(0);
      setHasNextPage(false);
      setHasPreviousPage(false);
      const message = error instanceof Error ? error.message : "";
      setLoadError(message === "upstream_unauthorized" ? "unauthorized" : "generic");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page]);

  useEffect(() => {
    void loadTests();
  }, [loadTests]);

  const testName = (test: MedicalTestItem) =>
    locale === "ar" ? test.nameAr : test.nameEn;

  const categories = useMemo(() => {
    const unique = new Set<string>();
    for (const item of items) {
      const category = item.category.trim();
      if (category) unique.add(category);
    }
    return Array.from(unique).sort((a, b) => a.localeCompare(b, locale));
  }, [items, locale]);

  const visibleItems = useMemo(() => {
    if (!activeCategory) return items;
    return items.filter((item) => item.category === activeCategory);
  }, [activeCategory, items]);

  const pageNumbers = useMemo(() => {
    const maxButtons = 5;
    const start = Math.max(1, Math.min(page - 2, totalPages - maxButtons + 1));
    const end = Math.min(totalPages, start + maxButtons - 1);
    const numbers: number[] = [];
    for (let current = start; current <= end; current += 1) {
      numbers.push(current);
    }
    return numbers;
  }, [page, totalPages]);

  return (
    <main className="bg-linear-to-b from-surface via-surface to-surface-container-low pb-24">
      <section className="pt-10 md:pt-14">
        <div className="content-container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/6 px-4 py-2 text-xs font-black tracking-[0.22em] text-primary">
              <Icon name="biotech" size="sm" className="text-primary" />
              {t("eyebrow")}
            </div>
            <h1 className="mt-6 font-headline text-4xl font-black tracking-tight text-on-surface md:text-6xl">
              {t("title")}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-on-surface-variant md:text-lg">
              {t("description")}
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-outline-variant/15 bg-linear-to-br from-surface-container-lowest to-surface px-5 py-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon name="science" size="sm" className="text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-black tracking-tight text-on-surface">
                    {loading ? "—" : numberFormatter.format(totalCount)}
                  </p>
                  <p className="text-sm text-on-surface-variant">{t("statTotalTests")}</p>
                </div>
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-outline-variant/15 bg-linear-to-br from-surface-container-lowest to-surface px-5 py-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon name="category" size="sm" className="text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-black tracking-tight text-on-surface">
                    {loading ? "—" : numberFormatter.format(categories.length)}
                  </p>
                  <p className="text-sm text-on-surface-variant">{t("statCategories")}</p>
                </div>
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-outline-variant/15 bg-linear-to-br from-surface-container-lowest to-surface px-5 py-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon name="verified" size="sm" className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">{t("statQualityTitle")}</p>
                  <p className="mt-1 text-sm text-on-surface-variant">{t("statQualityBody")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PageBannerSlotClient placement={BANNER_PLACEMENT.TESTS} order={1} />

      <section className="pt-10 md:pt-14">
        <div className="content-container">
          <div className="rounded-[2rem] border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm md:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative flex-1">
                <Icon
                  name="search"
                  className="absolute inset-s-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60"
                  size="sm"
                />
                <input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  className="w-full rounded-xl border border-outline-variant/30 bg-surface py-3.5 pe-4 ps-12 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <Link
                href="/order-test-request"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl clinical-gradient px-6 py-3 font-headline text-sm font-bold text-on-primary shadow-lg shadow-primary/35 ring-2 ring-primary/20 transition-all hover:brightness-105 hover:shadow-primary/45 active:scale-[0.98]"
              >
                <Icon name="add_circle" size="sm" className="text-on-primary" />
                {t("orderCta")}
              </Link>
            </div>

            {categories.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveCategory(null)}
                  className={[
                    "rounded-full px-4 py-2.5 text-xs font-bold transition-all duration-200",
                    activeCategory === null ? CHIP_ACTIVE : CHIP_INACTIVE,
                  ].join(" ")}
                >
                  {t("allCategories")}
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      setActiveCategory(activeCategory === category ? null : category)
                    }
                    className={[
                      "rounded-full px-4 py-2.5 text-xs font-bold transition-all duration-200",
                      activeCategory === category ? CHIP_ACTIVE : CHIP_INACTIVE,
                    ].join(" ")}
                  >
                    {category}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="mt-8">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Icon name="progress_activity" className="animate-spin text-primary" size="lg" />
              </div>
            ) : loadError ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Icon name="error" className="mb-4 text-red-500/70" size="lg" />
                <p className="max-w-xl text-on-surface-variant">
                  {loadError === "unauthorized" ? t("loadErrorUnauthorized") : t("loadError")}
                </p>
              </div>
            ) : visibleItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Icon name="search_off" className="mb-4 text-on-surface-variant/40" size="lg" />
                <p className="text-on-surface-variant">{t("noResults")}</p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between gap-4">
                  <p className="text-sm text-on-surface-variant">
                    {t("showingCount", { count: numberFormatter.format(visibleItems.length) })}
                  </p>
                  {debouncedSearch ? (
                    <Badge tone="default">{t("searchActive", { query: debouncedSearch })}</Badge>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {visibleItems.map((test) => (
                    <Card
                      key={test.id}
                      className="group flex h-full flex-col border-outline-variant/15 bg-linear-to-br from-surface-container-lowest to-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                          <Icon name={categoryIcon(test.category)} className="text-primary" />
                        </div>
                        <Badge
                          tone="default"
                          className="border border-primary/15 bg-primary-container/80 text-primary"
                        >
                          {test.category || t("uncategorized")}
                        </Badge>
                      </div>

                      <div className="mt-5 flex-1">
                        <h2 className="font-headline text-xl font-black tracking-tight text-on-surface">
                          {testName(test)}
                        </h2>
                        {test.sampleType ? (
                          <p className="mt-3 flex items-center gap-2 text-sm text-on-surface-variant">
                            <Icon name="science" size="sm" />
                            {test.sampleType}
                          </p>
                        ) : null}
                      </div>

                      <div className="mt-6 flex items-end justify-between gap-4 border-t border-outline-variant/15 pt-5">
                        <div>
                          <p className="text-xs text-on-surface-variant">{t("price")}</p>
                          <p className="font-headline text-2xl font-black text-primary">
                            {numberFormatter.format(test.price)}
                            <span className="ms-1 text-sm font-semibold text-on-surface-variant">
                              {t("currency")}
                            </span>
                          </p>
                        </div>
                        <Link
                          href={`/tests/${test.id}`}
                          className="inline-flex items-center gap-1 rounded-xl border border-primary/20 bg-linear-to-br from-primary-container/70 to-primary/10 px-4 py-2.5 text-sm font-bold text-primary shadow-sm transition-all hover:border-primary/35 hover:from-primary-container hover:to-primary/15 hover:shadow-md hover:shadow-primary/10"
                        >
                          {t("details")}
                          <Icon name="arrow_forward" size="sm" />
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>

                {totalPages > 1 ? (
                  <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={!hasPreviousPage}
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                      className="inline-flex items-center gap-1 rounded-xl border border-primary/20 bg-surface px-4 py-2 text-sm font-bold text-primary shadow-sm transition-all enabled:hover:border-primary/35 enabled:hover:bg-primary-container/50 enabled:hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Icon name="chevron_left" size="sm" />
                      {t("previousPage")}
                    </button>
                    {pageNumbers.map((pageNumber) => (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => setPage(pageNumber)}
                        className={[
                          "min-w-10 rounded-xl px-3 py-2 text-sm font-bold transition-all duration-200",
                          pageNumber === page ? CHIP_ACTIVE : CHIP_INACTIVE,
                        ].join(" ")}
                      >
                        {pageNumber}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={!hasNextPage}
                      onClick={() => setPage((current) => current + 1)}
                      className="inline-flex items-center gap-1 rounded-xl border border-primary/20 bg-surface px-4 py-2 text-sm font-bold text-primary shadow-sm transition-all enabled:hover:border-primary/35 enabled:hover:bg-primary-container/50 enabled:hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {t("nextPage")}
                      <Icon name="chevron_right" size="sm" />
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </section>

      <PageBannerSlotClient placement={BANNER_PLACEMENT.TESTS} order={2} />
      <PageBannerOverflowClient placement={BANNER_PLACEMENT.TESTS} />
    </main>
  );
}
