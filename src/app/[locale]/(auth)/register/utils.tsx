"use client";

import type { FormEvent } from "react";
import { PropsWithChildren, useCallback } from "react";
import { extractErrorMessage } from "@/lib/error";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { frontendContainer } from "@/container";
import { authModuleNames } from "@/modules/auth";
import { AuthFrontendService } from "@/modules/auth/frontend/service";
import { ValidationError } from "@/modules/errors";
import { validationModuleNames, Validator } from "@/modules/validation";
import { useMirror, useMirrorRegistry } from "./store";
import { registerValidationSchema } from "./validation-schema/register";

const authService = frontendContainer.get<AuthFrontendService>(
  authModuleNames.service,
);
const validationService = frontendContainer.get<Validator>(
  validationModuleNames.validator,
);

const Utils = (props: PropsWithChildren) => {
  const { children } = props;

  const setLoading = useMirror("setLoading");
  const setError = useMirror("setError");
  const setSuccess = useMirror("setSuccess");
  const setSuccessMessage = useMirror("setSuccessMessage");
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
        role: "patient" as const,
        email: formData.get("email") as string,
        mobile: formData.get("mobile") as string,
        fullName: formData.get("fullName") as string,
        city: formData.get("city") as string,
        password: formData.get("password") as string,
        age: Number(formData.get("age")),
        gender: formData.get("gender") as string,
      };

      const confirmPassword = formData.get("confirmPassword") as string;
      if (payload.password !== confirmPassword) {
        setError(t("passwordMismatch"));
        setLoading(false);
        return;
      }

      try {
        validationService.validate({
          data: payload,
          schema: registerValidationSchema(),
        });

        const res = await authService.Register({
          email: payload.email,
          password: payload.password,
          fullName: payload.fullName,
          city: payload.city,
          phoneNumber: payload.mobile,
          role: payload.role,
        });

        const apiMessage =
          typeof res?.message === "string" && res.message.trim().length > 0
            ? res.message.trim()
            : "";
        setSuccessMessage(apiMessage);
        setSuccess(true);
        setTimeout(() => router.push(`/${locale}/login`), 3000);
      } catch (err: unknown) {
        if (err instanceof ValidationError) {
          const errors = err.getErrors();
          setError(errors[0]?.message ?? t("registerError"));
        } else {
          setError(extractErrorMessage(err, t("registerError")));
        }
      } finally {
        setLoading(false);
      }
    },
    [locale, router, setError, setLoading, setSuccess, setSuccessMessage, t],
  );

  useMirrorRegistry("submitRegisterForm", submitRegisterForm);

  return <>{children}</>;
};

export default Utils;
