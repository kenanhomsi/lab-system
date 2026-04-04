import { ContactHeroSection } from "../ui/contact/hero-section";
import { ContactInfo } from "../ui/contact/contact-info";
import { ContactForm } from "../ui/contact/contact-form";
import { BranchesSection } from "../ui/contact/branches-section";

export default function ContactPage() {
  return (
    <main>
      <ContactHeroSection />
      <ContactInfo />
      <ContactForm />
      <BranchesSection />
    </main>
  );
}
