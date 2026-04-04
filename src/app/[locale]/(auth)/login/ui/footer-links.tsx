import Link from "next/link";

export function LoginFooterLinks() {
  return (
    <footer className="mt-auto w-full p-6 lg:p-8">
      <div className="flex flex-col items-center justify-between gap-4 border-t border-surface-container-high pt-6 md:flex-row">
        <p className="text-center text-[10px] uppercase tracking-widest text-outline">
          © {new Date().getFullYear()} Al Mutawali Lab. Precision in Diagnostics.
        </p>
        <div className="flex space-x-6">
          <Link
            href="#"
            className="text-[10px] uppercase tracking-widest text-outline transition-colors hover:text-primary"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-[10px] uppercase tracking-widest text-outline transition-colors hover:text-primary"
          >
            Patient Rights
          </Link>
        </div>
      </div>
    </footer>
  );
}
