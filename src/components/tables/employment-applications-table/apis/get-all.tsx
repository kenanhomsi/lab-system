"use client";

import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren, useMemo } from "react";
import { axiosInstanceFront } from "@/lib/clients/frontend-instance";
import { useMirror, useMirrorRegistry } from "../store";
import { EmploymentApplicationsResponse } from "../types";

const PAGE_SIZE = 20;

const emptyPayload: EmploymentApplicationsResponse = {
  items: [],
  page: 1,
  pageSize: PAGE_SIZE,
  totalCount: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

const GetAllEmploymentApplications = (props: PropsWithChildren) => {
  const pageNumber = useMirror("pageNumber");
  const debouncedValue = useMirror("debouncedValue");
  const statusFilter = useMirror("statusFilter");

  const { data, isPending, refetch } = useQuery({
    queryKey: ["employment-applications", pageNumber, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: pageNumber.toString(),
        pageSize: PAGE_SIZE.toString(),
      });

      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }

      const res = await axiosInstanceFront.get(`/employment-applications?${params.toString()}`);
      return (res.data?.data || res.data) as EmploymentApplicationsResponse;
    },
  });

  const applicationsData = useMemo(() => {
    const payload = data ?? emptyPayload;
    const search = debouncedValue.trim().toLowerCase();
    if (!search) {
      return payload;
    }

    const items = (payload.items ?? []).filter((item) => {
      const haystack = [
        item.fullName,
        item.email,
        item.mobileNumber,
        item.academicDegree,
        item.skills,
        item.previousExperience,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(search);
    });

    return {
      ...payload,
      items,
    };
  }, [data, debouncedValue]);

  useMirrorRegistry("applicationsData", applicationsData);
  useMirrorRegistry("isPending", isPending);
  useMirrorRegistry("refetchApplications", () => {
    void refetch();
  });

  return props;
};

export { GetAllEmploymentApplications };
