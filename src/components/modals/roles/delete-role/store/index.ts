import { mirrorFactory } from "@/hooks/use-mirror-factory";
import { apiStore } from "./api";
import { initStore } from "./init";
import { stateStore } from "./state";

const { useMirror, useMirrorRegistry } = mirrorFactory({
  ...initStore(),
  ...stateStore(),
  ...apiStore(),
});

export { useMirror, useMirrorRegistry };
