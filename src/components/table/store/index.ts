import { mirrorFactory } from "@/hooks/use-mirror-factory";
import { initStore } from "./init";
import { stateStore } from "./state";
import { utilsStore } from "./utils";

const { useMirror, useMirrorRegistry } = mirrorFactory({
  ...initStore(),
  ...stateStore(),
  ...utilsStore(),
});

export { useMirror, useMirrorRegistry };
