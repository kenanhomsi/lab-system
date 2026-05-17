import { ContactHeroSection } from "../ui/contact/hero-section";
import { ContactInfo } from "../ui/contact/contact-info";
import { ContactForm } from "../ui/contact/contact-form";
import { BranchesSection } from "../ui/contact/branches-section";

/**
 * Contact page that guides users from quick outreach to appointment requests
 * and branch discovery.
 */
export default function ContactPage() {
  return (
    <main className="overflow-x-hidden">
      <ContactHeroSection />
      <ContactInfo />
      <ContactForm />
      <BranchesSection />
    </main>
  );
}
