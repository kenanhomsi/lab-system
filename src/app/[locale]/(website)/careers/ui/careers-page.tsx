"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import {
  getVacanciesPublic,
  postCareersApplication,
} from "@/lib/clients/website-public-client";
import type { Vacancy } from "@/types/career";

type DisplayVacancy = {
  id: number;
  title: string;
  description: string;
};

const INPUT_CLASS =
  "w-full rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20";

function truncateText(text: string, maxLength = 120): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

function toDisplayVacancy(job: Vacancy, locale: string): DisplayVacancy {
  const isAr = locale === "ar";
  return {
    id: job.id,
    title: isAr ? job.titleAr : job.titleEn,
    description: truncateText(isAr ? job.descriptionAr : job.descriptionEn),
  };
}

export function CareersPage() {
  const t = useTranslations("careers");
  const locale = useLocale();
  const [vacancies, setVacancies] = useState<DisplayVacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getVacanciesPublic()
      .then((items) => setVacancies(items.map((job) => toDisplayVacancy(job, locale))))
      .catch(() => setVacancies([]))
      .finally(() => setLoading(false));
  }, [locale]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

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
    apiFormData.append("AdditionalCertificates", fd.get("additionalCertifications") as string);
    apiFormData.append("VacantJobId", fd.get("position") as string);

    const cvFile = fd.get("cv");
    if (cvFile) {
      apiFormData.append("CvFile", cvFile);
    }

    try {
      await postCareersApplication(apiFormData);
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
        <div className="mb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-primary">
            <Icon name="work" filled size="sm" />
            {t("badge")}
          </span>
          <h1 className="mt-4 font-headline text-4xl font-black tracking-tight text-on-surface md:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-on-surface-variant">
            {t("description")}
          </p>
        </div>

        <section className="mb-20">
          <h2 className="mb-8 font-headline text-2xl font-bold text-on-surface">
            {t("openPositions")}
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Icon
                name="progress_activity"
                className="animate-spin text-primary"
                size="lg"
              />
            </div>
          ) : vacancies.length === 0 ? (
            <Card className="text-center">
              <Icon
                name="work_off"
                className="mx-auto mb-3 text-on-surface-variant/40"
                size="lg"
              />
              <p className="text-on-surface-variant">{t("noVacancies")}</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {vacancies.map((v) => (
                <Card
                  key={v.id}
                  className="transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon name="work" filled className="text-primary" size="sm" />
                  </div>
                  <h3 className="font-headline text-base font-bold text-on-surface">
                    {v.title}
                  </h3>
                  {v.description ? (
                    <p className="mt-2 line-clamp-3 text-sm text-on-surface-variant">
                      {v.description}
                    </p>
                  ) : null}
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <h2 className="font-headline text-2xl font-bold text-on-surface">
                {t("applyTitle")}
              </h2>
              <p className="mt-2 text-on-surface-variant">
                {t("applyDescription")}
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

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                        id="position"
                        name="position"
                        required
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
                      placeholder={t("additionalCertificationsPlaceholder")}
                      className={`${INPUT_CLASS} resize-none`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="cv"
                      className="mb-2 block text-sm font-bold text-on-surface"
                    >
                      {t("cv")}
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        id="cv"
                        name="cv"
                        accept=".pdf"
                        required
                        className="w-full rounded-xl border border-dashed border-outline-variant/50 bg-surface px-4 py-4 text-sm text-on-surface file:me-4 file:rounded-lg file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-xs file:font-bold file:text-primary"
                      />
                    </div>
                    <p className="mt-1 text-xs text-on-surface-variant">
                      {t("cvHint")}
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
        </section>
      </div>
    </main>
  );
}
