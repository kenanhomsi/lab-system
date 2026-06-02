import { mirrorFactory } from "@/hooks/use-mirror-factory";
import { apiStore } from "./api";
import { initStore } from "./init";
import { stateStore } from "./state";
import { utilsStore } from "./utils";

const { useMirror, useMirrorRegistry } = mirrorFactory({
  ...initStore(),
  ...stateStore(),
  ...apiStore(),
  ...utilsStore(),
});

export { useMirror, useMirrorRegistry };
