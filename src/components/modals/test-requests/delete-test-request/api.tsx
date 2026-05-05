"use client";
import { frontendContainer } from "@/container";
import { DeleteTestRequestCommand, testRequestModuleNames } from "@/modules/TestRequests";
import { useMutation } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";
const command = frontendContainer.get<DeleteTestRequestCommand>(testRequestModuleNames.deleteTestRequestCommand);
const Api = ({children}: PropsWithChildren) => { const mutation=useMutation({mutationFn:async(id:string)=>{command.init({id}); return command.exec();}}); useMirrorRegistry("submitAction",mutation.mutateAsync); return <>{children}</>;};
export { Api };
