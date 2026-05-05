"use client";

import {
  CreateTestResultModal,
  DeleteTestResultModal,
  EditTestResultModal,
} from "@/components/modals/test-results";
import { useMirror } from "../store";

const Modals = () => {
  const activeModal = useMirror("activeModal");
  const selectedTestResult = useMirror("selectedTestResult");
  const setActiveModal = useMirror("setActiveModal");

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
    </>
  );
};

export { Modals };
