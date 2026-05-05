import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

Font.register({
  family: "NotoSansArabic",
  src: "https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/hinted/ttf/NotoSansArabic/NotoSansArabic-Regular.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: "NotoSansArabic",
    fontSize: 10,
  },
  header: {
    textAlign: "right",
    fontSize: 18,
    marginBottom: 8,
  },
  dateRange: {
    textAlign: "right",
    fontSize: 10,
    color: "#444",
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: "row-reverse",
    backgroundColor: "#009cc2",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tableHeaderCell: {
    color: "#fff",
    fontSize: 9,
    textAlign: "right",
  },
  colPatient: { flex: 2 },
  colTests: { flex: 2 },
  colNum: { flex: 1 },
  tableRow: {
    flexDirection: "row-reverse",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tableCell: {
    fontSize: 8,
    textAlign: "right",
  },
  summary: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
  },
  summaryRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  summaryLabel: { textAlign: "right", fontSize: 10 },
  summaryValue: { textAlign: "right", fontSize: 10, fontWeight: "bold" },
});

export type AccountingPdfRow = {
  patient: string;
  tests: string;
  price: string;
  payment: string;
};

export type AccountingPdfProps = {
  dateFrom: string;
  dateTo: string;
  rows: AccountingPdfRow[];
  totalTestsAmount: string;
  totalPayments: string;
  balanceDue: string;
};

export function AccountingPdfDocument({
  dateFrom,
  dateTo,
  rows,
  totalTestsAmount,
  totalPayments,
  balanceDue,
}: AccountingPdfProps) {
  return (
    <Document language="ar">
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>كشف حساب مخبري</Text>
        <Text style={styles.dateRange}>
          من {dateFrom} إلى {dateTo}
        </Text>

        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, styles.colNum]}>الدفع</Text>
          <Text style={[styles.tableHeaderCell, styles.colNum]}>السعر</Text>
          <Text style={[styles.tableHeaderCell, styles.colTests]}>التحاليل</Text>
          <Text style={[styles.tableHeaderCell, styles.colPatient]}>المريض</Text>
        </View>
        {rows.map((r, i) => (
          <View key={i} style={styles.tableRow} wrap={false}>
            <Text style={[styles.tableCell, styles.colNum]}>{r.payment}</Text>
            <Text style={[styles.tableCell, styles.colNum]}>{r.price}</Text>
            <Text style={[styles.tableCell, styles.colTests]}>{r.tests}</Text>
            <Text style={[styles.tableCell, styles.colPatient]}>{r.patient}</Text>
          </View>
        ))}

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryValue}>{totalTestsAmount}</Text>
            <Text style={styles.summaryLabel}>إجمالي مبالغ التحاليل</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryValue}>{totalPayments}</Text>
            <Text style={styles.summaryLabel}>إجمالي المدفوعات</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryValue}>{balanceDue}</Text>
            <Text style={styles.summaryLabel}>الرصيد المستحق</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
