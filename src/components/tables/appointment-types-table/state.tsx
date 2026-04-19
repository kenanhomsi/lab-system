"use client";

import { PropsWithChildren, useState } from "react";
import { AppointmentTypeItem, AppointmentTypeModalType } from "./types";
import { useMirrorRegistry } from "./store";

const State = ({ children }: PropsWithChildren) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [activeModal, setActiveModal] = useState<AppointmentTypeModalType>(null);
  const [selectedType, setSelectedType] = useState<AppointmentTypeItem | null>(null);

  useMirrorRegistry("pageNumber", pageNumber);
  useMirrorRegistry("setPageNumber", setPageNumber);
  useMirrorRegistry("activeModal", activeModal);
  useMirrorRegistry("setActiveModal", setActiveModal);
  useMirrorRegistry("selectedType", selectedType);
  useMirrorRegistry("setSelectedType", setSelectedType);

  return <>{children}</>;
};

export { State };
