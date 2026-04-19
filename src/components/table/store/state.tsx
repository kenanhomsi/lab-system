import { ReactNode } from "react";

type Params = {
  headerComp: ReactNode;
  ContentComp: (recordId: string) => ReactNode;
};
const store = (): Params => {
  return {
    headerComp: <></>,
    ContentComp: () => <></>,
  };
};

export { store as stateStore };
