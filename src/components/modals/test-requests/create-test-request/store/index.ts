import { mirrorFactory } from "@/hooks/use-mirror-factory";
import { Dispatch, SetStateAction } from "react";

type TestRequestForm = {
  medicalTestIds: number[];
  requestDate: string;
  status: string;
  totalAmount: number;
  notes: string;
  metadata: string;
  doctorId: string;
  labClientId: string;
  directPatientId: string;
  externalPatientId: number;
};

const initialForm: TestRequestForm = {
  medicalTestIds: [],
  requestDate: "",
  status: "pending",
  totalAmount: 0,
  notes: "",
  metadata: "",
  doctorId: "",
  labClientId: "",
  directPatientId: "",
  externalPatientId: 0,
};

const { useMirror, useMirrorRegistry } = mirrorFactory({
  props: {},
  form: initialForm,
  setForm: (() => undefined) as Dispatch<SetStateAction<TestRequestForm>>,
  submitAction: (async () => undefined) as (
    payload: TestRequestForm,
  ) => Promise<unknown>,
  isSubmitting: false,
  setIsSubmitting: (() => undefined) as Dispatch<SetStateAction<boolean>>,
});

export { useMirror, useMirrorRegistry };
