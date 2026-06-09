import { CareersFeatureFactory } from "./factory";
import { CareersBenefitsSection } from "./ui/careers-benefits";
import { CareersHeroSection } from "./ui/careers-hero";

/**
 * Public careers page: hero, benefits, listings, and application form.
 */
export default function Page() {
  return (
    <main className="overflow-x-hidden bg-background">
      <CareersHeroSection />
      <CareersBenefitsSection />
      <CareersFeatureFactory />
    </main>
  );
}
