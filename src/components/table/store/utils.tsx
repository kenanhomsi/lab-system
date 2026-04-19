import { DropResult } from "@hello-pangea/dnd";

type Params = {
  onDragEnd: (result: DropResult) => void;
};
const store = (): Params => {
  return {
    onDragEnd: () => {},
  };
};

export { store as utilsStore };
