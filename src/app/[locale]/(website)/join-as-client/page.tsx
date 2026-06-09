import { JoinAsClientFeatureFactory } from "./factory";
import { JoinAsClientBenefitsSection } from "./ui/join-as-client-benefits";
import { JoinAsClientHeroSection } from "./ui/join-as-client-hero";
import { JoinAsClientStepsSection } from "./ui/join-as-client-steps";

/**
 * Public lab partnership page: hero, benefits, process, and application form.
 */
export default function Page() {
  return (
    <main className="overflow-x-hidden bg-background">
      <JoinAsClientHeroSection />
      <JoinAsClientBenefitsSection />
      <JoinAsClientStepsSection />
      <JoinAsClientFeatureFactory />
    </main>
  );
}
