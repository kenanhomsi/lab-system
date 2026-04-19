/**
 * Appointment Details Modal - Store
 * Provides centralized state management using mirror factory
 */

import { mirrorFactory } from "@/hooks/use-mirror-factory";

const { useMirror, useMirrorRegistry } = mirrorFactory({
  isOpen: false,
  onClose: () => {},
  appointmentId: "",
  onSuccess: () => {},
});

export { useMirror, useMirrorRegistry };
