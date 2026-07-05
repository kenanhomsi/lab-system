"use client";

import {
  CreateTestResultModal,
  DeleteTestResultModal,
  EditTestResultModal,
} from "@/components/modals/test-results";
import { ViewTestResultModal } from "./view-test-result-modal";
import { isClinicalPatientUser } from "@/components/modals/test-requests/party-ids";
import { useSessionUserStore } from "@/stores/session-user-store";
import { getTestResultPermissions } from "../test-result-permissions";
import { useMirror } from "../store";

const Modals = () => {
  const roles = useSessionUserStore((s) => s.user?.roles);
  const permissions = useSessionUserStore((s) => s.user?.permissions);
  const activeModal = useMirror("activeModal");
  const selectedTestResult = useMirror("selectedTestResult");
  const setActiveModal = useMirror("setActiveModal");
  const { canCreate, canUpdate, canDelete } = getTestResultPermissions(
    roles,
    permissions,
  );

  if (isClinicalPatientUser(roles) && activeModal !== "view") {
    return null;
  }

  const closeModal = () => setActiveModal(null);

  return (
    <>
      {canCreate ? (
        <CreateTestResultModal opened={activeModal === "create"} onClose={closeModal} />
      ) : null}
      {canUpdate ? (
        <EditTestResultModal
          opened={activeModal === "edit"}
          onClose={closeModal}
          testResult={selectedTestResult}
        />
      ) : null}
      {canDelete ? (
        <DeleteTestResultModal
          opened={activeModal === "delete"}
          onClose={closeModal}
          testResult={selectedTestResult}
        />
      ) : null}
      {selectedTestResult && activeModal === "view" && (
        <ViewTestResultModal
          opened={true}
          onClose={closeModal}
          testResult={selectedTestResult}
        />
      )}
    </>
  );
};

export { Modals };
