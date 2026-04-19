"use client";

import type { PropsWithChildren } from "react";
import { Fragment, useCallback, useEffect } from "react";
import { useMirror, useMirrorRegistry } from "./store";
import { useLocale, useTranslations } from "next-intl";
import { loginValidationSchema } from "./validation-schema";
import { ValidationError } from "@/modules/errors";
import { frontendContainer } from "@/container";
import { validationModuleNames, Validator } from "@/modules/validation";
import { signIn } from "next-auth/react";
import { roleRedirects } from "./utils/constants";

const validationService = frontendContainer.get<Validator>(
  validationModuleNames.validator,
);
/** Side-effect helpers for the login route (keyboard shortcuts, etc.). */
const Utils = (props: PropsWithChildren) => {
  const { children } = props;
  const setShowAdmin = useMirror("setShowAdmin");
  const setSelectedRole = useMirror("setSelectedRole");

  const handleAdminShortcut = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault();
        setShowAdmin((prev: boolean) => {
          const next = !prev;
          if (!next) setSelectedRole("patient");
          else setSelectedRole("admin");
          return next;
        });
      }
    },
    [setShowAdmin, setSelectedRole],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleAdminShortcut);
    return () => window.removeEventListener("keydown", handleAdminShortcut);
  }, [handleAdminShortcut]);
  const values = useMirror("values");
  const setErrors = useMirror("setErrors");
  const performLogin = useMirror("preformLogin");
  const t = useTranslations("auth");
  const _onSubmit = useMirror("onSubmit");
  const locale = useLocale();
  const selectedRole = useMirror("selectedRole");
  const handleGoogleSignIn = useCallback(() => {
    void signIn("google", {
      callbackUrl: `/${locale}${roleRedirects[selectedRole]}`,
    });
  }, [locale, selectedRole]);

  useMirrorRegistry("handleGoogleSignIn", handleGoogleSignIn);
  useMirrorRegistry(
    "login",
    _onSubmit
      ? _onSubmit(async () => {
        setErrors({});
        try {
          validationService.validate({
            data: values,
            schema: loginValidationSchema({ t }),
          });

          await performLogin();
        } catch (e) {
          if (e instanceof ValidationError) {
            const errors = e.getErrors();
            const final = errors.reduce((pre, curr) => {
              pre = { ...pre, [curr.name]: curr.message };
              return pre;
            }, {});
            setErrors(final);
            return;
          }

          setErrors({ password: t("loginError") });
        }
      })
      : () => console.error("onSubmit not ready yet"),
  );
  return <Fragment>{children}</Fragment>;
};

export default Utils;
