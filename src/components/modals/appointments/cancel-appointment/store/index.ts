import { mirrorFactory } from "@/hooks/use-mirror-factory";
import { apiStore } from "./api";
import { stateStore } from "./state";

const { useMirror, useMirrorRegistry } = mirrorFactory({
  ...stateStore(),
  ...apiStore(),
});

export { useMirror, useMirrorRegistry };
