import { mirrorFactory } from "@/hooks/use-mirror-factory";
import { Dispatch, SetStateAction } from "react";

type TestResultForm = {
  testRequestId: number;
  resultDate: string;
  status: string;
  resultData: string;
  pdfUrl: string;
};

const initialForm: TestResultForm = {
  testRequestId: 0,
  resultDate: "",
  status: "pending",
  resultData: "",
  pdfUrl: "",
};

const { useMirror, useMirrorRegistry } = mirrorFactory({
  props: {},
  form: initialForm,
  setForm: (() => undefined) as Dispatch<SetStateAction<TestResultForm>>,
  submitAction: (async () => undefined) as (
    payload: TestResultForm,
  ) => Promise<unknown>,
  isSubmitting: false,
  setIsSubmitting: (() => undefined) as Dispatch<SetStateAction<boolean>>,
});

export { useMirror, useMirrorRegistry };
