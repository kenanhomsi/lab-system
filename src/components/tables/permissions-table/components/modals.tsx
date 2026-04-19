"use client";

import {
  DeletePermissionModal,
  PermissionFormModal,
} from "@/components/modals/permissions";
import { useMirror } from "../store";

const Modals = () => {
  const activeModal = useMirror("activeModal");
  const setActiveModal = useMirror("setActiveModal");
  const selectedPermission = useMirror("selectedPermission");
  const setSelectedPermission = useMirror("setSelectedPermission");

  const close = () => {
    setActiveModal(null);
    setSelectedPermission(null);
  };

  return (
    <>
      <PermissionFormModal
        isOpen={activeModal === "create" || activeModal === "edit"}
        onClose={close}
        permission={activeModal === "edit" ? selectedPermission : null}
      />
      <DeletePermissionModal
        isOpen={activeModal === "delete"}
        onClose={close}
        permission={selectedPermission}
      />
    </>
  );
};

export { Modals };
