import { ModalProps } from "@mantine/core";
import { TestResultItem } from "@/components/tables/test-results-table/types";
export type FactoryProps = ModalProps & { testResult: TestResultItem | null };
