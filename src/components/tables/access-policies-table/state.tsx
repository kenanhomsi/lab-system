"use client";

import { PropsWithChildren, useState } from "react";
import {
  AccessPolicyModalType,
  AccessPolicyTableItem,
  CreateAccessPolicyRequest,
} from "./types";
import { useMirrorRegistry } from "./store";

const State = ({ children }: PropsWithChildren) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [activeModal, setActiveModal] = useState<AccessPolicyModalType>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<AccessPolicyTableItem | null>(null);

  const [createDraft, setCreateDraft] = useState<Partial<CreateAccessPolicyRequest> | null>(
    null,
  );

  useMirrorRegistry("pageNumber", pageNumber);
  useMirrorRegistry("setPageNumber", setPageNumber);
  useMirrorRegistry("activeModal", activeModal);
  useMirrorRegistry("setActiveModal", setActiveModal);
  useMirrorRegistry("selectedPolicy", selectedPolicy);
  useMirrorRegistry("setSelectedPolicy", setSelectedPolicy);
  useMirrorRegistry("createDraft", createDraft);
  useMirrorRegistry("setCreateDraft", setCreateDraft);

  return <>{children}</>;
};

export { State };
