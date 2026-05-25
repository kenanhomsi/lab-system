"use client";

import {
  CreateUserModal,
  DeleteUserModal,
  EditUserModal,
  PermissionsModal,
  RolesModal,
  UserDetailModal,
} from "@/components/modals/users";
import { useMirror } from "../store";

const Modals = () => {
  const activeModal = useMirror("activeModal");
  const setActiveModal = useMirror("setActiveModal");
  const selectedUser = useMirror("selectedUser");

  const close = () => setActiveModal(null);

  return (
    <>
      <CreateUserModal isOpen={activeModal === "create"} onClose={close} />
      <UserDetailModal
        isOpen={activeModal === "view"}
        onClose={close}
        user={selectedUser}
      />
      <EditUserModal
        isOpen={activeModal === "edit"}
        onClose={close}
        user={selectedUser}
      />
      <DeleteUserModal
        isOpen={activeModal === "delete"}
        onClose={close}
        user={selectedUser}
      />
      <RolesModal isOpen={activeModal === "roles"} onClose={close} user={selectedUser} />
      <PermissionsModal
        isOpen={activeModal === "permissions"}
        onClose={close}
        user={selectedUser}
      />
    </>
  );
};

export { Modals };
