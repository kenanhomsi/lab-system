export const loginRoles = [
  { id: "patient" as const, icon: "person", labelKey: "patient" },
  { id: "doctor" as const, icon: "medical_services", labelKey: "doctor" },
  { id: "lab" as const, icon: "biotech", labelKey: "lab" },
  { id: "special" as const, icon: "admin_panel_settings", labelKey: "special" },
] as const;

export const adminRole = { id: "admin" as const, icon: "shield_person", labelKey: "admin" } as const;

export const registerRoles = [
  { id: "patient" as const, icon: "person", labelKey: "patient" },
  { id: "doctor" as const, icon: "medical_services", labelKey: "doctor" },
  { id: "lab" as const, icon: "biotech", labelKey: "lab" },
] as const;
