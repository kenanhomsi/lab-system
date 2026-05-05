"use client";

import { PropsWithChildren, useCallback } from "react";
import type { FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMirror, useMirrorRegistry } from "./store";

const Utils = (props: PropsWithChildren) => {
  const { children } = props;

  const selectedRole = useMirror("selectedRole");
  const setLoading = useMirror("setLoading");
  const setError = useMirror("setError");
  const setSuccess = useMirror("setSuccess");
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("auth");

  const submitRegisterForm = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      const formData = new FormData(e.currentTarget);
      const payload = {
        role: selectedRole,
        email: formData.get("email") as string,
        mobile: formData.get("mobile") as string,
        fullName: formData.get("fullName") as string,
        city: formData.get("city") as string,
        password: formData.get("password") as string,
        ...(selectedRole === "patient" && {
          age: Number(formData.get("age")),
          gender: formData.get("gender") as string,
        }),
        ...(selectedRole === "doctor" && {
          specialty: formData.get("specialty") as string,
        }),
        ...(selectedRole === "LabPartner" && {
          labName: formData.get("labName") as string,
        }),
      };

      const confirmPassword = formData.get("confirmPassword") as string;
      if (payload.password !== confirmPassword) {
        setError(t("passwordMismatch"));
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || t("registerError"));
          return;
        }

        setSuccess(true);
        setTimeout(() => router.push(`/${locale}/login`), 2000);
      } catch {
        setError(t("registerError"));
      } finally {
        setLoading(false);
      }
    },
    [locale, router, selectedRole, setError, setLoading, setSuccess, t],
  );

  useMirrorRegistry("submitRegisterForm", submitRegisterForm);

  return <>{children}</>;
};

export default Utils;
