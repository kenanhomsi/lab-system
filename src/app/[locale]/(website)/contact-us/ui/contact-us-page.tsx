"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import {
  getContactSettingsPublic,
  postContactPublic,
} from "@/lib/clients/website-public-client";

const INPUT_CLASS =
  "w-full rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20";

type ContactInfo = {
  phone?: string;
  email?: string;
  address?: string;
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
};

const SOCIAL_ICONS: Record<string, { icon: string; label: string }> = {
  phone: { icon: "call", label: "phone" },
  email: { icon: "mail", label: "email" },
  address: { icon: "location_on", label: "address" },
  whatsapp: { icon: "chat", label: "WhatsApp" },
  facebook: { icon: "public", label: "Facebook" },
  instagram: { icon: "photo_camera", label: "Instagram" },
  twitter: { icon: "public", label: "Twitter" },
};

export function ContactUsPage() {
  const t = useTranslations("contactUs");
  const [contactInfo, setContactInfo] = useState<ContactInfo>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getContactSettingsPublic()
      .then((data) => setContactInfo((data ?? {}) as ContactInfo))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const body = Object.fromEntries(formData.entries());

    try {
      await postContactPublic(body);
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  }

  const infoEntries = Object.entries(contactInfo).filter(
    ([, value]) => !!value,
  );

  return (
    <main className="bg-background py-12 md:py-20">
      <div className="content-container">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-primary">
            <Icon name="contact_support" filled size="sm" />
            {t("badge")}
          </span>
          <h1 className="mt-4 font-headline text-4xl font-black tracking-tight text-on-surface md:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-on-surface-variant">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <h2 className="font-headline text-2xl font-bold text-on-surface">
              {t("infoTitle")}
            </h2>

            {infoEntries.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {infoEntries.map(([key, value]) => {
                  const social = SOCIAL_ICONS[key];
                  if (!social) return null;
                  return (
                    <Card key={key} className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Icon
                          name={social.icon}
                          filled
                          className="text-primary"
                          size="sm"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                          {social.label}
                        </p>
                        <p className="mt-0.5 break-all text-sm font-semibold text-on-surface">
                          {value}
                        </p>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <Icon
                  name="progress_activity"
                  className="animate-spin text-primary"
                  size="lg"
                />
              </div>
            )}
          </div>

          <div>
            <h2 className="mb-6 font-headline text-2xl font-bold text-on-surface">
              {t("formTitle")}
            </h2>

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
                      htmlFor="message"
                      className="mb-2 block text-sm font-bold text-on-surface"
                    >
                      {t("messageLabel")}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      placeholder={t("messagePlaceholder")}
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
      </div>
    </main>
  );
}
