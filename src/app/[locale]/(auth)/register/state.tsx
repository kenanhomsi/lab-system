"use client";

import { PropsWithChildren, useState } from "react";
import { useMirrorRegistry } from "./store";
import { RegisterRole } from "./store/state";

const State = (props: PropsWithChildren) => {
  const { children } = props;

  const [selectedRole, setSelectedRole] = useState<RegisterRole>("patient");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useMirrorRegistry("selectedRole", selectedRole);
  useMirrorRegistry("setSelectedRole", setSelectedRole);
  useMirrorRegistry("loading", loading);
  useMirrorRegistry("setLoading", setLoading);
  useMirrorRegistry("error", error);
  useMirrorRegistry("setError", setError);
  useMirrorRegistry("success", success);
  useMirrorRegistry("setSuccess", setSuccess);

  return <>{children}</>;
};

export default State;
