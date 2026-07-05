"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Button,
  Group,
  Loader,
  NavLink,
  Paper,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconMap, IconRefresh, IconWorldWww } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { CmsPageEditor } from "@/components/website-pages/cms-page-editor";
import {
  WEBSITE_BUILTIN_SURFACE_LIST,
  type BuiltinWebsiteSurface,
} from "@/lib/website-content-map/surfaces";
import type { PageListItemDto } from "@/types/website-page";
import { ContentMapActionHost } from "./content-map-action-host";
import {
  ContentMapActionsProvider,
} from "./content-map-actions-context";
import { PageWireframe } from "./page-wireframe";
import { SiteWideWireframe } from "./site-wide-wireframe";
import { useWebsiteContentData } from "./use-website-content-data";

type Selection =
  | { kind: "builtin"; surface: BuiltinWebsiteSurface }
  | { kind: "cms"; page: PageListItemDto }
  | { kind: "siteWide" };

function WebsiteContentMapPanelInner() {
  const t = useTranslations("admin.settings.contentMap");
  const tBanner = useTranslations("admin.settings.banners");

  const { banners, ads, slideCards, cmsPages, welcomePages, isLoading, isError, refetchAll } =
    useWebsiteContentData();

  const [selection, setSelection] = useState<Selection>(() => ({
    kind: "builtin",
    surface: WEBSITE_BUILTIN_SURFACE_LIST[0],
  }));

  const sortedCmsPages = useMemo(
    () =>
      cmsPages
        .slice()
        .sort((left, right) => left.order - right.order || left.id - right.id),
    [cmsPages],
  );

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-start">
        <div>
          <Group gap="sm">
            <IconMap size={28} stroke={1.5} />
            <Title order={3}>{t("contentMapTitle")}</Title>
          </Group>
          <Text size="sm" c="dimmed" mt={4}>
            {t("contentMapSubtitle")}
          </Text>
        </div>
        <Button
          variant="light"
          size="compact-sm"
          leftSection={<IconRefresh size={16} />}
          onClick={refetchAll}
          loading={isLoading}
        >
          {t("refresh")}
        </Button>
      </Group>

      {isError ? (
        <Alert color="red" title={t("loadErrorTitle")}>
          <Group justify="space-between">
            <Text size="sm">{t("loadErrorBody")}</Text>
            <Button size="xs" variant="light" onClick={refetchAll}>
              {t("retry")}
            </Button>
          </Group>
        </Alert>
      ) : null}

      <SimpleGrid cols={{ base: 1, md: 12 }} spacing="md">
        <Paper withBorder radius="lg" p="sm" style={{ gridColumn: "span 4" }}>
          <Text size="sm" fw={600} mb="xs" px="xs">
            {t("pagePicker")}
          </Text>
          <ScrollArea h={520} type="auto" offsetScrollbars>
            <Stack gap={4}>
              <Text size="xs" c="dimmed" px="xs" pt="xs">
                {t("builtinPages")}
              </Text>
              {WEBSITE_BUILTIN_SURFACE_LIST.map((surface) => (
                <NavLink
                  key={surface.id}
                  label={tBanner(`locationOptions.${surface.placement}`)}
                  description={surface.path}
                  active={
                    selection.kind === "builtin" &&
                    selection.surface.id === surface.id
                  }
                  onClick={() => setSelection({ kind: "builtin", surface })}
                  variant="light"
                />
              ))}

              <Text size="xs" c="dimmed" px="xs" pt="md">
                {t("customPages")}
              </Text>
              {isLoading && sortedCmsPages.length === 0 ? (
                <Group justify="center" py="sm">
                  <Loader size="sm" />
                </Group>
              ) : null}
              {!isLoading && sortedCmsPages.length === 0 ? (
                <Text size="xs" c="dimmed" px="xs">
                  {t("noCustomPages")}
                </Text>
              ) : null}
              {sortedCmsPages.map((page) => (
                <NavLink
                  key={page.id}
                  label={page.displayTitle || page.displaySlug || `#${page.id}`}
                  description={
                    page.displaySlug ? `/${page.displaySlug}` : undefined
                  }
                  leftSection={<IconWorldWww size={16} stroke={1.5} />}
                  active={
                    selection.kind === "cms" && selection.page.id === page.id
                  }
                  onClick={() => setSelection({ kind: "cms", page })}
                  variant="light"
                />
              ))}

              <Text size="xs" c="dimmed" px="xs" pt="md">
                {t("siteWide")}
              </Text>
              <NavLink
                label={t("siteWide")}
                description={t("siteWideSubtitle")}
                active={selection.kind === "siteWide"}
                onClick={() => setSelection({ kind: "siteWide" })}
                variant="light"
              />
            </Stack>
          </ScrollArea>
        </Paper>

        <Paper withBorder radius="lg" p="md" style={{ gridColumn: "span 8" }}>
          {isLoading ? (
            <Group justify="center" py="xl">
              <Loader />
            </Group>
          ) : null}

          {!isLoading && selection.kind === "builtin" ? (
            <PageWireframe
              surface={selection.surface}
              banners={banners}
              ads={ads}
              slideCards={slideCards}
            />
          ) : null}

          {!isLoading && selection.kind === "cms" ? (
            <CmsPageEditor page={selection.page} />
          ) : null}

          {!isLoading && selection.kind === "siteWide" ? (
            <SiteWideWireframe banners={banners} welcomePages={welcomePages} />
          ) : null}
        </Paper>
      </SimpleGrid>

      <ContentMapActionHost />
    </Stack>
  );
}

/**
 * Admin panel: visual map of website pages with banners, ads, and Silders.
 */
export function WebsiteContentMapPanel() {
  return (
    <ContentMapActionsProvider>
      <WebsiteContentMapPanelInner />
    </ContentMapActionsProvider>
  );
}
