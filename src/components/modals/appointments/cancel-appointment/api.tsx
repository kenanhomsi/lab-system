"use client";

import { useMirror as useTableMirror } from "@/components/tables/appointments-table/store";
import { PropsWithChildren } from "react";
import { useMirror, useMirrorRegistry } from "./store";

const Api = ({ children }: PropsWithChildren) => {
  const appointment = useMirror("appointment");
  const setIsSubmitting = useMirror("setIsSubmitting");
  const handleClose = useMirror("handleClose");
  const cancelAppointment = useTableMirror("cancelAppointment");

  const submit = async () => {
    if (!appointment) return;
    setIsSubmitting(true);
    try {
      await cancelAppointment(appointment.id);
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  useMirrorRegistry("submit", submit);
  return <>{children}</>;
};

export { Api };
