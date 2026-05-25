"use client";

import {
  DeleteRoleModal,
  RoleFormModal,
} from "@/components/modals/roles";
import { useMirror } from "../store";
import { RolePermissionsModal } from "./role-permissions-modal";

const Modals = () => {
  const activeModal = useMirror("activeModal");
  const setActiveModal = useMirror("setActiveModal");
  const selectedRole = useMirror("selectedRole");
  const setSelectedRole = useMirror("setSelectedRole");

  const close = () => {
    setActiveModal(null);
    setSelectedRole(null);
  };

  return (
    <>
      <RoleFormModal
        isOpen={activeModal === "create" || activeModal === "edit"}
        onClose={close}
        role={activeModal === "edit" ? selectedRole : null}
      />
      <DeleteRoleModal
        isOpen={activeModal === "delete"}
        onClose={close}
        role={selectedRole}
      />
      <RolePermissionsModal
        opened={activeModal === "permissions"}
        onClose={close}
        role={selectedRole}
      />
    </>
  );
};

export { Modals };
