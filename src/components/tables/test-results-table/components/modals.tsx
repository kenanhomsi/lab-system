"use client";

import {
  CreateTestResultModal,
  DeleteTestResultModal,
  EditTestResultModal,
} from "@/components/modals/test-results";
import { ViewTestResultModal } from "./view-test-result-modal";
import { isClinicalPatientUser } from "@/components/modals/test-requests/party-ids";
import { useSessionUserStore } from "@/stores/session-user-store";
import { useMirror } from "../store";

const Modals = () => {
  const roles = useSessionUserStore((s) => s.user?.roles);
  const activeModal = useMirror("activeModal");
  const selectedTestResult = useMirror("selectedTestResult");
  const setActiveModal = useMirror("setActiveModal");

  if (isClinicalPatientUser(roles) && activeModal !== "view") {
    return null;
  }

  const closeModal = () => setActiveModal(null);

  return (
    <>
      <CreateTestResultModal opened={activeModal === "create"} onClose={closeModal} />
      <EditTestResultModal
        opened={activeModal === "edit"}
        onClose={closeModal}
        testResult={selectedTestResult}
      />
      <DeleteTestResultModal
        opened={activeModal === "delete"}
        onClose={closeModal}
        testResult={selectedTestResult}
      />
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
