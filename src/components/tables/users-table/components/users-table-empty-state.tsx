"use client";

import { Box } from "@mantine/core";
import { IconUsers } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import styles from "@/components/table/style.module.scss";

const UsersTableEmptyState = () => {
  const t = useTranslations("admin.users");
  return (
    <Box className={styles.emptyState} role="status" aria-live="polite">
      <Box className={styles.emptyStateIcon} aria-hidden>
        <IconUsers size={40} stroke={1.4} />
      </Box>
      <span className={styles.emptyStateTitle}>{t("tableEmptyTitle")}</span>
      <span className={styles.emptyStateHint}>{t("tableEmptyHint")}</span>
    </Box>
  );
};

export { UsersTableEmptyState };
