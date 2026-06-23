"use client";

import { useCallback } from "react";
import { useMirror } from "../store";
import { CancelAppointmentModal } from "./cancel-appointment-modal";
import { EditAppointmentStatusModal } from "./edit-appointment-status-modal";

/**
 * Hosts all blood draw appointments table modal surfaces.
 */
const Modals = () => {
  const activeModal = useMirror("activeModal");
  const setActiveModal = useMirror("setActiveModal");
  const selectedAppointment = useMirror("selectedAppointment");
  const setSelectedAppointment = useMirror("setSelectedAppointment");

  const close = useCallback(() => {
    setActiveModal(null);
    setSelectedAppointment(null);
  }, [setActiveModal, setSelectedAppointment]);

  return (
    <>
      <EditAppointmentStatusModal
        isOpen={activeModal === "edit"}
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
