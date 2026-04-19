"use client";

import { useMirror as useTableMirror } from "@/components/tables/appointments-table/store";
import { PropsWithChildren } from "react";
import { useMirror, useMirrorRegistry } from "./store";

const Api = ({ children }: PropsWithChildren) => {
  const form = useMirror("form");
  const setIsSubmitting = useMirror("setIsSubmitting");
  const handleClose = useMirror("handleClose");
  const createAppointment = useTableMirror("createAppointment");

  const canSubmit =
    form.appointmentTypeId > 0 &&
    Boolean(form.name.trim()) &&
    Boolean(form.slot.trim()) &&
    Boolean(form.locationType.trim()) &&
    Boolean(form.address.trim());

  const submit = async () => {
    setIsSubmitting(true);
    try {
      await createAppointment(form);
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  useMirrorRegistry("createAppointment", createAppointment);
  useMirrorRegistry("canSubmit", canSubmit);
  useMirrorRegistry("submit", submit);
  return <>{children}</>;
};

export { Api };
