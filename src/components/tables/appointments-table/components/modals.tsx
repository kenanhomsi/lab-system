"use client";

import {
  CancelAppointmentModal,
  ConfirmAppointmentModal,
  CreateAppointmentModal,
} from "@/components/modals/appointments";
import { useMirror } from "../store";

const Modals = () => {
  const activeModal = useMirror("activeModal");
  const setActiveModal = useMirror("setActiveModal");
  const selectedAppointment = useMirror("selectedAppointment");

  const close = () => setActiveModal(null);

  return (
    <>
      <CreateAppointmentModal isOpen={activeModal === "create"} onClose={close} />
      <ConfirmAppointmentModal
        isOpen={activeModal === "confirm"}
        onClose={close}
        appointment={selectedAppointment}
      />
      <CancelAppointmentModal
        isOpen={activeModal === "cancel"}
        onClose={close}
        appointment={selectedAppointment}
      />
    </>
  );
};

export { Modals };
