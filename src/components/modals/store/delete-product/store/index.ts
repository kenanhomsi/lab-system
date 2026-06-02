import { mirrorFactory } from "@/hooks/use-mirror-factory";
import { initStore } from "./init";
import { stateStore } from "./state";

const { useMirror, useMirrorRegistry } = mirrorFactory({
  ...initStore(),
  ...stateStore(),
});

export { useMirror, useMirrorRegistry };
