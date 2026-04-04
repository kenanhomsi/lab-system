import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { TrackingStep } from "@/types/tracking";

const STEP_ICONS: Record<TrackingStep, string> = {
  received: "inbox",
  sampled: "bloodtype",
  analyzing: "science",
  ready: "task_alt",
};

const STEP_ORDER: TrackingStep[] = [
  "received",
  "sampled",
  "analyzing",
  "ready",
];

export type TrackingTimelineStep = {
  step: TrackingStep;
  label: string;
  completedAt?: string;
};

export type TrackingTimelineProps = {
  steps: TrackingTimelineStep[];
  currentStep: TrackingStep;
  /** Defaults to RTL for Arabic labels */
  dir?: "rtl" | "ltr";
};

export function TrackingTimeline({
  steps,
  currentStep,
  dir = "rtl",
}: TrackingTimelineProps) {
  const currentIndex = STEP_ORDER.indexOf(currentStep);

  const ordered = [...steps].sort(
    (a, b) => STEP_ORDER.indexOf(a.step) - STEP_ORDER.indexOf(b.step),
  );

  return (
    <div className={cn("relative flex flex-col gap-0")} dir={dir}>
      {ordered.map((item, index) => {
        const stepIndex = STEP_ORDER.indexOf(item.step);
        const isComplete = stepIndex < currentIndex;
        const isCurrent = item.step === currentStep;
        const isPending = stepIndex > currentIndex;

        const iconClass = cn(
          isComplete && "text-green-600",
          isCurrent && "text-primary",
          isPending && "text-on-surface-variant",
        );

        const ringClass = cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full border-2 bg-[var(--surface)]",
          isComplete && "border-green-600",
          isCurrent && "border-primary ring-2 ring-primary/30",
          isPending && "border-outline-variant",
        );

        const showLine = index < ordered.length - 1;

        return (
          <div key={item.step} className="relative flex gap-3">
            <div
              className={cn(
                "relative flex flex-col items-center",
                dir === "rtl" ? "order-2" : "order-0",
              )}
            >
              <div className={ringClass}>
                <Icon
                  name={STEP_ICONS[item.step]}
                  size="sm"
                  className={iconClass}
                  filled={isComplete || isCurrent}
                />
              </div>
              {showLine ? (
                <div
                  className={cn(
                    "mt-1 w-0.5 flex-1 min-h-[28px]",
                    isComplete ? "bg-green-600" : "bg-outline-variant",
                  )}
                  aria-hidden
                />
              ) : null}
            </div>

            <div
              className={cn(
                "flex min-w-0 flex-1 flex-col pb-6 pt-1",
                dir === "rtl" ? "items-end text-right" : "items-start text-left",
                dir === "rtl" ? "order-1" : "order-0",
              )}
            >
              <span
                className={cn(
                  "text-sm font-medium",
                  isComplete && "text-green-700 dark:text-green-400",
                  isCurrent && "text-primary",
                  isPending && "text-on-surface-variant",
                )}
              >
                {item.label}
              </span>
              {item.completedAt ? (
                <span className="text-xs text-on-surface-variant">
                  {item.completedAt}
                </span>
              ) : null}
              {isCurrent && !item.completedAt ? (
                <span className="text-xs text-primary">جاري…</span>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
