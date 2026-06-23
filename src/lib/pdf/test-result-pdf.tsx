import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

Font.register({
  family: "QomraArabic",
  src: "https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/hinted/ttf/NotoSansArabic/NotoSansArabic-Regular.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: "QomraArabic",
    fontSize: 10,
    color: "#1f2937",
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#0f9f9f",
    paddingBottom: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    color: "#0f766e",
    marginBottom: 4,
  },
  subtitle: {
    color: "#4b5563",
    fontSize: 10,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    color: "#0f766e",
    marginBottom: 8,
  },
  metaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  metaItem: {
    width: "48%",
    padding: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 4,
  },
  label: {
    fontSize: 8,
    color: "#6b7280",
    marginBottom: 3,
  },
  value: {
    fontSize: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0f9f9f",
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderCell: {
    color: "#ffffff",
    fontSize: 9,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#d1d5db",
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  keyCell: {
    width: "38%",
    paddingRight: 8,
  },
  valueCell: {
    width: "62%",
  },
  rawBlock: {
    padding: 10,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    left: 36,
    right: 36,
    bottom: 24,
    textAlign: "center",
    color: "#6b7280",
    fontSize: 8,
  },
});

export type TestResultPdfRow = {
  key: string;
  value: string;
};

export type TestResultPdfReport = {
  id: number;
  testRequestId: number;
  requestCreatedBy?: string | null;
  resultDate: string;
  status: string;
  createdAt: string;
  rows: TestResultPdfRow[];
  rawResultData?: string;
  pdfUrl?: string | null;
};

export type TestResultPdfProps = TestResultPdfReport | {
  results: TestResultPdfReport[];
};

function isBulkReport(props: TestResultPdfProps): props is { results: TestResultPdfReport[] } {
  return "results" in props;
}

/**
 * Renders a single lab test result as a downloadable PDF report.
 */
function TestResultPage({
  id,
  testRequestId,
  requestCreatedBy,
  resultDate,
  status,
  createdAt,
  rows,
  rawResultData,
  pdfUrl,
}: TestResultPdfReport) {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Test Result Report</Text>
        <Text style={styles.subtitle}>Al Mutawali Medical Lab</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Result details</Text>
        <View style={styles.metaGrid}>
          <View style={styles.metaItem}>
            <Text style={styles.label}>Result ID</Text>
            <Text style={styles.value}>{String(id)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.label}>Test request ID</Text>
            <Text style={styles.value}>{String(testRequestId)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.label}>Request created by</Text>
            <Text style={styles.value}>{requestCreatedBy || "-"}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.value}>{status || "-"}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.label}>Result date</Text>
            <Text style={styles.value}>{resultDate || "-"}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.label}>Record created</Text>
            <Text style={styles.value}>{createdAt || "-"}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Result values</Text>
        {rows.length > 0 ? (
          <View>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.keyCell]}>Field</Text>
              <Text style={[styles.tableHeaderCell, styles.valueCell]}>Value</Text>
            </View>
            {rows.map((row) => (
              <View key={row.key} style={styles.tableRow} wrap={false}>
                <Text style={styles.keyCell}>{row.key}</Text>
                <Text style={styles.valueCell}>{row.value}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.rawBlock}>{rawResultData || "-"}</Text>
        )}
      </View>

      {pdfUrl ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attached PDF URL</Text>
          <Text style={styles.rawBlock}>{pdfUrl}</Text>
        </View>
      ) : null}

      <Text style={styles.footer} fixed>
        Generated from the doctor system portal
      </Text>
    </Page>
  );
}

/**
 * Renders one or more lab test results as a downloadable PDF report.
 */
export function TestResultPdfDocument(props: TestResultPdfProps) {
  const results = isBulkReport(props) ? props.results : [props];
  const title = results.length === 1 ? `Test result ${results[0]?.id ?? ""}` : "Test results";

  return (
    <Document title={title} author="Al Mutawali Medical Lab">
      {results.map((result) => (
        <TestResultPage key={result.id} {...result} />
      ))}
    </Document>
  );
}
