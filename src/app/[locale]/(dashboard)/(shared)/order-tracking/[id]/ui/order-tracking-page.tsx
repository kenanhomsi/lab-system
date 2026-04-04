"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";

type TrackingStep = {
  key: string;
  label: string;
  icon: string;
  completed: boolean;
  completedAt: string | null;
};

type TrackingData = {
  appointmentId: string;
  patientName: string;
  steps: TrackingStep[];
};

export function OrderTrackingPage() {
  const t = useTranslations("tracking");
  const params = useParams();
  const id = params.id as string;
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/appointments/${id}/tracking`)
      .then((r) => r.json())
      .then((data: TrackingData) => setTracking(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Icon name="progress_activity" className="animate-spin text-primary" size="lg" />
      </div>
    );
  }

  if (!tracking) {
    return (
      <div className="mx-auto max-w-2xl p-6 md:p-8">
        <Card className="py-12 text-center">
          <Icon name="error_outline" className="mx-auto mb-3 text-on-surface-variant/40" size="lg" />
          <p className="text-on-surface-variant">{t("notFound")}</p>
        </Card>
      </div>
    );
  }

  const activeIndex = tracking.steps.findIndex((s) => !s.completed);

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6 md:p-8">
      <div className="mb-8 text-center">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-primary">
          <Icon name="local_shipping" filled size="sm" />
          {t("badge")}
        </span>
        <h1 className="mt-4 font-headline text-3xl font-black tracking-tight text-on-surface md:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-on-surface-variant">
          {t("orderNumber")}: <span className="font-mono font-bold text-primary">{tracking.appointmentId}</span>
        </p>
        <p className="mt-1 text-sm text-on-surface-variant">
          {t("patient")}: {tracking.patientName}
        </p>
      </div>

      <Card padding="lg" className="shadow-xl">
        <div className="relative">
          {tracking.steps.map((step, i) => {
            const isLast = i === tracking.steps.length - 1;
            const isCurrent = i === activeIndex;

            return (
              <div key={step.key} className="relative flex gap-4 pb-8 last:pb-0">
                {/* Vertical line */}
                {!isLast && (
                  <div
                    className={`absolute inset-s-5 top-10 h-[calc(100%-2rem)] w-0.5 ${
                      step.completed ? "bg-primary" : "bg-outline-variant/20"
                    }`}
                  />
                )}

                {/* Step circle */}
                <div
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all ${
                    step.completed
                      ? "bg-primary text-on-primary shadow-lg shadow-primary/30"
                      : isCurrent
                        ? "border-2 border-primary bg-primary/10 text-primary"
                        : "border-2 border-outline-variant/30 bg-surface text-on-surface-variant/40"
                  }`}
                >
                  <Icon
                    name={step.completed ? "check" : step.icon}
                    filled={step.completed}
                    size="sm"
                  />
                </div>

                {/* Step content */}
                <div className="flex-1 pt-1.5">
                  <h3
                    className={`text-sm font-bold ${
                      step.completed
                        ? "text-on-surface"
                        : isCurrent
                          ? "text-primary"
                          : "text-on-surface-variant/50"
                    }`}
                  >
                    {step.label}
                  </h3>
                  {step.completedAt && (
                    <p className="mt-1 text-xs text-on-surface-variant">
                      <Icon name="schedule" size="sm" className="me-1 align-middle" />
                      {new Date(step.completedAt).toLocaleString("ar-SY", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  )}
                  {isCurrent && (
                    <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                      {t("inProgress")}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
