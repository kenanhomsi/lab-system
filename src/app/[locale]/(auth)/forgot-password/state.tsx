"use client";

import { PropsWithChildren, useState } from "react";
import { useMirrorRegistry } from "./store";
import { Step } from "./store/state";

const State = (props: PropsWithChildren) => {
  const { children } = props;

  const [step, setStep] = useState<Step>("identifier");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useMirrorRegistry("step", step);
  useMirrorRegistry("setStep", setStep);
  useMirrorRegistry("email", email);
  useMirrorRegistry("setEmail", setEmail);
  useMirrorRegistry("token", token);
  useMirrorRegistry("setToken", setToken);
  useMirrorRegistry("newPassword", newPassword);
  useMirrorRegistry("setNewPassword", setNewPassword);
  useMirrorRegistry("confirmPassword", confirmPassword);
  useMirrorRegistry("setConfirmPassword", setConfirmPassword);
  useMirrorRegistry("loading", loading);
  useMirrorRegistry("setLoading", setLoading);
  useMirrorRegistry("error", error);
  useMirrorRegistry("setError", setError);
  useMirrorRegistry("success", success);
  useMirrorRegistry("setSuccess", setSuccess);

  return <>{children}</>;
};

export default State;
