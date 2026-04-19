/**
 * Mirror factory store for appointments page
 * Provides centralized state management using Zustand + mirror pattern
 */

import { mirrorFactory } from "@/hooks/use-mirror-factory";
import { initStore } from "./init";

const { useMirror, useMirrorRegistry } = mirrorFactory({
  ...initStore(),
});

export { useMirror, useMirrorRegistry };
