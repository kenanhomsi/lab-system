"use client";

import { SliderFormModal } from "@/components/modals/store/slider-form";
import { useMirror } from "../store";

const Modals = () => {
  const activeModal = useMirror("activeModal");
  const setActiveModal = useMirror("setActiveModal");
  const selectedSlider = useMirror("selectedSlider");

  const close = () => setActiveModal(null);

  return (
    <SliderFormModal
      isOpen={activeModal === "create" || activeModal === "edit"}
      onClose={close}
      slider={activeModal === "edit" ? selectedSlider : null}
    />
  );
};

export { Modals };
