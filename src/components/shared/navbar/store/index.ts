import { mirrorFactory } from "@/hooks/use-mirror-factory";
import { initStore } from "./init";

const { useMirror, useMirrorRegistry } = mirrorFactory({
  ...initStore(),
});

export { useMirror, useMirrorRegistry };
