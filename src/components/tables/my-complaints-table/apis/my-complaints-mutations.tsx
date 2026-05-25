"use client";

import { useQueryClient } from "@tanstack/react-query";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import { PropsWithChildren } from "react";
import { frontendContainer } from "@/container";
import {
  ComplaintFrontendService,
  complaintModuleNames,
} from "@/modules/complaint";
import { useMirrorRegistry } from "../store";
import { CreateComplaintPayload } from "../types";

const complaintService = frontendContainer.get<ComplaintFrontendService>(
  complaintModuleNames.service,
);

const MyComplaintsMutations = (props: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const createMutation = useManagedMutation({
    mutationFn: (payload: CreateComplaintPayload) =>
      complaintService.createMine({
        title: payload.title,
        description: payload.description,
        attachment: payload.attachment,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["my-complaints"] });
    },
  });

  useMirrorRegistry("createComplaint", async (payload: CreateComplaintPayload) =>
    createMutation.mutateAsync(payload),
  );
  useMirrorRegistry("isCreating", createMutation.isPending);

  return <MutationErrorProvider>{props.children}</MutationErrorProvider>;
};

export { MyComplaintsMutations };
