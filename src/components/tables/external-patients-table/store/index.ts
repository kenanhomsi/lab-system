import { mirrorFactory } from "@/hooks/use-mirror-factory";
import { apiStore } from "./api";
import { schemaStore } from "./schema";
import { stateStore } from "./state";

const { useMirror, useMirrorRegistry } = mirrorFactory({
  ...stateStore(),
  ...schemaStore(),
  ...apiStore(),
});

export { useMirror, useMirrorRegistry };
