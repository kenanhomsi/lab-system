"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { postClientApplicationPublic } from "@/lib/clients/website-public-client";

const INPUT_CLASS =
  "w-full rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20";

export function JoinAsClientPage() {
  const t = useTranslations("joinAsClient");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const body = Object.fromEntries(formData.entries());

    try {
      await postClientApplicationPublic(body);
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="bg-background py-12 md:py-20">
      <div className="mx-auto max-w-screen-2xl px-6 md:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-primary">
              <Icon name="handshake" filled size="sm" />
              {t("badge")}
            </span>
            <h1 className="mt-4 font-headline text-4xl font-black tracking-tight text-on-surface md:text-5xl">
              {t("title")}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-on-surface-variant">
              {t("description")}
            </p>
          </div>

          {success ? (
            <Card className="text-center">
              <Icon
                name="check_circle"
                filled
                className="mx-auto mb-4 text-emerald-500"
                size="lg"
              />
              <h3 className="font-headline text-xl font-bold text-on-surface">
                {t("successTitle")}
              </h3>
              <p className="mt-2 text-on-surface-variant">
                {t("successMessage")}
              </p>
            </Card>
          ) : (
            <Card className="shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="managerName"
                      className="mb-2 block text-sm font-bold text-on-surface"
                    >
                      {t("managerName")}
                    </label>
                    <input
                      type="text"
                      id="managerName"
                      name="managerName"
                      required
                      placeholder={t("managerNamePlaceholder")}
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="labName"
                      className="mb-2 block text-sm font-bold text-on-surface"
                    >
                      {t("labName")}
                    </label>
                    <input
                      type="text"
                      id="labName"
                      name="labName"
                      required
                      placeholder={t("labNamePlaceholder")}
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="mobile"
                      className="mb-2 block text-sm font-bold text-on-surface"
                    >
                      {t("mobile")}
                    </label>
                    <input
                      type="tel"
                      id="mobile"
                      name="mobile"
                      required
                      placeholder={t("mobilePlaceholder")}
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-bold text-on-surface"
                    >
                      {t("email")}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder={t("emailPlaceholder")}
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-bold text-on-surface"
                  >
                    {t("address")}
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    placeholder={t("addressPlaceholder")}
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label
                    htmlFor="additionalInfo"
                    className="mb-2 block text-sm font-bold text-on-surface"
                  >
                    {t("additionalInfo")}
                  </label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    rows={4}
                    placeholder={t("additionalInfoPlaceholder")}
                    className={`${INPUT_CLASS} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="clinical-gradient w-full rounded-xl px-8 py-4 text-sm font-bold tracking-widest text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="inline-flex items-center gap-2">
                      <Icon
                        name="progress_activity"
                        className="animate-spin"
                        size="sm"
                      />
                      {t("submitting")}
                    </span>
                  ) : (
                    t("submit")
                  )}
                </button>
              </form>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
