"use client";

import { frontendContainer } from "@/container";
import {
  appointmentTypeModuleNames,
  AppointmentTypeFrontendService,
} from "@/modules/appointment-type";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirror, useMirrorRegistry } from "../store";
import { AppointmentTypesResponse } from "../types";

const appointmentTypeService = frontendContainer.get<AppointmentTypeFrontendService>(
  appointmentTypeModuleNames.service,
);

async function getAllAppointmentTypes(params: {
  pageNumber: number;
}): Promise<AppointmentTypesResponse> {
  const query: Record<string, string> = {
    Page: String(params.pageNumber),
    PageSize: "20",
  };
  const payload = await appointmentTypeService.findAll({ query });
  if (!payload) {
    throw new Error("Failed to fetch appointment types");
  }
  return payload;
}

const GetAllAppointmentTypes = (props: PropsWithChildren) => {
  const pageNumber = useMirror("pageNumber");

  const { data, isPending, refetch } = useQuery({
    queryKey: ["admin-appointment-types", pageNumber],
    queryFn: () => getAllAppointmentTypes({ pageNumber }),
    refetchInterval: 1000 * 60,
  });

  useMirrorRegistry("typesData", data ?? []);
  useMirrorRegistry("isPending", isPending);
  useMirrorRegistry("refetchAppointmentTypes", () => {
    void refetch();
  });

  return props;
};

export { GetAllAppointmentTypes };
