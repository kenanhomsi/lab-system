"use client";

import type { UserRole } from "@/types/user";
import { useSearchParams } from "next/navigation";
import type { PropsWithChildren } from "react";
import { useState } from "react";
import { useMirrorRegistry } from "./store";
import { useForm } from "@mantine/form";
import { FormValues } from "./store/state";

const State = (props: PropsWithChildren) => {
    const { children } = props;
    const searchParams = useSearchParams();
    const isAdminPortal = searchParams.get("portal") === "admin";
    const [showAdmin, setShowAdmin] = useState(isAdminPortal);
    const [selectedRole, setSelectedRole] = useState<UserRole>(
        isAdminPortal ? "admin" : "patient",
    );
    const { getInputProps, setErrors, values, onSubmit, setFieldValue } =
        useForm<FormValues>({
            initialValues: {
                email: "",
                password: "",
            },
        });
    useMirrorRegistry("setFieldValue", setFieldValue);
    useMirrorRegistry("getInputProps", getInputProps);
    useMirrorRegistry("setErrors", setErrors);
    useMirrorRegistry("values", values);
    useMirrorRegistry("onSubmit", onSubmit);
    useMirrorRegistry("showAdmin", showAdmin);
    useMirrorRegistry("setShowAdmin", setShowAdmin);
    useMirrorRegistry("selectedRole", selectedRole);
    useMirrorRegistry("setSelectedRole", setSelectedRole);

    return <>{children}</>;
};

export default State;
