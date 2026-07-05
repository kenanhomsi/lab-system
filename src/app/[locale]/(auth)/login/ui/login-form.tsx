"use client";

import {
  Button,
  Checkbox,
  Divider,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import {
  IconAt,
  IconBrandGoogle,
  IconLock,
} from "@tabler/icons-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import styles from "../scss/login-form.module.scss";
import { useMirror } from "../store";

export function LoginForm() {
  const locale = useLocale();
  const handleGoogleSignIn = useMirror("handleGoogleSignIn");
  const getInputProps = useMirror("getInputProps");
  const t = useTranslations("auth");
  const login = useMirror("login");
  const loading = useMirror("loading");
  const emailProps = getInputProps("email");
  const passwordProps = getInputProps("password");

  return (
    <form className={styles.form} onSubmit={login}>
      <div className={styles.formBody}>
        <div className={styles.fieldsBlock}>
          <TextInput
            variant="filled"
            placeholder={t("identifierPlaceholder")}
            type="email"
            name="email"
            autoComplete="email"
            leftSection={<IconAt size={24} />}
            w="100%"
            error={emailProps.error}
            {...emailProps}
          />
          <PasswordInput
            variant="filled"
            placeholder={t("password")}
            name="password"
            autoComplete="current-password"
            leftSection={<IconLock size={24} />}
            w="100%"
            error={passwordProps.error}
            {...passwordProps}
          />
        </div>

        <div className={styles.forgotRow}>
          <Checkbox label={t("rememberMe")} variant="outline" color="#009cc2" />
          <Button
            component={Link}
            href={`/${locale}/forgot-password`}
            type="button"
            variant="transparent"
            className={styles.forgotButton}
          >
            {t("forgotPassword")}
          </Button>
        </div>

        <Button
          type="submit"
          loading={loading}
          fullWidth
          radius="md"
          color="#009cc2"
          className="bg-gradient-to-r from-[#009cc2] to-[#006a85] hover:opacity-90 transition-opacity"
        >
          {loading ? t("signingIn") : t("signIn")}
        </Button>

        <Divider label={t("orContinueWith")} labelPosition="center" w="100%" />

        <Button
          variant="default"
          fullWidth
          radius="md"
          leftSection={<IconBrandGoogle size={16} />}
          onClick={handleGoogleSignIn}
        >
          {t("signInWithGoogle")}
        </Button>
      </div>
    </form>
  );
}
