"use client";
import { frontendContainer } from "@/container";
import { authModuleNames, LoginCommand } from "@/modules/auth";
import { useMutation } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirror, useMirrorRegistry } from "./store";
const loginCommand = frontendContainer.get<LoginCommand>(
    authModuleNames.loginCommand,
);
const Api = (props: PropsWithChildren) => {
    const { children } = props;
    const values = useMirror("values");
    const { isPending, mutateAsync } = useMutation({
        mutationFn: () => {
            loginCommand.init(values);
            return loginCommand.exec();
        },
    });
    useMirrorRegistry("loading", isPending);
    useMirrorRegistry("preformLogin", mutateAsync);
    return <>{children}</>;
};
export { Api };
