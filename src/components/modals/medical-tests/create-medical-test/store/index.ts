import { mirrorFactory } from "@/hooks/use-mirror-factory";
import type { UseMutationResult } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";

type CreateMedicalTestForm = {
  nameAr: string;
  nameEn: string;
  description: string;
};

const noopSetStateString = (() => undefined) as Dispatch<SetStateAction<string>>;
const noopSetStateBool = (() => undefined) as Dispatch<SetStateAction<boolean>>;

const emptyCreateMutation = {} as UseMutationResult<
  unknown,
  unknown,
  CreateMedicalTestForm
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
  createMutation: emptyCreateMutation,
  onSuccess: () => {},
  onError: () => {},
});

export { useMirror, useMirrorRegistry };
