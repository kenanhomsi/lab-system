"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { postComplaintPublic } from "@/lib/clients/website-public-client";

const INPUT_CLASS =
  "w-full rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20";

export function ComplaintPage() {
  const t = useTranslations("complaint");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      await postComplaintPublic(formData);
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
      <div className="content-container">
        <div className="mx-auto max-w-2xl">
          <div className="mb-12 text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-primary">
              <Icon name="feedback" filled size="sm" />
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
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-bold text-on-surface"
                  >
                    {t("nameLabel")}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder={t("namePlaceholder")}
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label
                    htmlFor="complaintTitle"
                    className="mb-2 block text-sm font-bold text-on-surface"
                  >
                    {t("complaintTitleLabel")}
                  </label>
                  <input
                    type="text"
                    id="complaintTitle"
                    name="complaintTitle"
                    required
                    placeholder={t("complaintTitlePlaceholder")}
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label
                    htmlFor="text"
                    className="mb-2 block text-sm font-bold text-on-surface"
                  >
                    {t("textLabel")}
                  </label>
                  <textarea
                    id="text"
                    name="text"
                    rows={5}
                    required
                    placeholder={t("textPlaceholder")}
                    className={`${INPUT_CLASS} resize-none`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="attachment"
                    className="mb-2 block text-sm font-bold text-on-surface"
                  >
                    {t("attachmentLabel")}
                  </label>
                  <input
                    type="file"
                    id="attachment"
                    name="attachment"
                    className="w-full rounded-xl border border-dashed border-outline-variant/50 bg-surface px-4 py-4 text-sm text-on-surface file:me-4 file:rounded-lg file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-xs file:font-bold file:text-primary"
                  />
                  <p className="mt-1 text-xs text-on-surface-variant">
                    {t("attachmentHint")}
                  </p>
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
