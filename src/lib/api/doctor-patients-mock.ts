export type DoctorPatientReport = {
  id: string;
  patientName: string;
  date: string;
  amount: number;
};

/** Static mock rows (date is YYYY-MM-DD) for BFF when upstream is off. */
const MOCK_ROWS: DoctorPatientReport[] = [
  { id: "p1", patientName: "ليلى حسن", date: "2026-04-01", amount: 185000 },
  { id: "p2", patientName: "عمر يوسف", date: "2026-04-02", amount: 92000 },
  { id: "p3", patientName: "نادية كريم", date: "2026-04-03", amount: 240000 },
  { id: "p4", patientName: "Karim Fadel", date: "2026-03-28", amount: 45000 },
  { id: "p5", patientName: "Sara Ali", date: "2026-03-30", amount: 132500 },
];

function parseDay(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function filterMockDoctorPatients(
  from: string | null,
  to: string | null,
): { patients: DoctorPatientReport[]; totalAmount: number } {
  const fromD = from ? parseDay(from) : null;
  const toD = to ? parseDay(to) : null;

  const patients = MOCK_ROWS.filter((row) => {
    const day = parseDay(row.date);
    if (fromD && day < fromD) return false;
    if (toD && day > toD) return false;
    return true;
  });

  const totalAmount = patients.reduce((sum, r) => sum + r.amount, 0);
  return { patients, totalAmount };
}
