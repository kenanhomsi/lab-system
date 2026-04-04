"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";

const INPUT_CLASS =
  "w-full rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20";

type SavedAddress = {
  id: string;
  label: string;
  address: string;
  lat: number;
  lng: number;
};

export function BookAppointmentPage() {
  const t = useTranslations("booking");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [drawLocation, setDrawLocation] = useState("lab");
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [address, setAddress] = useState("");

  useEffect(() => {
    fetch("/api/addresses")
      .then((r) => r.json())
      .then((data: SavedAddress[]) => setSavedAddresses(data))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const body: Record<string, unknown> = Object.fromEntries(formData.entries());
    body.drawLocation = drawLocation;
    body.address = address;

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
      }
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6 md:p-8">
      <div className="mb-8 text-center">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-primary">
          <Icon name="calendar_month" filled size="sm" />
          {t("badge")}
        </span>
        <h1 className="mt-4 font-headline text-3xl font-black tracking-tight text-on-surface md:text-4xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base text-on-surface-variant">
          {t("description")}
        </p>
      </div>

      {success ? (
        <Card className="mx-auto max-w-lg text-center">
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
            تم تأكيد الحجز، شكراً لثقتك بمخبر المتوالي للتحاليل الطبية، مع
            تمنياتنا لكم بدوام الصحة والعافية
          </p>
        </Card>
      ) : (
        <Card className="shadow-xl" padding="lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Info */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="patientName" className="mb-2 block text-sm font-bold text-on-surface">
                  {t("patientName")}
                </label>
                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  required
                  placeholder={t("patientNamePlaceholder")}
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label htmlFor="age" className="mb-2 block text-sm font-bold text-on-surface">
                  {t("age")}
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  required
                  min={1}
                  max={150}
                  placeholder={t("agePlaceholder")}
                  className={INPUT_CLASS}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="gender" className="mb-2 block text-sm font-bold text-on-surface">
                  {t("gender")}
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  className={INPUT_CLASS}
                >
                  <option value="">{t("genderPlaceholder")}</option>
                  <option value="male">{t("male")}</option>
                  <option value="female">{t("female")}</option>
                </select>
              </div>
              <div>
                <label htmlFor="mobile" className="mb-2 block text-sm font-bold text-on-surface">
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
            </div>

            {/* Draw Location */}
            <div>
              <span className="mb-3 block text-sm font-bold text-on-surface">
                {t("drawLocation")}
              </span>
              <div className="flex flex-wrap gap-4">
                {(["lab", "home", "work"] as const).map((loc) => (
                  <label
                    key={loc}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-5 py-3 text-sm font-medium transition-all ${
                      drawLocation === loc
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-outline-variant/30 bg-surface text-on-surface-variant hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="drawLocationRadio"
                      value={loc}
                      checked={drawLocation === loc}
                      onChange={() => setDrawLocation(loc)}
                      className="sr-only"
                    />
                    <Icon
                      name={loc === "lab" ? "science" : loc === "home" ? "home" : "work"}
                      filled={drawLocation === loc}
                      size="sm"
                    />
                    {t(`drawLocation_${loc}`)}
                  </label>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="date" className="mb-2 block text-sm font-bold text-on-surface">
                  {t("date")}
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label htmlFor="time" className="mb-2 block text-sm font-bold text-on-surface">
                  {t("time")}
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  required
                  className={INPUT_CLASS}
                />
              </div>
            </div>

            {/* Required Tests */}
            <div>
              <label htmlFor="tests" className="mb-2 block text-sm font-bold text-on-surface">
                {t("requiredTests")}
              </label>
              <textarea
                id="tests"
                name="tests"
                rows={3}
                required
                placeholder={t("requiredTestsPlaceholder")}
                className={`${INPUT_CLASS} resize-none`}
              />
            </div>

            {/* Prescription Image */}
            <div>
              <label htmlFor="prescription" className="mb-2 block text-sm font-bold text-on-surface">
                {t("prescriptionImage")}
              </label>
              <input
                type="file"
                id="prescription"
                name="prescription"
                accept="image/*"
                className="w-full rounded-xl border border-dashed border-outline-variant/50 bg-surface px-4 py-4 text-sm text-on-surface file:me-4 file:rounded-lg file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-xs file:font-bold file:text-primary"
              />
            </div>

            {/* Medical Condition */}
            <div>
              <label htmlFor="medicalCondition" className="mb-2 block text-sm font-bold text-on-surface">
                {t("medicalCondition")}
                <span className="ms-1 text-xs font-normal text-on-surface-variant">
                  ({t("optional")})
                </span>
              </label>
              <textarea
                id="medicalCondition"
                name="medicalCondition"
                rows={2}
                placeholder={t("medicalConditionPlaceholder")}
                className={`${INPUT_CLASS} resize-none`}
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="mb-2 block text-sm font-bold text-on-surface">
                {t("address")}
              </label>
              {savedAddresses.length > 0 && (
                <select
                  className={`${INPUT_CLASS} mb-3`}
                  onChange={(e) => {
                    const found = savedAddresses.find((a) => a.id === e.target.value);
                    if (found) setAddress(found.address);
                  }}
                  defaultValue=""
                >
                  <option value="">{t("savedAddresses")}</option>
                  {savedAddresses.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label} — {a.address}
                    </option>
                  ))}
                </select>
              )}
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t("addressPlaceholder")}
                className={INPUT_CLASS}
              />
            </div>

            {/* Map Placeholder */}
            <div className="overflow-hidden rounded-xl border border-outline-variant/20">
              <div className="flex h-48 items-center justify-center bg-surface-container gap-2 text-on-surface-variant">
                <Icon name="map" size="md" />
                <span className="text-sm font-medium">{t("selectOnMap")}</span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="clinical-gradient w-full rounded-xl px-8 py-4 text-sm font-bold tracking-widest text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <Icon name="progress_activity" className="animate-spin" size="sm" />
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
  );
}
