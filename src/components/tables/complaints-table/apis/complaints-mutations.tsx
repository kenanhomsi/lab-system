"use client";

import { frontendContainer } from "@/container";
import {
  ComplaintFrontendService,
  complaintModuleNames,
} from "@/modules/complaint";
import { EventService, eventModuleNames } from "@/modules/events";
import { useQueryClient } from "@tanstack/react-query";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";
import { ComplaintStatus } from "../types";

const complaintService = frontendContainer.get<ComplaintFrontendService>(
  complaintModuleNames.service,
);
const eventService = frontendContainer.get<EventService>(eventModuleNames.service);

const ComplaintsMutations = (props: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const updateComplaintStatusMutation = useManagedMutation({
    mutationFn: ({ id, status }: { id: number; status: ComplaintStatus }) =>
      complaintService.updateStatus({
        id: String(id),
        status,
      }),
    onSuccess: async () => {
      eventService.emit("complaintStatusUpdatedSuccessfully", undefined);
      await queryClient.invalidateQueries({ queryKey: ["complaints"] });
    },
  });

  useMirrorRegistry("updateComplaintStatus", async (id: number, status: ComplaintStatus) =>
    updateComplaintStatusMutation.mutateAsync({ id, status }),
  );

  return <MutationErrorProvider>{props.children}</MutationErrorProvider>;
};

export { ComplaintsMutations };
