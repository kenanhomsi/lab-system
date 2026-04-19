import { mirrorFactory } from "@/hooks/use-mirror-factory";
import { StateStore } from "./state";
import { apiStore } from "./api";
import { utilsStore } from "./utils";

const { useMirror, useMirrorRegistry } = mirrorFactory({
  ...StateStore(),
  ...apiStore(),
  ...utilsStore()
});

export { useMirror, useMirrorRegistry };

