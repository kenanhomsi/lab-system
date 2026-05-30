import type { TestRequestItem } from "./types";

/** Resolves display labels for medical tests from grouped test-request rows. */
export function getMedicalTestNamesLabel(row: TestRequestItem): string {
  if (row.tests && row.tests.length > 0) {
    const names = row.tests
      .map((item) => item.medicalTestNameEn?.trim())
      .filter((name): name is string => Boolean(name));
    if (names.length > 0) {
      return names.join(", ");
    }
  }

  return row.medicalTestNameEn?.trim() ?? "";
}
