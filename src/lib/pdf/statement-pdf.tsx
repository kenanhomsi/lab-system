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
    marginBottom: 14,
  },
  sectionTitle: {
    textAlign: "right",
    fontSize: 12,
    marginTop: 10,
    marginBottom: 6,
    color: "#009cc2",
  },
  tableHeader: {
    flexDirection: "row-reverse",
    backgroundColor: "#009cc2",
    paddingVertical: 5,
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
    borderBottomColor: "#ddd",
    paddingVertical: 5,
    paddingHorizontal: 4,
  },
  tableCell: {
    fontSize: 8,
    textAlign: "right",
    flex: 1,
  },
  summary: {
    marginTop: 16,
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

export type StatementPaymentRow = {
  date: string;
  amount: string;
  description: string;
};

export type StatementExpenseRow = {
  date: string;
  amount: string;
  expenseType: string;
};

export type StatementPdfProps = {
  dateFrom: string;
  dateTo: string;
  payments: StatementPaymentRow[];
  expenses: StatementExpenseRow[];
  totalPayments: string;
  totalExpenses: string;
  balance: string;
};

export function StatementPdfDocument({
  dateFrom,
  dateTo,
  payments,
  expenses,
  totalPayments,
  totalExpenses,
  balance,
}: StatementPdfProps) {
  return (
    <Document language="ar">
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>كشف الحساب</Text>
        <Text style={styles.dateRange}>
          من {dateFrom} إلى {dateTo}
        </Text>

        <Text style={styles.sectionTitle}>المدفوعات</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>الوصف</Text>
          <Text style={styles.tableHeaderCell}>المبلغ</Text>
          <Text style={styles.tableHeaderCell}>التاريخ</Text>
        </View>
        {payments.map((r, i) => (
          <View key={`p-${i}`} style={styles.tableRow} wrap={false}>
            <Text style={styles.tableCell}>{r.description}</Text>
            <Text style={styles.tableCell}>{r.amount}</Text>
            <Text style={styles.tableCell}>{r.date}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>المصروفات</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>النوع</Text>
          <Text style={styles.tableHeaderCell}>المبلغ</Text>
          <Text style={styles.tableHeaderCell}>التاريخ</Text>
        </View>
        {expenses.map((r, i) => (
          <View key={`e-${i}`} style={styles.tableRow} wrap={false}>
            <Text style={styles.tableCell}>{r.expenseType}</Text>
            <Text style={styles.tableCell}>{r.amount}</Text>
            <Text style={styles.tableCell}>{r.date}</Text>
          </View>
        ))}

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryValue}>{totalPayments}</Text>
            <Text style={styles.summaryLabel}>إجمالي المدفوعات</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryValue}>{totalExpenses}</Text>
            <Text style={styles.summaryLabel}>إجمالي المصروفات</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryValue}>{balance}</Text>
            <Text style={styles.summaryLabel}>الرصيد</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
