"use client";

import { useMirror } from "../store";
import { ExpansionTable } from "./expansion-table";
import { NormalTable } from "./normal-table";

const Factory = () => {
  const type = useMirror("type");
  switch (type) {
    case "normal":
      return <NormalTable />;
    case "expansion":
      return <ExpansionTable />;
  }
};
export { Factory };
