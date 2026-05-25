"use client";

import {
  Badge,
  Box,
  Group,
  ScrollAreaAutosize,
  Text,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { IconBolt, IconDatabase, IconShield } from "@tabler/icons-react";

const ACTION_ORDER = ["read", "create", "update", "delete", "manage", "list"];

const ROLE_COLORS: Record<string, string> = {
  admin: "red",
  doctor: "blue",
  patient: "teal",
  lab: "grape",
  labpartner: "grape",
  secretary: "orange",
  user: "gray",
};

const NODE_W = 132;
const ACTION_W = 108;
const ROW_H = 58;
const COL_GAP = 52;
const PADDING = 16;

type TFunction = (key: string) => string;

export type PolicyGraphPolicy = {
  id: string;
  resource: string;
  action: string;
  effect: string;
  priority: number;
  isEnabled: boolean;
  description?: string | null;
  validFrom?: string | null;
  validTo?: string | null;
};

type Props = {
  policies: PolicyGraphPolicy[];
  roles: string[];
  t: TFunction;
};

type GraphRow = {
  resource: string;
  action: string;
  policy: PolicyGraphPolicy;
};

function sortActions(actions: string[]): string[] {
  return [...actions].sort((a, b) => {
    const ai = ACTION_ORDER.indexOf(a.toLowerCase());
    const bi = ACTION_ORDER.indexOf(b.toLowerCase());
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  });
}

function effectColor(effect: string): string {
  const normalized = effect.toLowerCase();
  if (normalized === "allow" || normalized === "permit") return "green";
  if (normalized === "deny" || normalized === "block") return "red";
  return "gray";
}

function isAllowEffect(effect: string): boolean {
  const normalized = effect.toLowerCase();
  return normalized === "allow" || normalized === "permit";
}

function pickPolicy(
  policies: PolicyGraphPolicy[],
  resource: string,
  action: string,
): PolicyGraphPolicy | undefined {
  const matches = policies.filter(
    (p) =>
      p.resource.toLowerCase() === resource.toLowerCase() &&
      p.action.toLowerCase() === action.toLowerCase(),
  );
  if (matches.length === 0) return undefined;
  return [...matches].sort((a, b) => b.priority - a.priority)[0];
}

function buildRows(policies: PolicyGraphPolicy[]): GraphRow[] {
  const resources = [...new Set(policies.map((p) => p.resource))].sort((a, b) =>
    a.localeCompare(b),
  );

  const rows: GraphRow[] = [];
  for (const resource of resources) {
    const actions = sortActions([
      ...new Set(
        policies.filter((p) => p.resource === resource).map((p) => p.action),
      ),
    ]);
    for (const action of actions) {
      const policy = pickPolicy(policies, resource, action);
      if (policy) rows.push({ resource, action, policy });
    }
  }
  return rows;
}

function bezierPath(x1: number, y1: number, x2: number, y2: number): string {
  const dx = (x2 - x1) * 0.45;
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

function PolicyTooltipContent({
  policy,
  t,
}: {
  policy: PolicyGraphPolicy;
  t: TFunction;
}) {
  return (
    <Box>
      <Text size="xs">{policy.description || "—"}</Text>
      <Text size="xs" c="dimmed" mt={4}>
        {t("policyPriority")}: {policy.priority}
      </Text>
      {policy.validFrom && (
        <Text size="xs" c="dimmed">
          {policy.validFrom} → {policy.validTo ?? "∞"}
        </Text>
      )}
    </Box>
  );
}

const PolicyGraph = ({ policies, roles, t }: Props) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  if (policies.length === 0) {
    return (
      <Text size="sm" c="dimmed">
        {t("policyNoData")}
      </Text>
    );
  }

  const rows = buildRows(policies);
  const graphHeight = PADDING * 2 + rows.length * ROW_H;
  const roleX = PADDING;
  const resourceX = roleX + NODE_W + COL_GAP;
  const actionX = resourceX + NODE_W + COL_GAP;
  const svgWidth = actionX + ACTION_W + PADDING;
  const roleCenterY = graphHeight / 2;

  const edgeColor = isDark ? theme.colors.dark[4] : theme.colors.gray[3];
  const allowEdge = theme.colors.green[isDark ? 5 : 4];
  const denyEdge = theme.colors.red[isDark ? 5 : 4];
  const nodeBg = isDark ? theme.colors.dark[6] : theme.white;
  const nodeBorder = isDark ? theme.colors.dark[4] : theme.colors.gray[3];
  const roleBg = isDark ? theme.colors.dark[5] : theme.colors.gray[0];

  const roleLabels = roles.length > 0 ? roles : ["User"];

  return (
    <ScrollAreaAutosize mah={360} type="auto" offsetScrollbars>
      <Box
        pos="relative"
        w={svgWidth}
        h={graphHeight}
        style={{ minWidth: svgWidth }}
      >
        <svg
          width={svgWidth}
          height={graphHeight}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          aria-hidden
        >
          {rows.map((row, index) => {
            const rowY = PADDING + index * ROW_H + ROW_H / 2;
            const allow = isAllowEffect(row.policy.effect);
            const stroke = allow ? allowEdge : denyEdge;

            return (
              <g key={`${row.resource}-${row.action}`}>
                <path
                  d={bezierPath(
                    roleX + NODE_W,
                    roleCenterY,
                    resourceX,
                    rowY,
                  )}
                  fill="none"
                  stroke={edgeColor}
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                  opacity={0.85}
                />
                <path
                  d={bezierPath(
                    resourceX + NODE_W,
                    rowY,
                    actionX,
                    rowY,
                  )}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={2}
                  opacity={row.policy.isEnabled ? 0.9 : 0.4}
                />
                <circle
                  cx={actionX - 6}
                  cy={rowY}
                  r={3.5}
                  fill={stroke}
                  opacity={row.policy.isEnabled ? 1 : 0.4}
                />
              </g>
            );
          })}
        </svg>

        <Box
          pos="absolute"
          left={roleX}
          top={roleCenterY - 36}
          w={NODE_W}
          p="xs"
          style={{
            borderRadius: theme.radius.md,
            border: `1px solid ${nodeBorder}`,
            background: roleBg,
            boxShadow: isDark
              ? "0 2px 8px rgba(0,0,0,0.25)"
              : "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <Group gap={6} mb={6} wrap="nowrap">
            <IconShield size={14} color={theme.colors.blue[6]} />
            <Text size="xs" fw={600} c="dimmed" tt="uppercase">
              {t("policyGraphRoles")}
            </Text>
          </Group>
          <Group gap={4}>
            {roleLabels.map((role) => (
              <Badge
                key={role}
                size="sm"
                variant="light"
                color={ROLE_COLORS[role.toLowerCase()] ?? "blue"}
              >
                {role}
              </Badge>
            ))}
          </Group>
        </Box>

        {rows.map((row, index) => {
          const rowY = PADDING + index * ROW_H;
          const allow = isAllowEffect(row.policy.effect);
          const effectLabel = allow ? t("policyAllow") : t("policyDeny");
          const midX = resourceX + NODE_W + COL_GAP / 2;

          return (
            <Box key={`${row.resource}-${row.action}-nodes`}>
              <Tooltip
                multiline
                w={260}
                label={<PolicyTooltipContent policy={row.policy} t={t} />}
              >
                <Box
                  pos="absolute"
                  left={resourceX}
                  top={rowY + (ROW_H - 40) / 2}
                  w={NODE_W}
                  h={40}
                  px="sm"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    borderRadius: theme.radius.md,
                    border: `1px solid ${nodeBorder}`,
                    background: nodeBg,
                    boxShadow: isDark
                      ? "0 1px 4px rgba(0,0,0,0.2)"
                      : "0 1px 4px rgba(0,0,0,0.04)",
                    cursor: "default",
                  }}
                >
                  <IconDatabase
                    size={16}
                    color={isDark ? theme.colors.gray[5] : theme.colors.gray[6]}
                  />
                  <Text size="xs" fw={500} lineClamp={1}>
                    {row.resource}
                  </Text>
                </Box>
              </Tooltip>

              <Tooltip
                multiline
                w={260}
                label={<PolicyTooltipContent policy={row.policy} t={t} />}
              >
                <Box
                  pos="absolute"
                  left={actionX}
                  top={rowY + (ROW_H - 36) / 2}
                  w={ACTION_W}
                  h={36}
                  px="xs"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    borderRadius: theme.radius.md,
                    border: `1px solid ${nodeBorder}`,
                    background: nodeBg,
                    cursor: "default",
                  }}
                >
                  <IconBolt
                    size={14}
                    color={isDark ? theme.colors.gray[5] : theme.colors.gray[6]}
                  />
                  <Text size="xs" fw={600}>
                    {row.action}
                  </Text>
                </Box>
              </Tooltip>

              <Box
                pos="absolute"
                left={midX - 36}
                top={rowY + ROW_H / 2 - 12}
                style={{ pointerEvents: "none" }}
              >
                <Badge
                  size="sm"
                  variant="filled"
                  color={effectColor(row.policy.effect)}
                  opacity={row.policy.isEnabled ? 1 : 0.45}
                >
                  {effectLabel}
                  {!row.policy.isEnabled ? ` (${t("policyDisabled")})` : ""}
                </Badge>
              </Box>
            </Box>
          );
        })}
      </Box>

      <Group gap="lg" mt="md" justify="center">
        <Group gap={6}>
          <Box
            w={24}
            h={3}
            style={{ borderRadius: 2, background: allowEdge }}
          />
          <Text size="xs" c="dimmed">
            {t("policyAllow")}
          </Text>
        </Group>
        <Group gap={6}>
          <Box
            w={24}
            h={3}
            style={{ borderRadius: 2, background: denyEdge }}
          />
          <Text size="xs" c="dimmed">
            {t("policyDeny")}
          </Text>
        </Group>
        <Group gap={6}>
          <Box
            w={24}
            h={3}
            style={{
              borderRadius: 2,
              background: edgeColor,
              backgroundImage: `repeating-linear-gradient(90deg, ${edgeColor}, ${edgeColor} 4px, transparent 4px, transparent 7px)`,
            }}
          />
          <Text size="xs" c="dimmed">
            {t("policyGraphRoleLink")}
          </Text>
        </Group>
      </Group>
    </ScrollAreaAutosize>
  );
};

export { PolicyGraph };
