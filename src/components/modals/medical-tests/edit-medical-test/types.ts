import { ModalProps } from "@mantine/core";
import { MedicalTest } from "@/types/test";

export type EditMedicalTestModalProps = ModalProps & {
  medicalTest: MedicalTest | null;
};

export type FactoryProps = EditMedicalTestModalProps;