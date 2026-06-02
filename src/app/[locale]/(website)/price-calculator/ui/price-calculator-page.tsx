"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { getTestsCatalogPublic } from "@/lib/clients/website-public-client";

type Test = {
  id: string;
  nameEn: string;
  nameAr: string;
  price: number;
};

export type PriceCalculatorPageProps = {
  variant?: "page" | "dashboard";
};

export function PriceCalculatorPage({ variant = "page" }: PriceCalculatorPageProps) {
  const t = useTranslations("priceCalculator");
  const locale = useLocale();
  const [allTests, setAllTests] = useState<Test[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTests, setSelectedTests] = useState<Test[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getTestsCatalogPublic()
      .then((data) =>
        setAllTests(Array.isArray(data) ? (data as Test[]) : []),
      )
      .catch(() => setAllTests([]));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const testName = useCallback(
    (test: Test) => (locale === "ar" ? test.nameAr : test.nameEn),
    [locale],
  );

  const suggestions = allTests.filter((test) => {
    if (!search) return false;
    const alreadySelected = selectedTests.some((s) => s.id === test.id);
    if (alreadySelected) return false;
    return testName(test).toLowerCase().includes(search.toLowerCase());
  });

  function addTest(test: Test) {
    if (!selectedTests.some((s) => s.id === test.id)) {
      setSelectedTests((prev) => [...prev, test]);
    }
    setSearch("");
    setShowSuggestions(false);
  }

  function removeTest(id: string) {
    setSelectedTests((prev) => prev.filter((t) => t.id !== id));
  }

  function resetCalculation() {
    setSelectedTests([]);
    setSearch("");
  }

  const total = selectedTests.reduce((sum, test) => sum + (test.price || 0), 0);

  const body = (
    <>
      <div className={variant === "dashboard" ? "mb-8 text-center" : "mb-12 text-center"}>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-primary">
              <Icon name="calculate" filled size="sm" />
              {t("badge")}
            </span>
            <h1
              className={
                variant === "dashboard"
                  ? "mt-4 font-headline text-3xl font-black tracking-tight text-on-surface md:text-4xl"
                  : "mt-4 font-headline text-4xl font-black tracking-tight text-on-surface md:text-5xl"
              }
            >
              {t("title")}
            </h1>
            <p
              className={
                variant === "dashboard"
                  ? "mx-auto mt-3 max-w-xl text-base text-on-surface-variant"
                  : "mx-auto mt-4 max-w-xl text-lg text-on-surface-variant"
              }
            >
              {t("description")}
            </p>
          </div>

          <Card className={variant === "dashboard" ? "shadow-md" : "shadow-xl"}>
            <div ref={searchRef} className="relative mb-6">
              <label className="mb-2 block text-sm font-bold text-on-surface">
                {t("searchLabel")}
              </label>
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
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => search && setShowSuggestions(true)}
                  className="w-full rounded-xl border border-outline-variant/30 bg-surface py-3.5 pe-4 ps-12 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-xl">
                  {suggestions.map((test) => (
                    <button
                      key={test.id}
                      onClick={() => addTest(test)}
                      className="flex w-full items-center justify-between px-4 py-3 text-start text-sm transition-colors hover:bg-surface-container-high"
                    >
                      <span className="font-medium text-on-surface">
                        {testName(test)}
                      </span>
                      <span className="text-xs font-bold text-primary">
                        {test.price} {t("currency")}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedTests.length > 0 && (
              <div className="mb-6 overflow-hidden rounded-xl border border-outline-variant/20">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-outline-variant/20 bg-surface-container-high/50">
                      <th className="px-4 py-3 text-start text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                        {t("testName")}
                      </th>
                      <th className="px-4 py-3 text-start text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                        {t("testPrice")}
                      </th>
                      <th className="w-12 px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTests.map((test) => (
                      <tr
                        key={test.id}
                        className="border-b border-outline-variant/10 last:border-0"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-on-surface">
                          {testName(test)}
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-primary">
                          {test.price} {t("currency")}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => removeTest(test.id)}
                            className="rounded-lg p-1 text-on-surface-variant transition-colors hover:bg-red-50 hover:text-red-500"
                          >
                            <Icon name="close" size="sm" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex items-center justify-between rounded-xl bg-surface-container-high/50 px-6 py-4">
              <span className="text-sm font-bold text-on-surface-variant">
                {t("total")}
              </span>
              <span className="font-headline text-2xl font-black text-primary">
                {total}{" "}
                <span className="text-sm font-normal text-on-surface-variant">
                  {t("currency")}
                </span>
              </span>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="clinical-gradient flex flex-1 items-center justify-center gap-2 rounded-xl px-8 py-4 text-sm font-bold tracking-widest text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-95 active:scale-[0.98]"
              >
                <Icon name="calendar_month" size="sm" />
                {t("bookNow")}
              </Link>
              <button
                onClick={resetCalculation}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-8 py-4 text-sm font-bold text-on-surface shadow-sm transition-all hover:bg-surface-container-low"
              >
                <Icon name="restart_alt" size="sm" />
                {t("newCalculation")}
              </button>
            </div>
          </Card>
    </>
  );

  if (variant === "dashboard") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-4 md:px-6 md:py-6">{body}</div>
    );
  }

  return (
    <main className="bg-background py-12 md:py-20">
      <div className="content-container">
        <div className="mx-auto max-w-4xl">{body}</div>
      </div>
    </main>
  );
}
