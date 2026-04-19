import { mirrorFactory } from "@/hooks/use-mirror-factory";
import { apiStore } from "./api";
import { stateStore } from "./state";

const { useMirror, useMirrorRegistry } = mirrorFactory({
  ...apiStore(),
  ...stateStore(),
});

export { useMirror, useMirrorRegistry };

