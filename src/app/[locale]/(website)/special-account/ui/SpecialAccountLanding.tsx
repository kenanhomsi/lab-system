"use client";

import { Link } from "@/i18n/navigation";
import { Button, Card, Stack, Text, Title } from "@mantine/core";
import { useTranslations } from "next-intl";

/**
 * Public landing for the private special account — login or go back.
 */
export function SpecialAccountLanding() {
  const t = useTranslations("specialPages.landing");

  return (
    <Stack align="center" justify="center" mih="60vh" p="xl">
      <Card withBorder padding="xl" maw={520} w="100%" radius="md">
        <Stack gap="md" align="center">
          <Title order={2} ta="center">
            {t("title")}
          </Title>
          <Text c="dimmed" ta="center">
            {t("description")}
          </Text>
          <Text size="sm" ta="center">
            {t("activationNote")}
          </Text>
          <Stack gap="sm" w="100%" mt="md">
            <Button
              component={Link}
              href="/login?callbackUrl=/special/daily-tasks"
              fullWidth
            >
              {t("login")}
            </Button>
            <Button component={Link} href="/" variant="default" fullWidth>
              {t("goBack")}
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}
