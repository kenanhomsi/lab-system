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
  headerRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#009cc2",
    paddingBottom: 8,
  },
  title: {
    fontSize: 16,
    textAlign: "right",
  },
  date: {
    fontSize: 10,
    textAlign: "right",
    color: "#444",
  },
  patientBar: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    backgroundColor: "#f0f7f9",
    padding: 10,
    marginBottom: 14,
    borderRadius: 4,
  },
  patientText: {
    textAlign: "right",
    fontSize: 10,
  },
  tableHeader: {
    flexDirection: "row-reverse",
    backgroundColor: "#009cc2",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tableHeaderCell: {
    color: "#fff",
    fontSize: 8,
    textAlign: "right",
    flex: 1,
  },
  tableRow: {
    flexDirection: "row-reverse",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tableCell: {
    fontSize: 8,
    textAlign: "right",
    flex: 1,
  },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 36,
    right: 36,
    textAlign: "center",
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#666",
  },
});

export type ResultsPdfRow = {
  testName: string;
  result: string;
  normalRange: string;
  unit: string;
  note?: string;
};

export type ResultsPdfProps = {
  date: string;
  patientName: string;
  patientAge: number;
  patientSex: "male" | "female";
  rows: ResultsPdfRow[];
};

const sexLabel = (s: "male" | "female") => (s === "male" ? "ذكر" : "أنثى");

export function ResultsPdfDocument({
  date,
  patientName,
  patientAge,
  patientSex,
  rows,
}: ResultsPdfProps) {
  return (
    <Document language="ar">
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>مخبر المتوالي للتحاليل الطبية</Text>
            <Text style={styles.date}>التاريخ: {date}</Text>
          </View>
        </View>

        <View style={styles.patientBar}>
          <Text style={styles.patientText}>الاسم: {patientName}</Text>
          <Text style={styles.patientText}>العمر: {patientAge}</Text>
          <Text style={styles.patientText}>الجنس: {sexLabel(patientSex)}</Text>
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>ملاحظة</Text>
          <Text style={styles.tableHeaderCell}>الوحدة</Text>
          <Text style={styles.tableHeaderCell}>المعدل الطبيعي</Text>
          <Text style={styles.tableHeaderCell}>النتيجة</Text>
          <Text style={styles.tableHeaderCell}>اسم التحليل</Text>
        </View>
        {rows.map((r, i) => (
          <View key={i} style={styles.tableRow} wrap={false}>
            <Text style={styles.tableCell}>{r.note ?? "—"}</Text>
            <Text style={styles.tableCell}>{r.unit}</Text>
            <Text style={styles.tableCell}>{r.normalRange}</Text>
            <Text style={styles.tableCell}>{r.result}</Text>
            <Text style={styles.tableCell}>{r.testName}</Text>
          </View>
        ))}

        <Text style={styles.footer} fixed>
          Al Mutawali Medical Lab
        </Text>
      </Page>
    </Document>
  );
}
