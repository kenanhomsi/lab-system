"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getVacanciesPublic,
  postCareersApplication,
} from "@/lib/clients/website-public-client";
import type { Vacancy } from "@/types/career";
import { BANNER_PLACEMENT } from "@/lib/banners/locations";
import {
  PageBannerOverflowClient,
  PageBannerSlotClient,
} from "@/components/layout/page-banner-slot-client";

type DisplayVacancy = {
  id: number;
  title: string;
  description: string;
  descriptionFull: string;
};

const INPUT_CLASS =
  "w-full rounded-2xl border border-outline-variant/20 bg-white px-4 py-3.5 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/40 focus:border-primary focus:ring-4 focus:ring-primary/10";

const FORM_CHECK_KEYS = ["check1", "check2", "check3"] as const;

function toDisplayVacancy(job: Vacancy, locale: string): DisplayVacancy {
  const isAr = locale === "ar";
  const descriptionFull = isAr ? job.descriptionAr : job.descriptionEn;
  return {
    id: job.id,
    title: isAr ? job.titleAr : job.titleEn,
    description: descriptionFull,
    descriptionFull,
  };
}

function VacancyCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-6">
      <div className="h-10 w-10 rounded-xl bg-outline-variant/20" />
      <div className="mt-4 h-5 w-3/4 rounded-lg bg-outline-variant/20" />
      <div className="mt-3 h-4 w-full rounded bg-outline-variant/15" />
      <div className="mt-2 h-4 w-5/6 rounded bg-outline-variant/15" />
      <div className="mt-6 h-10 w-full rounded-xl bg-outline-variant/20" />
    </div>
  );
}

type VacancyCardProps = {
  vacancy: DisplayVacancy;
  applyLabel: string;
  readMoreLabel: string;
  readLessLabel: string;
  onApply: (id: number) => void;
};

function VacancyCard({
  vacancy,
  applyLabel,
  readMoreLabel,
  readLessLabel,
  onApply,
}: VacancyCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = vacancy.descriptionFull.length > 160;
  const preview = isLong && !expanded
    ? `${vacancy.descriptionFull.slice(0, 160).trim()}…`
    : vacancy.descriptionFull;

  return (
    <Card
      padding="lg"
      className="group relative flex h-full flex-col overflow-hidden border-outline-variant/15 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-tertiary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary shadow-sm">
        <Icon name="work" filled size="md" />
      </div>
      <h3 className="font-headline text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
        {vacancy.title}
      </h3>
      {vacancy.descriptionFull ? (
        <div className="mt-3 flex-1">
          <p className="text-sm leading-relaxed text-on-surface-variant">
            {preview}
          </p>
          {isLong ? (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-2 text-xs font-bold text-primary hover:underline"
            >
              {expanded ? readLessLabel : readMoreLabel}
            </button>
          ) : null}
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => onApply(vacancy.id)}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-sm font-bold text-primary transition-all hover:bg-primary hover:text-on-primary"
      >
        <Icon name="send" size="sm" />
        {applyLabel}
      </button>
    </Card>
  );
}

/**
 * Careers listings and application form (client interactivity).
 */
export function CareersPage() {
  const t = useTranslations("careers");
  const locale = useLocale();
  const formRef = useRef<HTMLFormElement>(null);
  const positionSelectRef = useRef<HTMLSelectElement>(null);

  const [vacancies, setVacancies] = useState<DisplayVacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [selectedPositionId, setSelectedPositionId] = useState("");

  useEffect(() => {
    setLoading(true);
    getVacanciesPublic()
      .then((items) =>
        setVacancies(items.map((job) => toDisplayVacancy(job, locale))),
      )
      .catch(() => setVacancies([]))
      .finally(() => setLoading(false));
  }, [locale]);

  const scrollToApply = useCallback((vacancyId?: number) => {
    if (vacancyId !== undefined) {
      setSelectedPositionId(String(vacancyId));
    }
    document.getElementById("apply-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    if (vacancyId !== undefined) {
      window.setTimeout(() => positionSelectRef.current?.focus(), 400);
    }
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(false);

    const fd = new FormData(e.currentTarget);
    const apiFormData = new FormData();

    apiFormData.append("FullName", fd.get("fullName") as string);
    apiFormData.append("ResidencePlace", fd.get("city") as string);
    apiFormData.append("MobileNumber", fd.get("mobile") as string);
    apiFormData.append("Email", fd.get("email") as string);
    apiFormData.append("AcademicDegree", fd.get("degree") as string);
    apiFormData.append("PreviousExperience", fd.get("previousExperience") as string);
    apiFormData.append("YearsOfExperience", fd.get("yearsOfExperience") as string);
    apiFormData.append("Skills", fd.get("skills") as string);
    apiFormData.append(
      "AdditionalCertificates",
      fd.get("additionalCertifications") as string,
    );
    apiFormData.append("VacantJobId", fd.get("position") as string);

    const cvFile = fd.get("cv");
    if (cvFile) {
      apiFormData.append("CvFile", cvFile);
    }

    try {
      await postCareersApplication(apiFormData);
      setSuccess(true);
      setSelectedPositionId("");
      formRef.current?.reset();
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  const positionsCountLabel =
    vacancies.length > 0
      ? t("positionsCount", { count: vacancies.length })
      : null;

  return (
    <>
      <PageBannerSlotClient placement={BANNER_PLACEMENT.CAREERS} order={1} />

      <section
        id="open-positions"
        className="scroll-mt-24 bg-background py-14 md:py-20"
      >
        <div className="content-container">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-tertiary-fixed px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-on-tertiary-fixed">
                <Icon name="work_history" filled size="sm" />
                {t("openPositions")}
              </span>
              <h2 className="mt-3 font-headline text-3xl font-black tracking-tight text-on-surface md:text-4xl">
                {t("availablePositions")}
              </h2>
              <p className="mt-2 max-w-xl text-on-surface-variant">
                {t("positionsSubtitle")}
              </p>
            </div>
            {positionsCountLabel ? (
              <Badge className="w-fit shrink-0 bg-primary/10 px-4 py-2 text-sm text-primary">
                {positionsCountLabel}
              </Badge>
            ) : null}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <VacancyCardSkeleton key={i} />
              ))}
            </div>
          ) : vacancies.length === 0 ? (
            <Card className="border-dashed border-outline-variant/25 bg-surface-container-low py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-outline-variant/10">
                <Icon
                  name="work_off"
                  className="text-on-surface-variant/50"
                  size="lg"
                />
              </div>
              <h3 className="font-headline text-lg font-bold text-on-surface">
                {t("noVacanciesTitle")}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-on-surface-variant">
                {t("noVacancies")}
              </p>
              <p className="mx-auto mt-4 max-w-md text-sm text-on-surface-variant/80">
                {t("noVacanciesHint")}
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {vacancies.map((v) => (
                <VacancyCard
                  key={v.id}
                  vacancy={v}
                  applyLabel={t("applyNow")}
                  readMoreLabel={t("readMore")}
                  readLessLabel={t("readLess")}
                  onApply={scrollToApply}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <PageBannerSlotClient placement={BANNER_PLACEMENT.CAREERS} order={2} />

      <section
        id="apply-form"
        className="scroll-mt-24 relative overflow-hidden bg-gradient-to-b from-surface via-surface to-surface-container-low py-16 md:py-24"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_50%,rgba(59,130,246,0.05),transparent)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute -end-20 top-1/3 h-[400px] w-[400px] rounded-full bg-primary/[0.04] blur-[100px]" />

        <div className="relative content-container">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_minmax(0,520px)] lg:gap-16">
            <div className="lg:sticky lg:top-28">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/8 px-4 py-2 text-[10px] font-black tracking-[0.32em] text-primary uppercase">
                <Icon name="description" size="sm" />
                {t("form.eyebrow")}
              </span>
              <h2 className="mt-5 font-headline text-4xl font-black tracking-tight text-on-surface md:text-5xl">
                {t("applyTitle")}
              </h2>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-on-surface-variant">
                {t("applyDescription")}
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
                            ? "person"
                            : index === 1
                              ? "biotech"
                              : "upload_file"
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
            </div>

            <div>
              {success ? (
                <Card padding="lg" className="border-emerald-500/20 bg-emerald-500/5 text-center shadow-lg">
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
                    {t("successMessage")}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
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
                      <Icon name="error" filled className="shrink-0 text-error" />
                      <p className="text-sm font-medium text-on-surface">
                        {t("form.errorMessage")}
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
                        <Icon name="person" size="sm" />
                        {t("form.sectionPersonal")}
                      </legend>
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="fullName"
                            className="mb-2 block text-sm font-bold text-on-surface"
                          >
                            {t("fullName")}
                          </label>
                          <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            required
                            autoComplete="name"
                            placeholder={t("fullNamePlaceholder")}
                            className={INPUT_CLASS}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="city"
                            className="mb-2 block text-sm font-bold text-on-surface"
                          >
                            {t("city")}
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            required
                            placeholder={t("cityPlaceholder")}
                            className={INPUT_CLASS}
                          />
                        </div>
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
                            autoComplete="tel"
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
                            autoComplete="email"
                            placeholder={t("emailPlaceholder")}
                            className={INPUT_CLASS}
                          />
                        </div>
                      </div>
                    </fieldset>

                    <fieldset className="space-y-5">
                      <legend className="mb-1 flex items-center gap-2 font-headline text-sm font-bold tracking-wide text-primary uppercase">
                        <Icon name="school" size="sm" />
                        {t("form.sectionProfessional")}
                      </legend>
                      <div>
                        <label
                          htmlFor="degree"
                          className="mb-2 block text-sm font-bold text-on-surface"
                        >
                          {t("degree")}
                        </label>
                        <input
                          type="text"
                          id="degree"
                          name="degree"
                          required
                          placeholder={t("degreePlaceholder")}
                          className={INPUT_CLASS}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="previousExperience"
                          className="mb-2 block text-sm font-bold text-on-surface"
                        >
                          {t("previousExperience")}
                        </label>
                        <textarea
                          id="previousExperience"
                          name="previousExperience"
                          rows={3}
                          placeholder={t("previousExperiencePlaceholder")}
                          className={`${INPUT_CLASS} resize-none`}
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="yearsOfExperience"
                            className="mb-2 block text-sm font-bold text-on-surface"
                          >
                            {t("yearsOfExperience")}
                          </label>
                          <input
                            type="number"
                            id="yearsOfExperience"
                            name="yearsOfExperience"
                            min={0}
                            placeholder={t("yearsOfExperiencePlaceholder")}
                            className={INPUT_CLASS}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="position"
                            className="mb-2 block text-sm font-bold text-on-surface"
                          >
                            {t("position")}
                          </label>
                          <select
                            ref={positionSelectRef}
                            id="position"
                            name="position"
                            required
                            value={selectedPositionId}
                            onChange={(e) =>
                              setSelectedPositionId(e.target.value)
                            }
                            className={INPUT_CLASS}
                          >
                            <option value="">{t("selectPosition")}</option>
                            {vacancies.map((v) => (
                              <option key={v.id} value={String(v.id)}>
                                {v.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="skills"
                          className="mb-2 block text-sm font-bold text-on-surface"
                        >
                          {t("skills")}
                        </label>
                        <textarea
                          id="skills"
                          name="skills"
                          rows={3}
                          placeholder={t("skillsPlaceholder")}
                          className={`${INPUT_CLASS} resize-none`}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="additionalCertifications"
                          className="mb-2 block text-sm font-bold text-on-surface"
                        >
                          {t("additionalCertifications")}
                        </label>
                        <textarea
                          id="additionalCertifications"
                          name="additionalCertifications"
                          rows={2}
                          placeholder={t(
                            "additionalCertificationsPlaceholder",
                          )}
                          className={`${INPUT_CLASS} resize-none`}
                        />
                      </div>
                    </fieldset>

                    <fieldset className="space-y-5">
                      <legend className="mb-1 flex items-center gap-2 font-headline text-sm font-bold tracking-wide text-primary uppercase">
                        <Icon name="upload_file" size="sm" />
                        {t("form.sectionDocuments")}
                      </legend>
                      <div>
                        <p className="mb-2 text-sm font-bold text-on-surface">
                          {t("cv")}
                        </p>
                        <label
                          htmlFor="cv"
                          className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-outline-variant/30 bg-white px-6 py-8 transition-all hover:border-primary/40 hover:bg-primary/[0.02]"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Icon name="upload_file" size="md" />
                          </div>
                          <span className="text-sm font-bold text-on-surface">
                            {t("uploadCV")}
                          </span>
                          <span className="text-xs text-on-surface-variant">
                            {t("cvHint")}
                          </span>
                          <input
                            type="file"
                            id="cv"
                            name="cv"
                            accept=".pdf,application/pdf"
                            required
                            className="sr-only"
                          />
                        </label>
                      </div>
                    </fieldset>

                    <button
                      type="submit"
                      disabled={submitting || vacancies.length === 0}
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
                    {vacancies.length === 0 ? (
                      <p className="text-center text-xs text-on-surface-variant">
                        {t("form.noPositionsHint")}
                      </p>
                    ) : null}
                  </form>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      <PageBannerSlotClient placement={BANNER_PLACEMENT.CAREERS} order={3} />
      <PageBannerOverflowClient placement={BANNER_PLACEMENT.CAREERS} />
    </>
  );
}
