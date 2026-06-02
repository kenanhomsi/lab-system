"use client";

import { CategoryFormModal, DeleteCategoryModal } from "@/components/modals/store";
import { useMirror } from "../store";

const Modals = () => {
  const activeModal = useMirror("activeModal");
  const setActiveModal = useMirror("setActiveModal");
  const selectedCategory = useMirror("selectedCategory");

  const close = () => setActiveModal(null);

  return (
    <>
      <CategoryFormModal
        isOpen={activeModal === "create" || activeModal === "edit"}
        onClose={close}
        category={activeModal === "edit" ? selectedCategory : null}
      />
      <DeleteCategoryModal
        isOpen={activeModal === "delete"}
        onClose={close}
        category={selectedCategory}
      />
    </>
  );
};

export { Modals };
