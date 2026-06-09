import { ContractServiceRequestFeatureFactory } from "./factory";
import { ContractServiceRequestBenefitsSection } from "./ui/contract-service-request-benefits";
import { ContractServiceRequestHeroSection } from "./ui/contract-service-request-hero";
import { ContractServiceRequestStepsSection } from "./ui/contract-service-request-steps";

/**
 * Public contractual service request page for individuals and organizations.
 */
export default function Page() {
  return (
    <main className="overflow-x-hidden bg-background">
      <ContractServiceRequestHeroSection />
      <ContractServiceRequestBenefitsSection />
      <ContractServiceRequestStepsSection />
      <ContractServiceRequestFeatureFactory />
    </main>
  );
}
