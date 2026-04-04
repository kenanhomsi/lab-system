"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const INPUT_CLASS =
  "w-full rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20";

const RADIO_WRAP =
  "flex cursor-pointer items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm text-on-surface transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5";

type TestItem = {
  id: string;
  nameEn: string;
  nameAr: string;
  price: number;
  requiredSample: string;
  requiredSampleAr: string;
};

type Patient = {
  uid: string;
  name: string;
  age: string;
  gender: "male" | "female" | "";
  tests: TestItem[];
};

function createPatient(): Patient {
  return { uid: crypto.randomUUID(), name: "", age: "", gender: "", tests: [] };
}

export function OrderTestsPage() {
  const t = useTranslations("labPages");

  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [patients, setPatients] = useState<Patient[]>(() => [createPatient()]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TestItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activePatientIdx, setActivePatientIdx] = useState<number | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchTests = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    try {
      const res = await fetch(`/api/tests?search=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        const items = Array.isArray(data) ? data : data.tests ?? [];
        setSearchResults(
          items.map((item: Record<string, unknown>) => ({
            id: item.id as string,
            nameEn: item.nameEn as string,
            nameAr: item.nameAr as string,
            price: item.price as number,
            requiredSample: item.requiredSample as string,
            requiredSampleAr: item.requiredSampleAr as string,
          })),
        );
      }
    } catch {
      /* ignore */
    } finally {
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => searchTests(searchQuery), 300);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery, searchTests]);

  function addTestToPatient(patientIdx: number, test: TestItem) {
    setPatients((prev) =>
      prev.map((p, i) => {
        if (i !== patientIdx) return p;
        if (p.tests.some((t) => t.id === test.id)) return p;
        return { ...p, tests: [...p.tests, test] };
      }),
    );
    setSearchQuery("");
    setSearchResults([]);
    setActivePatientIdx(null);
  }

  function removeTestFromPatient(patientIdx: number, testId: string) {
    setPatients((prev) =>
      prev.map((p, i) =>
        i !== patientIdx ? p : { ...p, tests: p.tests.filter((t) => t.id !== testId) },
      ),
    );
  }

  function updatePatientField(idx: number, field: keyof Patient, value: string) {
    setPatients((prev) =>
      prev.map((p, i) => (i !== idx ? p : { ...p, [field]: value })),
    );
  }

  function addPatient() {
    setPatients((prev) => [...prev, createPatient()]);
  }

  function deletePatient(idx: number) {
    setPatients((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== idx)));
  }

  function patientTotal(p: Patient) {
    return p.tests.reduce((sum, t) => sum + t.price, 0);
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/lab-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, patients }),
      });
      if (res.ok) {
        setSuccess(true);
      }
    } catch {
      /* ignore */
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-3xl p-6 md:p-8">
        <Card className="text-center shadow-xl">
          <Icon name="check_circle" filled className="mx-auto mb-4 text-emerald-500" size="lg" />
          <h2 className="font-headline text-xl font-bold text-on-surface">{t("successTitle")}</h2>
          <p className="mt-2 text-on-surface-variant">{t("successMessage")}</p>
          <Button
            className="mt-6"
            onClick={() => {
              setSuccess(false);
              setPatients([createPatient()]);
              setDate(new Date().toISOString().split("T")[0]);
            }}
          >
            <Icon name="add" size="sm" />
            {t("newOrder")}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 text-center md:text-start">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-primary">
          <Icon name="lab_panel" filled size="sm" />
          {t("orderTestsBadge")}
        </span>
        <h1 className="mt-4 font-headline text-3xl font-black tracking-tight text-on-surface md:text-4xl">
          {t("orderTests")}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-on-surface-variant md:mx-0">
          {t("orderTestsDesc")}
        </p>
      </div>

      {/* Date */}
      <Card className="mb-6 shadow-md">
        <label className="mb-2 block text-sm font-bold text-on-surface">{t("date")}</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={INPUT_CLASS}
        />
      </Card>

      {/* Patients */}
      {patients.map((patient, pIdx) => (
        <Card key={patient.uid} className="mb-6 shadow-md" padding="lg">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-headline text-lg font-bold text-on-surface">
              {t("patient")} #{pIdx + 1}
            </h3>
            {patients.length > 1 && (
              <button
                type="button"
                onClick={() => deletePatient(pIdx)}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <Icon name="delete" size="sm" />
                {t("deletePatient")}
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Patient fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-bold text-on-surface">
                  {t("patientName")}
                </label>
                <input
                  type="text"
                  value={patient.name}
                  onChange={(e) => updatePatientField(pIdx, "name", e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-on-surface">
                  {t("age")}
                </label>
                <input
                  type="number"
                  min={0}
                  max={150}
                  value={patient.age}
                  onChange={(e) => updatePatientField(pIdx, "age", e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>
              <fieldset>
                <legend className="mb-2 block text-sm font-bold text-on-surface">
                  {t("gender")}
                </legend>
                <div className="flex gap-2">
                  <label className={RADIO_WRAP}>
                    <input
                      type="radio"
                      name={`gender-${patient.uid}`}
                      value="male"
                      checked={patient.gender === "male"}
                      onChange={() => updatePatientField(pIdx, "gender", "male")}
                      className="size-4 accent-primary"
                    />
                    {t("male")}
                  </label>
                  <label className={RADIO_WRAP}>
                    <input
                      type="radio"
                      name={`gender-${patient.uid}`}
                      value="female"
                      checked={patient.gender === "female"}
                      onChange={() => updatePatientField(pIdx, "gender", "female")}
                      className="size-4 accent-primary"
                    />
                    {t("female")}
                  </label>
                </div>
              </fieldset>
            </div>

            {/* Test search */}
            <div className="relative">
              <label className="mb-2 block text-sm font-bold text-on-surface">
                {t("selectTest")}
              </label>
              <div className="relative">
                <Icon
                  name="search"
                  size="sm"
                  className="absolute start-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50"
                />
                <input
                  type="text"
                  value={activePatientIdx === pIdx ? searchQuery : ""}
                  onFocus={() => setActivePatientIdx(pIdx)}
                  onChange={(e) => {
                    setActivePatientIdx(pIdx);
                    setSearchQuery(e.target.value);
                  }}
                  placeholder={t("searchTests")}
                  className={`${INPUT_CLASS} ps-10`}
                />
              </div>
              {activePatientIdx === pIdx && searchQuery && (
                <div className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-lg">
                  {searchLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Icon name="progress_activity" className="animate-spin text-primary" size="sm" />
                    </div>
                  ) : searchResults.length === 0 ? (
                    <p className="p-4 text-center text-sm text-on-surface-variant">—</p>
                  ) : (
                    searchResults.map((test) => (
                      <button
                        key={test.id}
                        type="button"
                        className="flex w-full items-center justify-between px-4 py-3 text-start text-sm transition-colors hover:bg-primary/5"
                        onClick={() => addTestToPatient(pIdx, test)}
                      >
                        <div>
                          <p className="font-semibold text-on-surface">{test.nameAr}</p>
                          <p className="text-xs text-on-surface-variant">{test.nameEn} — {test.requiredSampleAr}</p>
                        </div>
                        <span className="font-bold text-primary">{test.price}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Selected tests table */}
            {patient.tests.length > 0 && (
              <div className="overflow-x-auto rounded-xl border border-outline-variant/10">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-outline-variant/10 bg-surface-container-low/50">
                      <th className="px-4 py-3 text-start font-bold text-on-surface">{t("tests")}</th>
                      <th className="px-4 py-3 text-start font-bold text-on-surface">{t("requiredSample")}</th>
                      <th className="px-4 py-3 text-end font-bold text-on-surface">{t("price")}</th>
                      <th className="px-4 py-3 text-center" />
                    </tr>
                  </thead>
                  <tbody>
                    {patient.tests.map((test) => (
                      <tr key={test.id} className="border-b border-outline-variant/5 last:border-0">
                        <td className="px-4 py-3">
                          <p className="font-medium text-on-surface">{test.nameAr}</p>
                          <p className="text-xs text-on-surface-variant">{test.nameEn}</p>
                        </td>
                        <td className="px-4 py-3 text-on-surface-variant">{test.requiredSampleAr}</td>
                        <td className="px-4 py-3 text-end font-bold text-on-surface">{test.price}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => removeTestFromPatient(pIdx, test.id)}
                            className="rounded-lg p-1 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
                          >
                            <Icon name="close" size="sm" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-primary/5">
                      <td colSpan={2} className="px-4 py-3 font-bold text-on-surface">{t("total")}</td>
                      <td className="px-4 py-3 text-end font-bold text-primary">{patientTotal(patient)}</td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </Card>
      ))}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" onClick={addPatient}>
          <Icon name="person_add" size="sm" />
          {t("addPatient")}
        </Button>
        <Button variant="ghost" onClick={() => window.location.reload()}>
          <Icon name="today" size="sm" />
          {t("viewToday")}
        </Button>
        <div className="flex-1" />
        <Button
          onClick={handleSubmit}
          disabled={submitting || patients.every((p) => p.tests.length === 0)}
          className="min-w-[160px]"
        >
          {submitting ? (
            <span className="inline-flex items-center gap-2">
              <Icon name="progress_activity" className="animate-spin" size="sm" />
              {t("saving")}
            </span>
          ) : (
            <>
              <Icon name="send" size="sm" />
              {t("saveAndSend")}
            </>
          )}
        </Button>
      </div>

      {/* Grand total */}
      {patients.some((p) => p.tests.length > 0) && (
        <Card className="mt-6 shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-headline text-lg font-bold text-on-surface">{t("total")}</span>
            <Badge tone="success" className="text-base">
              {patients.reduce((s, p) => s + patientTotal(p), 0)} {t("currency")}
            </Badge>
          </div>
        </Card>
      )}
    </div>
  );
}
