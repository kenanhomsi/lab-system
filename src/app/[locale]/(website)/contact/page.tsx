import { ContactHeroSection } from "../ui/contact/hero-section";
import { ContactInfo } from "../ui/contact/contact-info";
import { ContactForm } from "../ui/contact/contact-form";
import { BranchesSection } from "../ui/contact/branches-section";
import { BANNER_PLACEMENT } from "@/lib/banners/locations";
import { PageBannerOverflowServer, PageBannerSlotServer } from "@/components/layout/page-banner-slots-server";

/**
 * Contact page that guides users from quick outreach to appointment requests
 * and branch discovery.
 */
export default function ContactPage() {
  return (
    <main className="overflow-x-hidden">
      <ContactHeroSection />
      <PageBannerSlotServer placement={BANNER_PLACEMENT.CONTACT} order={1} />
      <ContactInfo />
      <PageBannerSlotServer placement={BANNER_PLACEMENT.CONTACT} order={2} />
      <ContactForm />
      <PageBannerSlotServer placement={BANNER_PLACEMENT.CONTACT} order={3} />
      <BranchesSection />
      <PageBannerSlotServer placement={BANNER_PLACEMENT.CONTACT} order={4} />
      <PageBannerOverflowServer placement={BANNER_PLACEMENT.CONTACT} />
    </main>
  );
}
