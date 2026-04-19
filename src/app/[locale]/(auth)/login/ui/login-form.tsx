"use client";

import {
  Button,
  Checkbox,
  Divider,
  Input,
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
  const emailProps = getInputProps("email", { withError: false });
  const passwordProps = getInputProps("password", { withError: false });

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
            {...emailProps}
          />
          <Input.Error ms={"sm"}>
            {getInputProps("email")?.error}
          </Input.Error>
          <PasswordInput
            variant="filled"
            placeholder={t("password")}
            name="password"
            autoComplete="current-password"
            leftSection={<IconLock size={24} />}
            w="100%"
            {...passwordProps}
          />
          <Input.Error ms={"sm"}>
            {getInputProps("password")?.error}
          </Input.Error>
        </div>

        <div className={styles.forgotRow}>
          <Checkbox label={t("rememberMe")} variant="outline" />
          <Link href={`/${locale}/forgot-password`}>
            <Button type="button" variant="transparent" className={styles.forgotButton}>
              {t("forgotPassword")}
            </Button>
          </Link>
        </div>

        <Button type="submit" loading={loading} fullWidth radius="md">
          {loading ? t("signingIn") : t("signIn")}
        </Button>

        <Divider label={t("orContinueWith")} labelPosition="center" w="100%" />

        <Button
          variant="default"
          fullWidth
          radius="md"
          disabled
          leftSection={<IconBrandGoogle size={16} />}
          onClick={handleGoogleSignIn}
        >
          {t("signInWithGoogle")}
        </Button>
      </div>
    </form>
  );
}
