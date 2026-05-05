import { mirrorFactory } from "@/hooks/use-mirror-factory";
import type { MedicalTest } from "@/types/test";
import type { UseMutationResult } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";

const noopSetStateBool = (() => undefined) as Dispatch<SetStateAction<boolean>>;

const emptyDeleteMutation = {} as UseMutationResult<unknown, Error, string>;

const { useMirror, useMirrorRegistry } = mirrorFactory({
  isOpen: false,
  onClose: () => {},
  isSubmitting: false,
  setIsSubmitting: noopSetStateBool,
  deleteMutation: emptyDeleteMutation,
  medicalTest: null as MedicalTest | null,
});

export { useMirror, useMirrorRegistry };
