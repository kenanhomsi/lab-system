"use client";

import { useCallback } from "react";
import { useMirror } from "../store";
import { AdFormModal } from "./ad-form-modal";
import { DeleteAdModal } from "./delete-ad-modal";
import { ViewAdModal } from "./view-ad-modal";

/**
 * Hosts all ads table modal surfaces.
 */
const Modals = () => {
  const activeModal = useMirror("activeModal");
  const setActiveModal = useMirror("setActiveModal");
  const selectedAd = useMirror("selectedAd");
  const setSelectedAd = useMirror("setSelectedAd");

  const close = useCallback(() => {
    setActiveModal(null);
    setSelectedAd(null);
  }, [setActiveModal, setSelectedAd]);

  return (
    <>
      <AdFormModal mode="create" isOpen={activeModal === "create"} onClose={close} />
      <AdFormModal
        mode="edit"
        isOpen={activeModal === "edit"}
        onClose={close}
        ad={selectedAd}
      />
      <ViewAdModal isOpen={activeModal === "view"} onClose={close} ad={selectedAd} />
      <DeleteAdModal isOpen={activeModal === "delete"} onClose={close} ad={selectedAd} />
    </>
  );
};

export { Modals };
