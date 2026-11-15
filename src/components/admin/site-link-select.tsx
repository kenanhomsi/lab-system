"use client";

import { useEffect, useMemo, useState } from "react";
import { Select } from "@mantine/core";
import { useLocale } from "next-intl";
import type { WebsiteNavigationPageDto } from "@/types/website-page";

type SiteLinkSelectProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
};

const STATIC_PAGES: ReadonlyArray<{ href: string; ar: string; en: string }> = [
  { href: "/", ar: "الرئيسية", en: "Home" },
  { href: "/about", ar: "من نحن", en: "About us" },
  { href: "/quality-control", ar: "ضبط الجودة", en: "Quality control" },
  { href: "/services", ar: "خدماتنا", en: "Services" },
  { href: "/tests", ar: "التحاليل الطبية", en: "Medical tests" },
  { href: "/price-calculator", ar: "حاسبة الأسعار", en: "Price calculator" },
  { href: "/offers", ar: "العروض", en: "Offers" },
  { href: "/plans", ar: "الاشتراكات", en: "Plans" },
  { href: "/lab-encyclopedia", ar: "موسوعة المخبر", en: "Lab encyclopedia" },
  { href: "/blog", ar: "المدونة", en: "Blog" },
  { href: "/careers", ar: "التوظيف", en: "Careers" },
  { href: "/join-as-client", ar: "انضم لعملائنا", en: "Join as client" },
  { href: "/contract-service-request", ar: "طلب خدمة تعاقدية", en: "Contract service request" },
  { href: "/complaint", ar: "تسجيل شكوى", en: "Submit a complaint" },
  { href: "/contact", ar: "تواصل معنا", en: "Contact us" },
  { href: "/login", ar: "تسجيل الدخول", en: "Log in" },
  { href: "/profile", ar: "حسابي", en: "My account" },
];

/** Dropdown of the website's internal pages (plus CMS pages) instead of a free-text link. */
export function SiteLinkSelect({ value, onChange, label, required }: SiteLinkSelectProps) {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const [cmsPages, setCmsPages] = useState<WebsiteNavigationPageDto[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/website/pages/navigation?language=${isArabic ? "ar" : "en"}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: unknown) => {
        if (!cancelled && Array.isArray(data)) setCmsPages(data as WebsiteNavigationPageDto[]);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [isArabic]);

  const data = useMemo(() => {
    const staticItems = STATIC_PAGES.map((page) => ({
      value: page.href,
      label: `${isArabic ? page.ar : page.en} (${page.href})`,
    }));
    const known = new Set(staticItems.map((item) => item.value));
    const cmsItems = cmsPages
      .filter((page) => page.slug?.trim())
      .map((page) => {
        const href = `/${page.slug!.trim().replace(/^\/+/, "")}`;
        return { value: href, label: `${page.title || page.slug} (${href})` };
      })
      .filter((item) => !known.has(item.value));
    cmsItems.forEach((item) => known.add(item.value));
    const groups = [
      { group: isArabic ? "صفحات الموقع" : "Website pages", items: staticItems },
      ...(cmsItems.length
        ? [{ group: isArabic ? "صفحات إضافية" : "Extra pages", items: cmsItems }]
        : []),
    ];
    // Keep a legacy/custom stored link selectable so editing never silently drops it.
    if (value && !known.has(value)) {
      groups.push({
        group: isArabic ? "رابط حالي" : "Current link",
        items: [{ value, label: value }],
      });
    }
    return groups;
  }, [cmsPages, isArabic, value]);

  return (
    <Select
      label={label}
      data={data}
      value={value || null}
      onChange={(next) => onChange(next ?? "")}
      placeholder={isArabic ? "اختر صفحة من الموقع" : "Choose a website page"}
      searchable
      clearable={!required}
      required={required}
      nothingFoundMessage={isArabic ? "لا نتائج" : "No results"}
      comboboxProps={{ withinPortal: true }}
    />
  );
}
