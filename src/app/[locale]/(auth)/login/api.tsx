"use client";
import { frontendContainer } from "@/container";
import { authModuleNames, LoginCommand } from "@/modules/auth";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import { PropsWithChildren } from "react";
import { useMirror, useMirrorRegistry } from "./store";
const loginCommand = frontendContainer.get<LoginCommand>(
    authModuleNames.loginCommand,
);
const Api = (props: PropsWithChildren) => {
    const { children } = props;
    const values = useMirror("values");
    const { isPending, mutateAsync } = useManagedMutation({
        mutationFn: () => {
            loginCommand.init(values);
            return loginCommand.exec();
        },
    });
    useMirrorRegistry("loading", isPending);
    useMirrorRegistry("preformLogin", mutateAsync);
    return <MutationErrorProvider>{children}</MutationErrorProvider>;
};
export { Api };
