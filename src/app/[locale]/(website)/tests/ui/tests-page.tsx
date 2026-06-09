"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTestsCatalogPublic } from "@/lib/clients/website-public-client";
import { BANNER_PLACEMENT } from "@/lib/banners/locations";
import { PageBannerOverflowClient, PageBannerSlotClient } from "@/components/layout/page-banner-slot-client";

type Test = {
  id: string;
  nameEn: string;
  nameAr: string;
  category: string;
};

const ALPHABET_EN = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const ALPHABET_AR = "أبتثجحخدذرزسشصضطظعغفقكلمنهوي".split("");

export function TestsPage() {
  const t = useTranslations("tests");
  const locale = useLocale();
  const [tests, setTests] = useState<Test[]>([]);
  const [search, setSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const alphabet = locale === "ar" ? ALPHABET_AR : ALPHABET_EN;

  useEffect(() => {
    getTestsCatalogPublic()
      .then((data) =>
        setTests(Array.isArray(data) ? (data as Test[]) : []),
      )
      .catch(() => setTests([]))
      .finally(() => setLoading(false));
  }, []);

  const testName = (test: Test) =>
    locale === "ar" ? test.nameAr : test.nameEn;

  const filtered = tests.filter((test) => {
    const name = testName(test).toLowerCase();
    const matchesSearch = !search || name.includes(search.toLowerCase());
    const matchesLetter =
      !activeLetter || name.startsWith(activeLetter.toLowerCase());
    return matchesSearch && matchesLetter;
  });

  return (
    <main className="bg-background py-12 md:py-20">
      <div className="content-container">
        <div className="mb-12 max-w-2xl">
          <h1 className="font-headline text-4xl font-black tracking-tight text-on-surface md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-on-surface-variant">
            {t("description")}
          </p>
        </div>
        <PageBannerSlotClient placement={BANNER_PLACEMENT.TESTS} order={1} />

        <div className="relative mb-8">
          <Icon
            name="search"
            className="absolute inset-s-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60"
            size="sm"
          />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-outline-variant/30 bg-surface py-3.5 pe-4 ps-12 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-8">
          <aside className="hidden w-12 shrink-0 lg:block">
            <div className="sticky top-24 flex flex-col items-center gap-1">
              {alphabet.map((letter) => (
                <button
                  key={letter}
                  onClick={() =>
                    setActiveLetter(activeLetter === letter ? null : letter)
                  }
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                    activeLetter === letter
                      ? "clinical-gradient text-on-primary-container shadow-sm"
                      : "text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Icon
                  name="progress_activity"
                  className="animate-spin text-primary"
                  size="lg"
                />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Icon
                  name="search_off"
                  className="mb-4 text-on-surface-variant/40"
                  size="lg"
                />
                <p className="text-on-surface-variant">{t("noResults")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((test) => (
                  <Card
                    key={test.id}
                    className="group transition-all hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-headline text-base font-bold text-on-surface">
                          {testName(test)}
                        </h3>
                        <Badge tone="default" className="mt-2">
                          {test.category}
                        </Badge>
                      </div>
                      <Link
                        href={`/tests/${test.id}`}
                        className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary/10"
                      >
                        {t("details")}
                        <Icon name="arrow_forward" size="sm" />
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
        <PageBannerSlotClient placement={BANNER_PLACEMENT.TESTS} order={2} />
        <PageBannerOverflowClient placement={BANNER_PLACEMENT.TESTS} />
      </div>
    </main>
  );
}
