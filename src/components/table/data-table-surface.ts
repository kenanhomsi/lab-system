import styles from "./style.module.scss";

/** Reusable class names for table cells; use with shared `Table` defaults. */
export const dataTableSurface = {
  row: styles.rowStyles,
  rowActions: styles.rowActions,
  textCell: styles.textCell,
  badge: styles.badge,
  actionIconPrimary: styles.actionIconPrimary,
  actionIconSecondary: styles.actionIconSecondary,
} as const;
