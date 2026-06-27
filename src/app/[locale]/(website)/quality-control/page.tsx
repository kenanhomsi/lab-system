import type { Metadata } from "next";
import { QualityControlPageView } from "../ui/quality/quality-page";

const QUALITY_PAGE_METADATA: Record<string, Metadata> = {
  ar: {
    title: "ضبط الجودة | مخبر المتوالي",
    description:
      "تعرف على نظام ضبط الجودة والاعتماد الدولي وآليات المراقبة والمعايرة التي يعتمدها مخبر المتوالي للتحليل الطبية.",
  },
  en: {
    title: "Quality Control | Al Metwali Lab",
    description:
      "Learn how Al Metwali Lab maintains international quality assurance standards, periodic controls, and accredited laboratory workflows.",
  },
};

/**
 * Generates localized metadata for the quality-control page.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return QUALITY_PAGE_METADATA[locale] ?? QUALITY_PAGE_METADATA.en;
}

/**
 * Public quality-control page route.
 */
export default function QualityControlPage() {
  return <QualityControlPageView />;
}
