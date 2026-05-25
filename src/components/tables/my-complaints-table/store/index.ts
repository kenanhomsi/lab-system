import { mirrorFactory } from "@/hooks/use-mirror-factory";
import { apiStore } from "./api";
import { schemaStore } from "./schema";
import { stateStore } from "./state";
import { utilsStore } from "./utils";

const { useMirror, useMirrorRegistry } = mirrorFactory({
  ...stateStore(),
  ...schemaStore(),
  ...apiStore(),
  ...utilsStore(),
});

export { useMirror, useMirrorRegistry };
