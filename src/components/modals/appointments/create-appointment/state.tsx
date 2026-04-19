"use client";

import { PropsWithChildren, useState } from "react";
import { AppointmentForm } from "./types";
import { useMirror, useMirrorRegistry } from "./store";

const defaultForm: AppointmentForm = {
  appointmentTypeId: 0,
  name: "",
  description: "",
  notes: "",
  slot: "",
  locationType: "",
  address: "",
  latitude: 0,
  longitude: 0,
  patientId: "",
  doctorId: "",
  labPartnerId: "",
};

const State = ({ children }: PropsWithChildren) => {
  const [form, setForm] = useState<AppointmentForm>(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onClose = useMirror("onClose");

  const updateField = <K extends keyof AppointmentForm>(key: K, value: AppointmentForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
    setForm(defaultForm);
  };

  useMirrorRegistry("form", form);
  useMirrorRegistry("isSubmitting", isSubmitting);
  useMirrorRegistry("setIsSubmitting", setIsSubmitting);
  useMirrorRegistry("updateField", updateField);
  useMirrorRegistry("handleClose", handleClose);

  return <>{children}</>;
};

export { State };
