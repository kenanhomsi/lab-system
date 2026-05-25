import type { TestResultItem } from "./types";

export function getTestRequestCreatorLabel(
  item: Pick<
    TestResultItem,
    | "testRequestCreatedByFullName"
    | "testRequestCreatedByName"
    | "testRequestCreatedByUserId"
  >,
): string | null {
  return (
    item.testRequestCreatedByFullName?.trim() ||
    item.testRequestCreatedByName?.trim() ||
    item.testRequestCreatedByUserId?.trim() ||
    null
  );
}
