import { ModalProps } from "@mantine/core";
import { TestRequestItem } from "@/components/tables/test-requests-table/types";
export type FactoryProps = ModalProps & { testRequest: TestRequestItem | null };
