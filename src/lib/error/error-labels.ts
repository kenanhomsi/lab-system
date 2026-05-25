export type ErrorLabels = {
  fetchErrorTitle: string;
  operationFailedTitle: string;
  genericFallback: string;
  alertTitle: string;
};

const DEFAULT_LABELS: ErrorLabels = {
  fetchErrorTitle: "Failed to load data",
  operationFailedTitle: "Operation failed",
  genericFallback: "Something went wrong. Please try again.",
  alertTitle: "Error",
};

let labels: ErrorLabels = DEFAULT_LABELS;

export function setErrorLabels(next: ErrorLabels): void {
  labels = next;
}

export function getErrorLabels(): ErrorLabels {
  return labels;
}
