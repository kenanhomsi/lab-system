"use client";

import { useCallback } from "react";
import { useMirror } from "../store";
import { AvailabilityFormModal } from "./availability-form-modal";
import { DeleteAvailabilityModal } from "./delete-availability-modal";

/**
 * Hosts all availabilities table modal surfaces.
 */
const Modals = () => {
  const activeModal = useMirror("activeModal");
  const setActiveModal = useMirror("setActiveModal");
  const selectedAvailability = useMirror("selectedAvailability");
  const setSelectedAvailability = useMirror("setSelectedAvailability");

  const close = useCallback(() => {
    setActiveModal(null);
    setSelectedAvailability(null);
  }, [setActiveModal, setSelectedAvailability]);

  return (
    <>
      <AvailabilityFormModal mode="create" isOpen={activeModal === "create"} onClose={close} />
      <AvailabilityFormModal
        mode="edit"
        isOpen={activeModal === "edit"}
        onClose={close}
        availability={selectedAvailability}
      />
      <DeleteAvailabilityModal
        isOpen={activeModal === "delete"}
        onClose={close}
        availability={selectedAvailability}
      />
    </>
  );
};

export { Modals };
