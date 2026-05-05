import { mirrorFactory } from "@/hooks/use-mirror-factory";
import { Dispatch, SetStateAction } from "react";

const { useMirror, useMirrorRegistry } = mirrorFactory({
  props: {},
  submitAction: (async () => undefined) as (id: string) => Promise<unknown>,
  isSubmitting: false,
  setIsSubmitting: (() => undefined) as Dispatch<SetStateAction<boolean>>,
});

export { useMirror, useMirrorRegistry };
