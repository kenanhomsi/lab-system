import { mirrorFactory } from "@/hooks/use-mirror-factory";
import { apiStore } from "./api";
import { initStore } from "./init";
import { stateStore } from "./state";

const { useMirror, useMirrorRegistry } = mirrorFactory({
  ...stateStore(),
  ...apiStore(),
  ...initStore(),
});

export { useMirror, useMirrorRegistry };
