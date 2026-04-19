import { mirrorFactory } from "@/hooks/use-mirror-factory";
import { StateStore } from "./state";

const { useMirror, useMirrorRegistry } = mirrorFactory({
  ...StateStore(),
});

export { useMirror, useMirrorRegistry };
