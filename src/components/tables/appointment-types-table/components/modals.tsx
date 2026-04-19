"use client";

import { AppointmentTypeFormModal } from "@/components/modals/appointment-types";
import { useMirror } from "../store";

const Modals = () => {
  const activeModal = useMirror("activeModal");
  const setActiveModal = useMirror("setActiveModal");
  const selectedType = useMirror("selectedType");
  const setSelectedType = useMirror("setSelectedType");

  const close = () => {
    setActiveModal(null);
    setSelectedType(null);
  };

  return (
    <AppointmentTypeFormModal
      isOpen={activeModal === "create" || activeModal === "edit"}
      onClose={close}
      appointmentType={activeModal === "edit" ? selectedType : null}
    />
  );
};

export { Modals };
