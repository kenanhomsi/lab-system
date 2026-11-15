import {
  FiActivity,
  FiAlertCircle,
  FiCheckCircle,
  FiClipboard,
  FiCreditCard,
  FiFilePlus,
  FiShield,
  FiUserPlus,
} from "react-icons/fi";
import type { IconType } from "react-icons/lib";
import type { navbarQuickActionIcon } from "./type";

/** Icon registry for navbar quick actions (create shortcuts). */
export const QUICK_ACTION_ICONS: Record<navbarQuickActionIcon, IconType> = {
  userPlus: FiUserPlus,
  flask: FiActivity,
  clipboardList: FiClipboard,
  clipboardCheck: FiCheckCircle,
  creditCard: FiCreditCard,
  alertCircle: FiAlertCircle,
  shield: FiShield,
  filePlus: FiFilePlus,
};
