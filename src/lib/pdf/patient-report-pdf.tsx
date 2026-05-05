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
    flex: 1,
  },
  tableRow: {
    flexDirection: "row-reverse",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tableCell: {
    fontSize: 9,
    textAlign: "right",
    flex: 1,
  },
  totalRow: {
    flexDirection: "row-reverse",
    marginTop: 12,
    padding: 10,
    backgroundColor: "#e8f4f8",
    borderRadius: 4,
  },
  totalLabel: {
    flex: 2,
    textAlign: "right",
    fontSize: 11,
    fontWeight: "bold",
  },
  totalValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 11,
    fontWeight: "bold",
  },
});

export type PatientReportPdfRow = {
  patientName: string;
  date: string;
  amount: string;
};

export type PatientReportPdfProps = {
  dateFrom: string;
  dateTo: string;
  rows: PatientReportPdfRow[];
  totalAmount: string;
};

export function PatientReportPdfDocument({
  dateFrom,
  dateTo,
  rows,
  totalAmount,
}: PatientReportPdfProps) {
  return (
    <Document language="ar">
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>تقرير المرضى</Text>
        <Text style={styles.dateRange}>
          من {dateFrom} إلى {dateTo}
        </Text>

        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>المبلغ</Text>
          <Text style={styles.tableHeaderCell}>التاريخ</Text>
          <Text style={styles.tableHeaderCell}>اسم المريض</Text>
        </View>
        {rows.map((r, i) => (
          <View key={i} style={styles.tableRow} wrap={false}>
            <Text style={styles.tableCell}>{r.amount}</Text>
            <Text style={styles.tableCell}>{r.date}</Text>
            <Text style={styles.tableCell}>{r.patientName}</Text>
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={styles.totalValue}>{totalAmount}</Text>
          <Text style={styles.totalLabel}>الإجمالي</Text>
        </View>
      </Page>
    </Document>
  );
}
