"use client";

import { useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { availabilitiesClient } from "@/modules/appointments";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import type { CreateAvailabilityRequest, UpdateAvailabilityRequest } from "../types";
import { useMirrorRegistry } from "../store";

/**
 * Registers create, update, and delete mutations for availabilities.
 */
const AvailabilityMutations = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const invalidateAvailabilities = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin-availabilities"] });
    await queryClient.invalidateQueries({ queryKey: ["availabilities"] });
    await queryClient.invalidateQueries({ queryKey: ["appointment-day-availability"] });
  };

  const createMutation = useManagedMutation({
    mutationFn: async (payload: CreateAvailabilityRequest) => availabilitiesClient.create(payload),
    onSuccess: invalidateAvailabilities,
  });

  const updateMutation = useManagedMutation({
    mutationFn: async (payload: UpdateAvailabilityRequest) =>
      availabilitiesClient.update(payload.id, payload),
    onSuccess: invalidateAvailabilities,
  });

  const deleteMutation = useManagedMutation({
    mutationFn: async (id: number) => {
      await availabilitiesClient.delete(id);
    },
    onSuccess: invalidateAvailabilities,
  });

  useMirrorRegistry("createAvailability", async (payload: CreateAvailabilityRequest) =>
    createMutation.mutateAsync(payload),
  );
  useMirrorRegistry("updateAvailability", async (payload: UpdateAvailabilityRequest) =>
    updateMutation.mutateAsync(payload),
  );
  useMirrorRegistry("deleteAvailability", async (id: number) => deleteMutation.mutateAsync(id));

  return <MutationErrorProvider>{children}</MutationErrorProvider>;
};

export { AvailabilityMutations };
