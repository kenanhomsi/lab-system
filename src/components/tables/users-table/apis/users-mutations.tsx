"use client";

import { frontendContainer } from "@/container";
import {
  ActivateUserCommand,
  DeactivateUserCommand,
  DeleteUserCommand,
  userModuleNames,
} from "@/modules/user";
import { useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";

const activateUserCommand = frontendContainer.get<ActivateUserCommand>(
  userModuleNames.activateUserCommand,
);

const deactivateUserCommand = frontendContainer.get<DeactivateUserCommand>(
  userModuleNames.deactivateUserCommand,
);

const deleteUserCommand = frontendContainer.get<DeleteUserCommand>(
  userModuleNames.deleteUserCommand,
);

const UsersMutations = (props: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const activateUser = async (id: string) => {
    activateUserCommand.init({ id });
    const result = await activateUserCommand.exec();
    await queryClient.invalidateQueries({ queryKey: ["users"] });
    return result;
  };

  const deactivateUser = async (id: string) => {
    deactivateUserCommand.init({ id });
    const result = await deactivateUserCommand.exec();
    await queryClient.invalidateQueries({ queryKey: ["users"] });
    return result;
  };

  const deleteUser = async (id: string) => {
    deleteUserCommand.init({ id });
    const result = await deleteUserCommand.exec();
    await queryClient.invalidateQueries({ queryKey: ["users"] });
    return result;
  };

  useMirrorRegistry("activateUser", activateUser);
  useMirrorRegistry("deactivateUser", deactivateUser);
  useMirrorRegistry("deleteUser", deleteUser);

  return props;
};

export { UsersMutations };
