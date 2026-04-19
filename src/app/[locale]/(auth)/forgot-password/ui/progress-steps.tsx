"use client";

import { Step } from "../store/state";

const STEPS: Step[] = ["identifier", "code", "newPassword"];

interface ProgressStepsProps {
  currentStep: Step;
}

export function ProgressSteps({ currentStep }: ProgressStepsProps) {
  const currentIndex = STEPS.indexOf(currentStep);

  return (
    <div className="mb-8 flex items-center justify-center gap-2">
      {STEPS.map((s, i) => (
        <div
          key={s}
          className={`h-2 w-12 rounded-full transition-colors ${
            currentIndex >= i ? "bg-primary" : "bg-surface-container-low"
          }`}
        />
      ))}
    </div>
  );
}
