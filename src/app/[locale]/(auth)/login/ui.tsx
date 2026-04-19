"use client";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { LoginFooterLinks } from "./ui/footer-links";
import { LabPanel } from "./ui/lab-panel";
import { LoginForm } from "./ui/login-form";
import { RoleSelector } from "./ui/role-selector";
import { useMirror } from "./store";
const UI = () => {

    const showAdmin = useMirror("showAdmin");
    const setShowAdmin = useMirror("setShowAdmin");
    const selectedRole = useMirror("selectedRole");
    const setSelectedRole = useMirror("setSelectedRole");
    const locale = useLocale();
    const t = useTranslations("auth");

    return (
        <main className="flex min-h-screen overflow-hidden bg-surface font-body text-on-surface antialiased">
            <LabPanel />
            <section className="relative flex w-full flex-col bg-surface lg:w-1/2">
                <div className="flex items-center justify-between p-6 lg:p-8">
                    <Link href={`/${locale}`} className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg">
                            <span
                                className="material-symbols-outlined text-2xl text-on-primary"
                                style={{
                                    fontVariationSettings:
                                        "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                                }}
                            >
                                biotech
                            </span>
                        </div>
                        <span className="font-headline text-2xl font-extrabold tracking-tighter text-on-surface">
                            {t("brand")}
                        </span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/${locale}`}
                            className="hidden text-sm font-semibold text-secondary transition-colors hover:text-primary md:block"
                        >
                            {t("backToHome")}
                        </Link>
                        <button
                            type="button"
                            onClick={() => {
                                setShowAdmin((prev: boolean) => {
                                    const next = !prev;
                                    if (!next) setSelectedRole("patient");
                                    else setSelectedRole("admin");
                                    return next;
                                });
                            }}
                            className="h-2 w-2 rounded-full bg-outline/20 transition-colors hover:bg-primary/40"
                            aria-hidden="true"
                        />
                    </div>
                </div>
                <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
                    <div className="w-full max-w-md">
                        <div className="mb-10">
                            <h2 className="mb-2 font-headline text-3xl font-bold text-on-surface">
                                {t("welcomeBack")}
                            </h2>
                            <p className="text-sm text-secondary">
                                {t("selectPortal")}
                            </p>
                        </div>
                        <RoleSelector value={selectedRole} onChange={setSelectedRole} showAdmin={showAdmin} />
                        <LoginForm />
                        <div className="mt-8 space-y-3 text-center">
                            <p className="text-sm text-secondary">
                                {t("noAccount")}{" "}
                                <Link href={`/${locale}/register`} className="font-bold text-primary hover:underline">
                                    {t("createAccount")}
                                </Link>
                            </p>
                            <Link
                                href={`/${locale}`}
                                className="inline-block text-sm font-medium text-secondary hover:text-primary"
                            >
                                {t("continueAsGuest")}
                            </Link>
                        </div>
                    </div>
                </div>
                <LoginFooterLinks />
            </section>
            <div className="pointer-events-none fixed right-0 top-0 h-32 w-32 bg-tertiary-fixed opacity-5 blur-[100px]" />
            <div className="pointer-events-none fixed bottom-0 left-1/2 h-64 w-64 bg-primary opacity-5 blur-[120px]" />
        </main>
    )
}

export default UI