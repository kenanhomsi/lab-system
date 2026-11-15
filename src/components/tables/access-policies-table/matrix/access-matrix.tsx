"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Center,
  Group,
  Loader,
  Modal,
  SegmentedControl,
  Text,
  TextInput,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { FiCheck, FiInfo, FiMinus, FiSearch, FiX } from "react-icons/fi";
import { frontendContainer } from "@/container";
import { roleModuleNames, type RoleFrontendService } from "@/modules/role";
import { useMirror } from "../store";
import type { AccessPolicyTableItem } from "../types";
import {
  MATRIX_ACTIONS,
  evaluateCell,
  humanizeResource,
  type CellResult,
  type MatrixAction,
} from "./evaluate";
import styles from "./access-matrix.module.scss";

const roleService = frontendContainer.get<RoleFrontendService>(roleModuleNames.service);

const fetchRoleNames = async (): Promise<string[]> => {
  const payload = await roleService.findAll({ query: { Page: "1", PageSize: "100" } });
  return (payload?.items ?? []).map((role) => role.name).filter(Boolean);
};

type SelectedCell = { role: string; resource: string } | null;

const DECISION_ICON = {
  allow: FiCheck,
  deny: FiX,
  none: FiMinus,
} as const;

/**
 * Roles × resources grid showing the effective permission for one action at a
 * time. Click a cell to see which rule decides it for every action, and edit
 * or override that rule.
 */
export const AccessMatrix = () => {
  const t = useTranslations("admin.settings.accessPolicies.matrix");
  const policies = useMirror("policiesData");
  const isPending = useMirror("isPending");
  const setActiveModal = useMirror("setActiveModal");
  const setSelectedPolicy = useMirror("setSelectedPolicy");
  const setCreateDraft = useMirror("setCreateDraft");

  const [action, setAction] = useState<MatrixAction>("read");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<SelectedCell>(null);

  const { data: apiRoles = [], isPending: rolesPending } = useQuery({
    queryKey: ["admin-roles-all-names"],
    queryFn: fetchRoleNames,
    staleTime: 60_000,
  });

  const roles = useMemo(() => {
    const fromPolicies = policies
      .filter((policy) => policy.subjectType.toLowerCase() === "role" && policy.subjectKey)
      .map((policy) => policy.subjectKey);
    const seen = new Set<string>();
    return [...apiRoles, ...fromPolicies].filter((role) => {
      const key = role.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [apiRoles, policies]);

  const resources = useMemo(() => {
    const unique = [...new Set(policies.map((policy) => policy.resource).filter(Boolean))].filter(
      (resource) => resource !== "*",
    );
    const q = search.trim().toLowerCase();
    return unique
      .filter((resource) => !q || `${resource} ${humanizeResource(resource)}`.toLowerCase().includes(q))
      .sort((a, b) => a.localeCompare(b));
  }, [policies, search]);

  const userSpecificCount = useMemo(
    () => policies.filter((policy) => policy.subjectType.toLowerCase() === "user").length,
    [policies],
  );

  const actionLabel = (value: MatrixAction) => t(`actions.${value}`);
  const decisionLabel = (result: CellResult) => t(`decision.${result.decision}`);

  const editRule = (policy: AccessPolicyTableItem) => {
    setSelected(null);
    setSelectedPolicy(policy);
    setActiveModal("edit");
  };

  const overrideRule = (role: string, resource: string, value: MatrixAction, result: CellResult) => {
    setSelected(null);
    setSelectedPolicy(null);
    setCreateDraft({
      resource,
      action: value,
      subjectType: "Role",
      subjectKey: role,
      effect: result.decision === "allow" ? "Deny" : "Allow",
      // One above the current deciding rule so the new rule actually takes effect.
      priority: result.decidingPolicy ? result.decidingPolicy.priority + 1 : 0,
      isEnabled: true,
    });
    setActiveModal("create");
  };

  if (isPending || rolesPending) {
    return (
      <Center py="xl">
        <Loader color="cyan" />
      </Center>
    );
  }

  if (policies.length === 0 || roles.length === 0) {
    return (
      <div className={styles.empty}>
        <Text fw={600}>{t("emptyTitle")}</Text>
        <Text size="sm" c="dimmed">
          {t("emptyHint")}
        </Text>
      </div>
    );
  }

  const renderCell = (role: string, resource: string) => {
    const result = evaluateCell(policies, role, resource, action);
    const Icon = DECISION_ICON[result.decision];
    const label = `${role} · ${humanizeResource(resource)} · ${actionLabel(action)}: ${decisionLabel(result)}`;
    return (
      <td key={role} className={styles.cellTd}>
        <button
          type="button"
          className={`${styles.cell} ${styles[`cell_${result.decision}`]}`}
          onClick={() => setSelected({ role, resource })}
          aria-label={label}
          title={label}
        >
          <Icon size={15} aria-hidden />
          {result.conditional ? <span className={styles.condDot} aria-hidden /> : null}
          {result.inherited ? <span className={styles.inheritMark} aria-hidden>*</span> : null}
        </button>
      </td>
    );
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <div className={styles.actionPicker}>
          <Text size="xs" fw={700} c="dimmed" className={styles.toolbarLabel}>
            {t("actionPickerLabel")}
          </Text>
          <SegmentedControl
            value={action}
            onChange={(value) => setAction(value as MatrixAction)}
            data={MATRIX_ACTIONS.map((value) => ({ value, label: actionLabel(value) }))}
            size="sm"
            radius="md"
          />
        </div>
        <TextInput
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder={t("searchPlaceholder")}
          leftSection={<FiSearch size={14} />}
          className={styles.search}
          aria-label={t("searchPlaceholder")}
        />
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={`${styles.legendSwatch} ${styles.cell_allow}`}>
            <FiCheck size={12} />
          </span>
          {t("decision.allow")}
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendSwatch} ${styles.cell_deny}`}>
            <FiX size={12} />
          </span>
          {t("decision.deny")}
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendSwatch} ${styles.cell_none}`}>
            <FiMinus size={12} />
          </span>
          {t("decision.none")}
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} />
          {t("legendConditional")}
        </span>
        <span className={styles.legendItem}>
          <strong className={styles.legendStar}>*</strong>
          {t("legendInherited")}
        </span>
      </div>

      <div className={styles.scroller}>
        <table className={styles.table}>
          <caption className={styles.caption}>
            {t("caption", { action: actionLabel(action) })}
          </caption>
          <thead>
            <tr>
              <th scope="col" className={styles.cornerTh}>
                {t("resourceColumn")}
              </th>
              {roles.map((role) => (
                <th key={role} scope="col" className={styles.roleTh}>
                  {role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource}>
                <th scope="row" className={styles.resourceTh}>
                  <span className={styles.resourceName}>{humanizeResource(resource)}</span>
                  <span className={styles.resourceKey} dir="ltr">
                    {resource}
                  </span>
                </th>
                {roles.map((role) => renderCell(role, resource))}
              </tr>
            ))}
          </tbody>
        </table>
        {resources.length === 0 ? (
          <Text size="sm" c="dimmed" ta="center" py="lg">
            {t("searchEmpty")}
          </Text>
        ) : null}
      </div>

      <Alert variant="light" color="gray" icon={<FiInfo size={16} />} className={styles.note}>
        <Text size="xs">{t("howItWorks")}</Text>
        {userSpecificCount > 0 ? (
          <Text size="xs" mt={4}>
            {t("userRulesHidden", { count: userSpecificCount })}
          </Text>
        ) : null}
      </Alert>

      <Modal
        opened={selected !== null}
        onClose={() => setSelected(null)}
        size="lg"
        centered
        title={
          selected ? (
            <Text fw={700}>
              {selected.role} · {humanizeResource(selected.resource)}
            </Text>
          ) : null
        }
      >
        {selected ? (
          <div className={styles.detailList}>
            <Text size="sm" c="dimmed" mb="xs">
              {t("detailIntro")}
            </Text>
            {MATRIX_ACTIONS.map((value) => {
              const result = evaluateCell(policies, selected.role, selected.resource, value);
              const Icon = DECISION_ICON[result.decision];
              const policy = result.decidingPolicy;
              return (
                <div key={value} className={styles.detailRow}>
                  <span className={`${styles.cell} ${styles[`cell_${result.decision}`]} ${styles.detailIcon}`}>
                    <Icon size={14} aria-hidden />
                  </span>
                  <div className={styles.detailText}>
                    <Group gap={6} wrap="wrap">
                      <Text fw={700} size="sm">
                        {actionLabel(value)}
                      </Text>
                      <Text size="sm" c="dimmed">
                        — {decisionLabel(result)}
                      </Text>
                      {result.conditional ? (
                        <Badge size="xs" variant="light" color="yellow">
                          {t("legendConditional")}
                        </Badge>
                      ) : null}
                    </Group>
                    <Text size="xs" c="dimmed">
                      {policy
                        ? t(result.inherited ? "reasonInherited" : "reasonRole", {
                            priority: policy.priority,
                          })
                        : t("reasonNone")}
                      {policy?.description ? ` · ${policy.description}` : ""}
                      {result.matches.length > 1
                        ? ` · ${t("otherRules", { count: result.matches.length - 1 })}`
                        : ""}
                    </Text>
                  </div>
                  <Group gap={6} wrap="nowrap" className={styles.detailActions}>
                    {policy ? (
                      <Button size="compact-xs" variant="default" onClick={() => editRule(policy)}>
                        {t("editRule")}
                      </Button>
                    ) : null}
                    <Button
                      size="compact-xs"
                      variant="light"
                      color={result.decision === "allow" ? "red" : "teal"}
                      onClick={() => overrideRule(selected.role, selected.resource, value, result)}
                    >
                      {result.decision === "allow" ? t("denyAction") : t("allowAction")}
                    </Button>
                  </Group>
                </div>
              );
            })}
          </div>
        ) : null}
      </Modal>
    </div>
  );
};
