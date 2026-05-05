import { ModalProps } from "@mantine/core";
import { MedicalTest } from "@/types/test";

export type DeleteMedicalTestModalProps = ModalProps & {
  medicalTest: MedicalTest | null;
};

export type FactoryProps = DeleteMedicalTestModalProps;
