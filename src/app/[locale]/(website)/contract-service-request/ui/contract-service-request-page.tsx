"use client";

import { useRef, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import {
  CONTRACT_DURATIONS,
  CONTRACT_TYPES,
} from "@/lib/contract-service-request-enums";
import { postContractServiceRequestPublic } from "@/lib/clients/website-public-client";
import { contractServiceRequestSchema } from "@/lib/validation";
import type { ContractType } from "@/types/contract-service-request";

const INPUT_CLASS =
  "w-full rounded-2xl border border-outline-variant/20 bg-white px-4 py-3.5 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/40 focus:border-primary focus:ring-4 focus:ring-primary/10";

const FORM_CHECK_KEYS = ["check1", "check2", "check3"] as const;

const CONTRACT_TYPE_ICONS: Record<ContractType, string> = {
  Individual: "person",
  Organization: "corporate_fare",
};

/**
 * Public contractual service request form for individuals and institutions.
 */
export function ContractServiceRequestPage() {
  const t = useTranslations("contractServiceRequest");
  const locale = useLocale();
  const linkArrow = locale === "ar" ? "arrow_back" : "arrow_forward";
  const formRef = useRef<HTMLFormElement>(null);
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
      formRef.current?.reset();
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section
        id="contract-request-form"
        className="scroll-mt-24 relative overflow-hidden bg-gradient-to-b from-surface via-surface to-surface-container-low py-16 md:py-24"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_50%,rgba(59,130,246,0.05),transparent)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute -end-20 top-1/3 h-[400px] w-[400px] rounded-full bg-tertiary/[0.04] blur-[100px]" />

        <div className="relative content-container">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_minmax(0,520px)] lg:gap-16">
            <div className="lg:sticky lg:top-28">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/8 px-4 py-2 text-[10px] font-black tracking-[0.32em] text-primary uppercase">
                <Icon name="description" size="sm" />
                {t("form.eyebrow")}
              </span>
              <h2 className="mt-5 font-headline text-4xl font-black tracking-tight text-on-surface md:text-5xl">
                {t("form.title")}
              </h2>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-on-surface-variant">
                {t("form.description")}
              </p>

              <ul className="mt-10 space-y-4">
                {FORM_CHECK_KEYS.map((key, index) => (
                  <li
                    key={key}
                    className="flex items-start gap-4 rounded-2xl border border-outline-variant/15 bg-white/80 p-5 shadow-sm backdrop-blur-md"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/12 to-primary/5 text-primary">
                      <Icon
                        name={
                          index === 0
                            ? "contract"
                            : index === 1
                              ? "groups"
                              : "call"
                        }
                        size="sm"
                      />
                    </div>
                    <p className="text-sm font-medium leading-6 text-on-surface-variant">
                      {t(`form.${key}`)}
                    </p>
                  </li>
                ))}
              </ul>

              <Card
                padding="md"
                className="mt-10 border-primary/15 bg-primary/[0.04]"
              >
                <p className="text-sm text-on-surface-variant">
                  {t("crossLinkPrefix")}
                </p>
                <Link
                  href="/join-as-client"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                >
                  {t("crossLinkJoinAsClient")}
                  <Icon name={linkArrow} size="sm" />
                </Link>
              </Card>
            </div>

            <div>
              {success ? (
                <Card
                  padding="lg"
                  className="border-emerald-500/20 bg-emerald-500/5 text-center shadow-lg"
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
                    <Icon
                      name="check_circle"
                      filled
                      className="text-emerald-600"
                      size="lg"
                    />
                  </div>
                  <h3 className="font-headline text-2xl font-bold text-on-surface">
                    {t("successTitle")}
                  </h3>
                  <p className="mt-3 text-on-surface-variant">
                    {successMessage}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSuccess(false);
                      setSuccessMessage("");
                    }}
                    className="mt-8 inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-6 py-3 text-sm font-bold text-primary transition-all hover:bg-primary hover:text-on-primary"
                  >
                    <Icon name="add" size="sm" />
                    {t("form.submitAnother")}
                  </button>
                </Card>
              ) : (
                <Card padding="lg" className="shadow-xl shadow-slate-950/5">
                  {error ? (
                    <div
                      role="alert"
                      className="mb-6 flex items-start gap-3 rounded-2xl border border-error/30 bg-error/5 p-4"
                    >
                      <Icon
                        name="error"
                        filled
                        className="shrink-0 text-error"
                      />
                      <p className="text-sm font-medium text-on-surface">
                        {error}
                      </p>
                    </div>
                  ) : null}

                  <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="space-y-8"
                  >
                    <fieldset className="space-y-5">
                      <legend className="mb-1 flex items-center gap-2 font-headline text-sm font-bold tracking-wide text-primary uppercase">
                        <Icon name="contract" size="sm" />
                        {t("form.sectionContract")}
                      </legend>
                      <div>
                        <p className="mb-3 text-sm font-bold text-on-surface">
                          {t("contractType")}
                        </p>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {CONTRACT_TYPES.map((type) => (
                            <label
                              key={type}
                              className="group relative flex cursor-pointer items-center gap-4 rounded-2xl border border-outline-variant/20 bg-white p-4 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:shadow-md hover:border-primary/30"
                            >
                              <input
                                type="radio"
                                name="contractType"
                                value={type}
                                required
                                className="sr-only"
                              />
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/12 to-primary/5 text-primary">
                                <Icon
                                  name={CONTRACT_TYPE_ICONS[type]}
                                  filled
                                  size="sm"
                                />
                              </div>
                              <span className="text-sm font-bold text-on-surface">
                                {t(
                                  `contractType${type}` as "contractTypeIndividual",
                                )}
                              </span>
                              <Icon
                                name="check_circle"
                                filled
                                className="ms-auto text-primary opacity-0 transition-opacity group-has-[:checked]:opacity-100"
                                size="sm"
                              />
                            </label>
                          ))}
                        </div>
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
                              {t(
                                `duration${duration}` as "durationThreeMonths",
                              )}
                            </option>
                          ))}
                        </select>
                      </div>
                    </fieldset>

                    <fieldset className="space-y-5">
                      <legend className="mb-1 flex items-center gap-2 font-headline text-sm font-bold tracking-wide text-primary uppercase">
                        <Icon name="corporate_fare" size="sm" />
                        {t("form.sectionOrganization")}
                      </legend>
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                            autoComplete="name"
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
                            placeholder={t(
                              "expectedSubscribersCountPlaceholder",
                            )}
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
                            autoComplete="tel"
                            placeholder={t("contactNumberPlaceholder")}
                            className={INPUT_CLASS}
                          />
                        </div>
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
                          autoComplete="email"
                          placeholder={t("emailPlaceholder")}
                          className={INPUT_CLASS}
                        />
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
                    </fieldset>

                    <fieldset className="space-y-5">
                      <legend className="mb-1 flex items-center gap-2 font-headline text-sm font-bold tracking-wide text-primary uppercase">
                        <Icon name="notes" size="sm" />
                        {t("form.sectionAdditional")}
                      </legend>
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
                        <p className="mt-2 text-xs text-on-surface-variant">
                          {t("form.additionalHint")}
                        </p>
                      </div>
                    </fieldset>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="clinical-gradient flex w-full items-center justify-center gap-2 rounded-2xl px-8 py-4 text-sm font-bold tracking-widest text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Icon
                            name="progress_activity"
                            className="animate-spin"
                            size="sm"
                          />
                          {t("submitting")}
                        </>
                      ) : (
                        <>
                          <Icon name="send" size="sm" />
                          {t("submit")}
                        </>
                      )}
                    </button>
                  </form>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
