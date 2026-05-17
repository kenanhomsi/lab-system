const normalizeRoleToken = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/_/g, "");

type PartyIds = {
  doctorId: string | null;
  labClientId: string | null;
  directPatientId: string | null;
};

/** Staff (admin / secretary): manual party IDs. Clinical roles resolve from the logged-in user id. */
const isClinicalDoctor = (normalized: Set<string>): boolean =>
  normalized.has("doctor");

const isClinicalLab = (normalized: Set<string>): boolean =>
  normalized.has("lab") ||
  normalized.has("labclient") ||
  normalized.has("labtech") ||
  normalized.has("labpartner");

const isClinicalPatient = (normalized: Set<string>): boolean =>
  normalized.has("patient") || normalized.has("directpatient");

const resolveClinicalPartyKindFromNormalized = (
  normalized: Set<string>,
): "doctor" | "lab" | "patient" | null => {
  if (isClinicalDoctor(normalized)) return "doctor";
  if (isClinicalLab(normalized)) return "lab";
  if (isClinicalPatient(normalized)) return "patient";
  return null;
};

const normalizedRoleSet = (roles: string[] | undefined): Set<string> =>
  new Set((roles ?? []).map(normalizeRoleToken));

function resolveClinicalPartyKind(
  roles: string[] | undefined,
): "doctor" | "lab" | "patient" | null {
  return resolveClinicalPartyKindFromNormalized(normalizedRoleSet(roles));
}

function isStaffPartyUser(roles: string[] | undefined): boolean {
  return resolveClinicalPartyKind(roles) === null;
}

function normalizeStaffPartyField(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

/** When the user has a Doctor / Lab / Patient role (first match in doctor → lab → patient order). */
function resolvePartyIds(userId: string, roles: string[] | undefined): PartyIds {
  const kind = resolveClinicalPartyKind(roles);
  if (kind === "doctor") {
    return { doctorId: userId, labClientId: null, directPatientId: null };
  }
  if (kind === "lab") {
    return { doctorId: null, labClientId: userId, directPatientId: null };
  }
  if (kind === "patient") {
    return { doctorId: null, labClientId: null, directPatientId: userId };
  }
  return { doctorId: null, labClientId: null, directPatientId: null };
}

function buildTestRequestPartyPayload(args: {
  userId: string;
  roles: string[] | undefined;
  formDoctorId: string;
  formLabClientId: string;
  formDirectPatientId: string;
}): PartyIds {
  if (isStaffPartyUser(args.roles)) {
    return {
      doctorId: normalizeStaffPartyField(args.formDoctorId),
      labClientId: normalizeStaffPartyField(args.formLabClientId),
      directPatientId: normalizeStaffPartyField(args.formDirectPatientId),
    };
  }
  return resolvePartyIds(args.userId, args.roles);
}

/** Patients may view test results but must not create, edit, or delete them. */
function isClinicalPatientUser(roles: string[] | undefined): boolean {
  return resolveClinicalPartyKind(roles) === "patient";
}

export {
  buildTestRequestPartyPayload,
  isClinicalPatientUser,
  isStaffPartyUser,
  resolveClinicalPartyKind,
};
