"use client";

import {
  CreateTestRequestModal,
  DeleteTestRequestModal,
  EditTestRequestModal,
} from "@/components/modals/test-requests";
import { BookBloodDrawModal } from "@/components/features/appointments";
import { useMirror } from "../store";

const Modals = () => {
  const activeModal = useMirror("activeModal");
  const selectedTestRequest = useMirror("selectedTestRequest");
  const setActiveModal = useMirror("setActiveModal");

  const closeModal = () => setActiveModal(null);

  return (
    <>
      <CreateTestRequestModal opened={activeModal === "create"} onClose={closeModal} />
      <EditTestRequestModal
        opened={activeModal === "edit"}
        onClose={closeModal}
        testRequest={selectedTestRequest}
      />
      <DeleteTestRequestModal
        opened={activeModal === "delete"}
        onClose={closeModal}
        testRequest={selectedTestRequest}
      />
      <BookBloodDrawModal
        opened={activeModal === "appointment"}
        onClose={closeModal}
        testRequest={selectedTestRequest}
      />
    </>
  );
};

export { Modals };
