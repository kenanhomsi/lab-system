import Link from "next/link";
import Image from "next/image";

type ForbiddenPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ForbiddenPage({ params }: ForbiddenPageProps) {
  const { locale } = await params;
  const isArabic = locale.startsWith("ar");
  const title = isArabic ? "تم رفض الوصول" : "Access denied";
  const subtitle = isArabic
    ? "ليس لديك صلاحية للوصول إلى هذه الصفحة."
    : "You do not have permission to access this page.";
  const hint = isArabic
    ? "جرّب تسجيل الدخول بحساب آخر يملك الصلاحيات المناسبة."
    : "Try signing in with another account that has the required permissions.";
  const homeLabel = isArabic ? "العودة إلى الرئيسية" : "Back to home";
  const loginLabel = isArabic ? "تسجيل الدخول بحساب آخر" : "Sign in with another account";

  return (
    <main className="grid min-h-[75vh] place-items-center px-4 py-10 sm:px-6">
      <div className="glass-card w-full max-w-lg rounded-3xl p-8 text-center sm:p-10">
        <div className="mb-6 flex justify-center">
          <Image
            src="/images/forbidden.svg"
            alt={isArabic ? "رمز منع الوصول" : "Forbidden access illustration"}
            width={220}
            height={152}
            priority
          />
        </div>
        <p className="font-headline text-sm font-semibold uppercase tracking-[0.2em] text-error">
          403
        </p>
        <h1 className="mt-3 font-headline text-3xl font-bold text-on-surface sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-base text-on-surface-variant">{subtitle}</p>
        <p className="mt-2 text-sm text-on-surface-variant/90">{hint}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center rounded-xl border border-outline-variant/40 bg-surface-container-low px-5 py-2.5 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container"
          >
            {homeLabel}
          </Link>
          <Link
            href={`/${locale}/login`}
            className="clinical-gradient inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-on-primary shadow-lg shadow-primary/20 transition-opacity hover:opacity-95"
          >
            {loginLabel}
          </Link>
        </div>
      </div>
    </main>
  );
}
