import Image from "next/image";
import { Icon } from "@/components/ui/icon";

const LAB_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAgPaAIIx7njrMnEVYy8-R1T3bk9Nbf31gTF-hlWWidQj-mW2tcPGjE1vFpSw--fFVux3eEiOK0X8rUqTWSvpWPSMZ3Hhs1yehQeVNMg__0Uof0cXmc6i_3TEiJwTfbnQTp0W_MlH2XnLvPOMpqkdx7f8RwvJvBeXJ87ekjDyoWAnCOK9h-uJSXQ3AaqJSHgMSrn3etOpiSnCRTFjan4nRuE2G3j8al5rtK-s0z-NZyAZxur5AP7eq8TXHtIamTd1c4XyZ2KkrklOlS";

export function LabPanel() {
  return (
    <section className="relative hidden w-1/2 flex-col justify-end overflow-hidden p-12 lg:flex lg:p-16">
      <div className="absolute inset-0 z-0">
        <Image
          src={LAB_IMG}
          alt=""
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
      </div>
      <div className="relative z-10 max-w-xl">
        <div className="mb-8 inline-flex items-center space-x-2 rounded-full border border-tertiary-fixed/30 bg-tertiary-fixed/20 px-4 py-2 backdrop-blur-md">
          <Icon
            name="workspace_premium"
            filled
            className="text-sm text-tertiary-fixed"
            size="sm"
          />
          <span className="text-xs font-semibold uppercase tracking-widest text-tertiary-fixed">
            Center of Excellence
          </span>
        </div>
        <h1 className="mb-6 font-headline text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">
          Precision in every{" "}
          <span className="text-tertiary-fixed">molecular</span> detail.
        </h1>
        <p className="max-w-md text-lg font-light leading-relaxed text-on-primary/80">
          Al Mutawali Lab combines editorial elegance with clinical rigor to
          deliver world-class diagnostic insights for patients and professionals.
        </p>
        <div className="mt-12 flex space-x-8">
          <div className="flex flex-col">
            <span className="font-headline text-2xl font-bold text-tertiary-fixed">
              99.9%
            </span>
            <span className="text-xs uppercase tracking-wider text-on-primary/60">
              Accuracy Rate
            </span>
          </div>
          <div className="h-10 w-px bg-on-primary/20" />
          <div className="flex flex-col">
            <span className="font-headline text-2xl font-bold text-tertiary-fixed">
              24h
            </span>
            <span className="text-xs uppercase tracking-wider text-on-primary/60">
              Result Turnaround
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
