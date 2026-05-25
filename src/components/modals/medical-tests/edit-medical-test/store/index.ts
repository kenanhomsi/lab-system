import { mirrorFactory } from "@/hooks/use-mirror-factory";
import type { MedicalTest } from "@/types/test";
import type { UseMutationResult } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";

type UpdateMedicalTestForm = {
  id: string;
  data: { nameAr: string; nameEn: string; description: string };
};

const noopSetStateString = (() => undefined) as Dispatch<SetStateAction<string>>;
const noopSetStateBool = (() => undefined) as Dispatch<SetStateAction<boolean>>;

const emptyUpdateMutation = {} as UseMutationResult<
  unknown,
  unknown,
  UpdateMedicalTestForm
>;

const { useMirror, useMirrorRegistry } = mirrorFactory({
  isOpen: false,
  onClose: () => {},
  nameAr: "",
  setNameAr: noopSetStateString,
  nameEn: "",
  setNameEn: noopSetStateString,
  description: "",
  setDescription: noopSetStateString,
  isSubmitting: false,
  setIsSubmitting: noopSetStateBool,
  updateMutation: emptyUpdateMutation,
  medicalTest: null as MedicalTest | null,
});

export { useMirror, useMirrorRegistry };
