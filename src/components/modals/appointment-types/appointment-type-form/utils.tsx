"use client";

import {
  CreateAppointmentTypeRequest,
  UpdateAppointmentTypeRequest,
} from "@/components/tables/appointment-types-table/types";
import { PropsWithChildren, useMemo } from "react";
import { useMirror, useMirrorRegistry } from "./store";

const Utils = ({ children }: PropsWithChildren) => {
  const appointmentType = useMirror("appointmentType");
  const onClose = useMirror("onClose");
  const name = useMirror("name");
  const isActive = useMirror("isActive");
  const isSubmitting = useMirror("isSubmitting");
  const setIsSubmitting = useMirror("setIsSubmitting");
  const createAppointmentTypeApi = useMirror("createAppointmentTypeApi");
  const updateAppointmentTypeApi = useMirror("updateAppointmentTypeApi");

  const canSubmit = useMemo(() => Boolean(name.trim()), [name]);

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const submit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      if (appointmentType) {
        const payload: UpdateAppointmentTypeRequest = { name, isActive };
        await updateAppointmentTypeApi(appointmentType.id, payload);
      } else {
        const payload: CreateAppointmentTypeRequest = { name };
        await createAppointmentTypeApi(payload);
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  useMirrorRegistry("canSubmit", canSubmit);
  useMirrorRegistry("handleClose", handleClose);
  useMirrorRegistry("submit", submit);

  return <>{children}</>;
};

export { Utils };
