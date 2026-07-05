export const API_PATIENT_LOCATION_TYPES = ["Home", "Work", "ComeToUs"] as const;

export type ApiPatientLocationType = (typeof API_PATIENT_LOCATION_TYPES)[number];

export const UI_PATIENT_LOCATION_TYPES = ["home", "work", "lab"] as const;

export type UiPatientLocationType = (typeof UI_PATIENT_LOCATION_TYPES)[number];

const UI_TO_API: Record<UiPatientLocationType, ApiPatientLocationType> = {
  home: "Home",
  work: "Work",
  lab: "ComeToUs",
};

const API_TO_LABEL_KEY: Record<string, string> = {
  home: "locationHome",
  work: "locationWork",
  lab: "locationLab",
  cometous: "locationLab",
};

/**
 * Maps form/UI location values to the backend PatientLocationType enum.
 */
export function toApiPatientLocationType(value: string): ApiPatientLocationType {
  const normalized = value.trim().toLowerCase();
  if (normalized === "home") return "Home";
  if (normalized === "work") return "Work";
  if (normalized === "lab" || normalized === "cometous") return "ComeToUs";
  if (value === "Home" || value === "Work" || value === "ComeToUs") {
    return value;
  }
  return "ComeToUs";
}

/**
 * Returns true when the location type requires PatientLatitude/PatientLongitude.
 */
export function requiresPatientCoordinates(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return normalized === "home" || normalized === "work";
}

/**
 * Resolves a translation key for displaying a patient location type.
 */
export function locationLabelKey(value: string): string {
  const normalized = value.trim().toLowerCase();
  return API_TO_LABEL_KEY[normalized] ?? "locationUnknown";
}

/**
 * Maps a UI location type to the API enum (typed helper for form state).
 */
export function uiToApiLocationType(value: UiPatientLocationType): ApiPatientLocationType {
  return UI_TO_API[value];
}
