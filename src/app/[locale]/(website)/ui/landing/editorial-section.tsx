import { getLocale } from "next-intl/server";
import { Icon } from "@/components/ui/icon";
import { EditorialHighlightedHeading } from "./editorial-highlighted-heading";
import { fetchPublicBannersForPlacement } from "@/lib/banners/fetch-public-banners";
import { BANNER_PLACEMENT } from "@/lib/banners/locations";

const PORTRAIT =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAd0bU_bfhV4iIkRXRj3JX01knb-9F13HKB3h8OrAhg9-7WQmgfKzA6OqNmnGWtFVvRiVzncXiKMo4yt0Tf39lHxHDdkC6X4GYtLcWtsQkoRDTyWgNZDM0Bw_5A-Q3pImxLARRrhqkE7qXa_snfpZvuTZM0JZfipvilv-Z_9BKpYS1jZrbUz6xpWX5reSYM4Yr0qif77gIfNeKunnXBql3Gn6JKmmGMXtMbXcNMFBIp0bYFwF4cPTzcxvHscW9EmpHEUw9cdGu6jOoK";

export async function EditorialSection() {
  const banners = await fetchPublicBannersForPlacement(BANNER_PLACEMENT.WELCOME);
  const banner = banners.length > 0 ? banners[0] : null;

  const locale = await getLocale();
  const isRtl = locale === "ar";

  // Using visibilityRules to store JSON configuration for the stats/vision section
  // Default fallback if no rules are set
  let contentData = {
    precisionTitle: "الدقة",
    precisionBody:
      "تتميز خدماتنا للمرضى بأنها تراعي ظروف المريض وحاجته للرعاية والاهتمام والسرعة في تقديم خدمة التحاليل الطبية بدقة واتقان لضمان حصوله على نتائج دقيقة وصحيحة وبوقت قصير اعتمادا على أحدث الأجهزة والتقنيات المخبرية الآلية الحديثة وكادر طبي مميز",
    missionTitle: "المهمة",
    missionBody:
      "تقديم خدمات مخبرية موثوق فيها وفعالة ودقيقة في الوقت المناسب وبتكلفة معقولة لمرضانا، والأطباء ومقدمي الخدمات الصحية من خلال مجموعة متطورة من الأجهزة المخبرية الحديثة وكادر طبي وفني على أعلى مستوى وبالاعتماد على أفضل المواد المخبرية من أعرق الشركات المعتمدة عالمياً",
    visionTitle: "الرؤية",
    visionBody:
      "الحفاظ على أعلى المعايير الدولية لخدمات المختبرات وجودة العمل المخبري لضمان الدقة والنوعية في نتائج التحاليل الطبية والنوعية الصحية في المنطقة لتقديم خدمة أفضل لمرضانا، والأطباء والعملاء والطب المخبري ككل.",
    messageTitle: "الرسالة",
    messageBody:
      "إيماناً منا بأن دقة وسرعة التشخيص يسهمان في العلاج الصحيح للمرض لذا نسعى وبحرص شديد لنصبح الاختيار الأول للباحثين عن الخدمات المخبرية المتميزة عن طريق توفير أحدث الأجهزة والمحاليل وكذلك كوادر متميزة بالكفاءة والفعالية اللازمة والتعاون مع أفضل المؤسسات العالمية في مجال التحاليل الطبية",
  };

  if (banner?.visibilityRules) {
    try {
      const parsed = JSON.parse(banner.visibilityRules);
      contentData = { ...contentData, ...parsed };
    } catch (e) {
      // Ignored
    }
  }

  return (
    <section
      className="relative overflow-hidden border-y border-outline-variant/15 bg-surface py-20 md:py-28"
      aria-labelledby="editorial-heading"
    >
      <div className="relative mx-auto max-w-screen-xl px-5 md:px-8">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-16">
          <div
            className="reveal-up w-full lg:w-1/2 flex flex-col gap-6"
            style={{ animationDelay: "100ms" }}
          >
            <div className="text-center lg:text-start">
              <EditorialHighlightedHeading
                id="editorial-heading"
                before={isRtl ? "مرحباً بك في" : "Welcome to"}
                highlight={banner?.title || (isRtl ? "مختبر المتوالي" : "Metwali Lab")}
                className="font-headline text-3xl font-extrabold text-on-surface md:text-4xl"
              />
              <p className="mt-4 text-base leading-relaxed text-on-surface-variant md:text-lg">
                {contentData.precisionBody}
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-6">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon name="flag" size="md" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-on-surface">
                    {contentData.missionTitle}
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                    {contentData.missionBody}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon name="visibility" size="md" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-on-surface">
                    {contentData.visionTitle}
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                    {contentData.visionBody}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon name="menu_book" size="md" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-on-surface">
                    {contentData.messageTitle}
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                    {contentData.messageBody}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="reveal-up w-full lg:w-1/2 flex justify-center lg:justify-end"
            style={{ animationDelay: "200ms" }}
          >
            <div className="relative max-w-md w-full">
              <div className="relative aspect-square w-full overflow-hidden rounded-full border-4 border-white bg-surface-container shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={banner?.mediaUrl || PORTRAIT}
                  alt={banner?.title || (isRtl ? "مختبر المتوالي" : "Metwali Lab")}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -start-6 h-32 w-32 rounded-full border-8 border-white bg-primary shadow-xl flex items-center justify-center text-white">
                 <Icon name="science" size="lg" className="text-5xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
