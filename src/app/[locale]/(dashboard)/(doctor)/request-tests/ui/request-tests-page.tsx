"use client";

import { useState, type FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";

const INPUT_CLASS =
  "w-full rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20";

const RADIO_WRAP =
  "flex cursor-pointer items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm text-on-surface transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("read failed"));
    reader.readAsDataURL(file);
  });
}

export function RequestTestsPage() {
  const { data: session, status } = useSession();
  const tb = useTranslations("booking");
  const td = useTranslations("doctorPages");
  const ta = useTranslations("auth");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const doctorId = session?.user?.id;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!doctorId) {
      setError(td("signInRequired"));
      return;
    }

    const form = e.currentTarget;
    const fd = new FormData(form);

    const patientName = String(fd.get("patientName") ?? "").trim();
    const age = Number(fd.get("age"));
    const gender = fd.get("gender");
    const mobile = String(fd.get("mobile") ?? "").trim();
    const drawLocation = fd.get("drawLocation");
    const dateTime = String(fd.get("dateTime") ?? "").trim();
    const requiredTests = String(fd.get("requiredTests") ?? "").trim();
    const medicalCondition = String(fd.get("medicalCondition") ?? "").trim();
    const address = String(fd.get("address") ?? "").trim();
    const file = (fd.get("prescription") as File | null) || null;

    let prescriptionImage: string | undefined;
    if (file && file.size > 0) {
      try {
        prescriptionImage = await readFileAsDataUrl(file);
      } catch {
        setError(tb("uploadPrescription"));
        return;
      }
    }

    const payload = {
      patientName,
      age,
      gender,
      mobile,
      drawLocation,
      dateTime,
      requiredTests,
      medicalCondition: medicalCondition || undefined,
      address,
      prescriptionImage,
      referredByDoctorId: doctorId,
    };

    setSubmitting(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error || td("loadError"));
        return;
      }
      setSuccess(true);
      form.reset();
    } catch {
      setError(td("loadError"));
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="mx-auto flex min-h-[40vh] max-w-3xl items-center justify-center p-6 md:p-8">
        <Icon name="progress_activity" className="animate-spin text-primary" size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6 md:p-8">
      <div className="mb-10 text-center md:text-start">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-primary">
          <Icon name="assignment_add" filled size="sm" />
          {td("requestTestsBadge")}
        </span>
        <h1 className="mt-4 font-headline text-3xl font-black tracking-tight text-on-surface md:text-4xl">
          {td("requestTests")}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-on-surface-variant md:mx-0">
          {td("requestTestsDescription")}
        </p>
      </div>

      {!doctorId ? (
        <Card className="text-center shadow-lg">
          <Icon name="lock" className="mx-auto mb-3 text-on-surface-variant" size="lg" />
          <p className="text-on-surface-variant">{td("signInRequired")}</p>
          <Link
            href="/login"
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
          >
            {ta("signIn")}
            <Icon name="arrow_forward" className="rtl:rotate-180" size="sm" />
          </Link>
        </Card>
      ) : success ? (
        <Card className="text-center shadow-xl">
          <Icon
            name="check_circle"
            filled
            className="mx-auto mb-4 text-emerald-500"
            size="lg"
          />
          <h2 className="font-headline text-xl font-bold text-on-surface">{td("successTitle")}</h2>
          <p className="mt-2 text-on-surface-variant">{td("successMessage")}</p>
          <button
            type="button"
            onClick={() => setSuccess(false)}
            className="clinical-gradient mt-6 inline-flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-bold tracking-widest text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-95 active:scale-[0.98]"
          >
            <Icon name="add" size="sm" />
            {td("requestTests")}
          </button>
        </Card>
      ) : (
        <Card className="shadow-xl" padding="lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
                {error}
              </div>
            ) : null}

            <div>
              <label htmlFor="patientName" className="mb-2 block text-sm font-bold text-on-surface">
                {tb("patientName")}
              </label>
              <input
                id="patientName"
                name="patientName"
                type="text"
                required
                className={INPUT_CLASS}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="age" className="mb-2 block text-sm font-bold text-on-surface">
                  {tb("age")}
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min={0}
                  max={150}
                  required
                  className={INPUT_CLASS}
                />
              </div>
              <fieldset>
                <legend className="mb-2 block text-sm font-bold text-on-surface">{tb("gender")}</legend>
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                  <label className={RADIO_WRAP}>
                    <input type="radio" name="gender" value="male" required className="size-4 accent-primary" />
                    {tb("male")}
                  </label>
                  <label className={RADIO_WRAP}>
                    <input type="radio" name="gender" value="female" className="size-4 accent-primary" />
                    {tb("female")}
                  </label>
                </div>
              </fieldset>
            </div>

            <div>
              <label htmlFor="mobile" className="mb-2 block text-sm font-bold text-on-surface">
                {tb("mobile")}
              </label>
              <input id="mobile" name="mobile" type="tel" required className={INPUT_CLASS} />
            </div>

            <fieldset>
              <legend className="mb-2 block text-sm font-bold text-on-surface">{tb("drawLocation")}</legend>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <label className={RADIO_WRAP}>
                  <input type="radio" name="drawLocation" value="lab" required className="size-4 accent-primary" />
                  {tb("atLab")}
                </label>
                <label className={RADIO_WRAP}>
                  <input type="radio" name="drawLocation" value="home" className="size-4 accent-primary" />
                  {tb("atHome")}
                </label>
                <label className={RADIO_WRAP}>
                  <input type="radio" name="drawLocation" value="work" className="size-4 accent-primary" />
                  {tb("atWork")}
                </label>
              </div>
            </fieldset>

            <div>
              <label htmlFor="dateTime" className="mb-2 block text-sm font-bold text-on-surface">
                {tb("dateTime")}
              </label>
              <input id="dateTime" name="dateTime" type="datetime-local" required className={INPUT_CLASS} />
            </div>

            <div>
              <label htmlFor="requiredTests" className="mb-2 block text-sm font-bold text-on-surface">
                {tb("requiredTests")}
              </label>
              <textarea
                id="requiredTests"
                name="requiredTests"
                rows={4}
                required
                className={`${INPUT_CLASS} resize-none`}
              />
            </div>

            <div>
              <label htmlFor="prescription" className="mb-2 block text-sm font-bold text-on-surface">
                {tb("uploadPrescription")}
              </label>
              <input
                id="prescription"
                name="prescription"
                type="file"
                accept="image/*"
                onChange={() => setError("")}
                className="w-full rounded-xl border border-dashed border-outline-variant/50 bg-surface px-4 py-4 text-sm text-on-surface file:me-4 file:rounded-lg file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-xs file:font-bold file:text-primary"
              />
            </div>

            <div>
              <label htmlFor="medicalCondition" className="mb-2 block text-sm font-bold text-on-surface">
                {tb("medicalCondition")}
              </label>
              <textarea
                id="medicalCondition"
                name="medicalCondition"
                rows={3}
                className={`${INPUT_CLASS} resize-none`}
              />
            </div>

            <div>
              <label htmlFor="address" className="mb-2 block text-sm font-bold text-on-surface">
                {tb("address")}
              </label>
              <textarea id="address" name="address" rows={3} required className={`${INPUT_CLASS} resize-none`} />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="clinical-gradient w-full rounded-xl px-8 py-4 text-sm font-bold tracking-widest text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Icon name="progress_activity" className="animate-spin" size="sm" />
                  {td("submittingRequest")}
                </span>
              ) : (
                td("submitRequest")
              )}
            </button>
          </form>
        </Card>
      )}
    </div>
  );
}
