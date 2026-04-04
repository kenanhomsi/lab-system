"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Test = {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  category: string;
  shortDescription?: string;
};

export function LabEncyclopediaPage() {
  const t = useTranslations("labEncyclopedia");
  const locale = useLocale();
  const [tests, setTests] = useState<Test[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/tests")
      .then((res) => res.json())
      .then((data) => setTests(data))
      .catch(() => setTests([]))
      .finally(() => setLoading(false));
  }, []);

  const testName = (test: Test) =>
    locale === "ar" ? test.nameAr : test.nameEn;

  const filtered = tests.filter((test) => {
    if (!search) return true;
    return testName(test).toLowerCase().includes(search.toLowerCase());
  });

  return (
    <main className="bg-background py-12 md:py-20">
      <div className="mx-auto max-w-screen-2xl px-6 md:px-8">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-primary">
            <Icon name="biotech" filled size="sm" />
            {t("badge")}
          </span>
          <h1 className="mt-4 font-headline text-4xl font-black tracking-tight text-on-surface md:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-on-surface-variant">
            {t("description")}
          </p>
        </div>

        <div className="mx-auto mb-12 max-w-2xl">
          <div className="relative">
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
              className="w-full rounded-xl border border-outline-variant/30 bg-surface py-3.5 pe-4 ps-12 text-sm text-on-surface shadow-sm outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((test) => (
              <Link key={test.id} href={`/lab-encyclopedia/${test.slug || test.id}`}>
                <Card className="group h-full transition-all hover:-translate-y-1 hover:shadow-xl">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon name="science" filled className="text-primary" />
                  </div>
                  <h3 className="font-headline text-base font-bold text-on-surface group-hover:text-primary">
                    {testName(test)}
                  </h3>
                  {test.shortDescription && (
                    <p className="mt-2 line-clamp-2 text-sm text-on-surface-variant">
                      {test.shortDescription}
                    </p>
                  )}
                  <Badge tone="muted" className="mt-3">
                    {test.category}
                  </Badge>
                  <div className="mt-4 flex items-center gap-1 text-xs font-bold text-primary">
                    {t("readMore")}
                    <Icon name="arrow_forward" size="sm" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
