"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import {
  CONTRACT_DURATIONS,
  CONTRACT_TYPES,
} from "@/lib/contract-service-request-enums";
import { postContractServiceRequestPublic } from "@/lib/clients/website-public-client";
import { contractServiceRequestSchema } from "@/lib/validation";

const INPUT_CLASS =
  "w-full rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20";

/**
 * Public contractual service request form for individuals and institutions.
 */
export function ContractServiceRequestPage() {
  const t = useTranslations("contractServiceRequest");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const raw = Object.fromEntries(formData.entries());
    const parsed = contractServiceRequestSchema.safeParse({
      contractType: String(raw.contractType ?? ""),
      responsibleName: String(raw.responsibleName ?? ""),
      organizationName: String(raw.organizationName ?? ""),
      expectedSubscribersCount: raw.expectedSubscribersCount,
      contactNumber: String(raw.contactNumber ?? ""),
      email: String(raw.email ?? ""),
      address: String(raw.address ?? ""),
      contractDuration: String(raw.contractDuration ?? ""),
      additionalInfo: raw.additionalInfo
        ? String(raw.additionalInfo)
        : undefined,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? t("errorGeneric"));
      return;
    }

    setSubmitting(true);

    try {
      const message = await postContractServiceRequestPublic(raw);
      setSuccessMessage(message || t("successMessage"));
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="bg-background py-12 md:py-20">
      <div className="content-container">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-primary">
              <Icon name="description" filled size="sm" />
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
              <p className="mt-2 text-on-surface-variant">{successMessage}</p>
            </Card>
          ) : (
            <Card className="shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error ? (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </p>
                ) : null}

                <fieldset>
                  <legend className="mb-3 block text-sm font-bold text-on-surface">
                    {t("contractType")}
                  </legend>
                  <div className="flex flex-wrap gap-4">
                    {CONTRACT_TYPES.map((type) => (
                      <label
                        key={type}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-outline-variant/30 px-4 py-2 text-sm text-on-surface has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                      >
                        <input
                          type="radio"
                          name="contractType"
                          value={type}
                          required
                          className="accent-primary"
                        />
                        {t(`contractType${type}` as "contractTypeIndividual")}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="responsibleName"
                      className="mb-2 block text-sm font-bold text-on-surface"
                    >
                      {t("responsibleName")}
                    </label>
                    <input
                      type="text"
                      id="responsibleName"
                      name="responsibleName"
                      required
                      placeholder={t("responsibleNamePlaceholder")}
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="organizationName"
                      className="mb-2 block text-sm font-bold text-on-surface"
                    >
                      {t("organizationName")}
                    </label>
                    <input
                      type="text"
                      id="organizationName"
                      name="organizationName"
                      required
                      placeholder={t("organizationNamePlaceholder")}
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="expectedSubscribersCount"
                      className="mb-2 block text-sm font-bold text-on-surface"
                    >
                      {t("expectedSubscribersCount")}
                    </label>
                    <input
                      type="number"
                      id="expectedSubscribersCount"
                      name="expectedSubscribersCount"
                      min={0}
                      step={1}
                      required
                      placeholder={t("expectedSubscribersCountPlaceholder")}
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contactNumber"
                      className="mb-2 block text-sm font-bold text-on-surface"
                    >
                      {t("contactNumber")}
                    </label>
                    <input
                      type="tel"
                      id="contactNumber"
                      name="contactNumber"
                      required
                      placeholder={t("contactNumberPlaceholder")}
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                  <div>
                    <label
                      htmlFor="contractDuration"
                      className="mb-2 block text-sm font-bold text-on-surface"
                    >
                      {t("contractDuration")}
                    </label>
                    <select
                      id="contractDuration"
                      name="contractDuration"
                      required
                      defaultValue=""
                      className={INPUT_CLASS}
                    >
                      <option value="" disabled>
                        {t("contractDurationPlaceholder")}
                      </option>
                      {CONTRACT_DURATIONS.map((duration) => (
                        <option key={duration} value={duration}>
                          {t(`duration${duration}` as "durationThreeMonths")}
                        </option>
                      ))}
                    </select>
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

          <p className="mt-8 text-center text-sm text-on-surface-variant">
            {t("crossLinkPrefix")}{" "}
            <Link
              href="/join-as-client"
              className="font-semibold text-primary underline-offset-2 hover:underline"
            >
              {t("crossLinkJoinAsClient")}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
