"use client";
import Link from "next/link";
import { useComputedColorScheme } from "@mantine/core";
import { useLocale, useTranslations } from "next-intl";
import { LoginFooterLinks } from "./ui/footer-links";
import { LabPanel } from "./ui/lab-panel";
import { LoginForm } from "./ui/login-form";
import { BrandLogo } from "@/components/shared/brand-logo";
import { Particles } from "@/components/ui/particles";
import { useMirror } from "./store";
const UI = () => {

    const setShowAdmin = useMirror("setShowAdmin");
    const setSelectedRole = useMirror("setSelectedRole");
    const locale = useLocale();
    const t = useTranslations("auth");
    const colorScheme = useComputedColorScheme("light");
    const particleColor = colorScheme === "dark" ? "#ffffff" : "#000000";

    return (
        <main className="flex min-h-screen overflow-hidden bg-surface font-body text-on-surface antialiased">
            <LabPanel />
            <section className="relative flex w-full flex-col overflow-hidden bg-surface lg:w-1/2">
                <Particles
                    className="absolute inset-0 z-0"
                    variant="medical"
                    quantity={65}
                    size={1.25}
                    ease={80}
                    color={particleColor}
                    refresh
                />
                <div className="relative z-10 flex items-center justify-between p-6 lg:p-8">
                    <Link href={`/${locale}`} className="flex items-center gap-3">
                        <BrandLogo
                            label={t("brand")}
                            priority
                            labelClassName="text-on-surface"
                        />
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/${locale}`}
                            className="hidden text-sm font-semibold text-on-surface-variant transition-colors hover:text-[#009cc2] md:block"
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
                            className="h-2 w-2 rounded-full bg-outline/20 transition-colors hover:bg-[#009cc2]/40"
                            aria-hidden="true"
                        />
                    </div>
                </div>
                <div className="relative z-10 flex flex-1 items-center justify-center p-6 lg:p-12">
                    <div className="w-full max-w-md">
                        <div className="mb-10">
                            <h2 className="mb-2 font-headline text-3xl font-bold text-on-surface">
                                {t("welcomeBack")}
                            </h2>
                            <p className="text-sm text-on-surface-variant">
                                {t("selectPortal")}
                            </p>
                        </div>
                        {/* <RoleSelector value={selectedRole} onChange={setSelectedRole} showAdmin={showAdmin} /> */}
                        <LoginForm />
                        <div className="mt-8 space-y-3 text-center">
                            <p className="text-sm text-on-surface-variant">
                                {t("noAccount")}{" "}
                                <Link href={`/${locale}/register`} className="font-bold text-[#009cc2] hover:underline">
                                    {t("createAccount")}
                                </Link>
                            </p>
                            <Link
                                href={`/${locale}`}
                                className="inline-block text-sm font-medium text-on-surface-variant hover:text-[#009cc2]"
                            >
                                {t("continueAsGuest")}
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="relative z-10">
                    <LoginFooterLinks />
                </div>
            </section>
            <div className="pointer-events-none fixed right-0 top-0 h-32 w-32 bg-tertiary-fixed opacity-5 blur-[100px]" />
            <div className="pointer-events-none fixed bottom-0 left-1/2 h-64 w-64 bg-[#009cc2] opacity-5 blur-[120px]" />
        </main>
    )
}

export default UI
