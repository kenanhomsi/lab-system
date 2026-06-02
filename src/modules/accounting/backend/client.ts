import { injectable, injectFromBase } from "inversify";
import { BackendState } from "@/modules/axios";
import { isUpstreamBackendReady } from "@/lib/api/upstream-config";
import {
  mockAccountingCreatePayment,
  mockAccountingDeletePayment,
  mockAccountingGetSettings,
  mockAccountingGetStatement,
  mockAccountingListPayments,
  mockAccountingPdfBytes,
  mockAccountingUpdatePayment,
  mockAccountingUpdateSettings,
} from "@/lib/api/accounting-mock-store";
import { AccountingClient } from "../abstraction";
import type {
  AccountingPayment,
  AccountingSettings,
  AccountingStatement,
  PaginatedPayments,
} from "../abstraction/schemas";
import { endpoint } from "./endpoint";
import {
  CreatePaymentParams,
  DeletePaymentParams,
  GetSettingsParams,
  GetStatementParams,
  GetStatementPdfParams,
  ListPaymentsParams,
  UpdatePaymentParams,
  UpdateSettingsParams,
  UploadStatementPdfParams,
} from "./types";

const appendQueryParams = (
  path: string,
  query?: Record<string, string | undefined>,
) => {
  if (!query) return path;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") {
      params.set(key, value);
    }
  }
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
};

function unwrapData<T>(payload: unknown): T {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    (payload as { data: unknown }).data !== undefined
  ) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

@injectable()
@injectFromBase({ extendProperties: true })
class Client extends AccountingClient<BackendState> {
  async getSettings(params: GetSettingsParams): Promise<AccountingSettings> {
    if (!isUpstreamBackendReady()) {
      return mockAccountingGetSettings();
    }
    const res = await super
      .sharedGet({ endpoint: endpoint.settings })
      .withAuth(params.token)
      .perform<{ success?: boolean; data?: AccountingSettings } | AccountingSettings>();
    return unwrapData<AccountingSettings>(res.data);
  }

  async updateSettings(params: UpdateSettingsParams): Promise<AccountingSettings> {
    const { token, ...body } = params;
    if (!isUpstreamBackendReady()) {
      return mockAccountingUpdateSettings(body);
    }
    const res = await super
      .sharedPut({ endpoint: endpoint.settings, body })
      .withAuth(token)
      .perform<{ success?: boolean; data?: AccountingSettings } | AccountingSettings>();
    return unwrapData<AccountingSettings>(res.data);
  }

  async getStatement(params: GetStatementParams): Promise<AccountingStatement> {
    const { token, query } = params;
    if (!isUpstreamBackendReady()) {
      return mockAccountingGetStatement({
        labClientId: query.labClientId,
        from: query.from,
        to: query.to,
      });
    }
    const res = await super
      .sharedGet({
        endpoint: appendQueryParams(endpoint.statements, query),
      })
      .withAuth(token)
      .perform<AccountingStatement>();
    return unwrapData<AccountingStatement>(res.data);
  }

  async downloadStatementPdf(params: GetStatementPdfParams): Promise<ArrayBuffer> {
    const { token, query } = params;
    if (!isUpstreamBackendReady()) {
      return mockAccountingPdfBytes();
    }
    const res = await super
      .sharedGet({
        endpoint: appendQueryParams(endpoint.statementsPdf, query),
      })
      .withAuth(token)
      .setResponseType("arraybuffer")
      .perform<ArrayBuffer>();
    return res.data;
  }

  async uploadStatementPdf(params: UploadStatementPdfParams): Promise<unknown> {
    const { token, labClientId, from, to, file, notes, fileName } = params;
    if (!isUpstreamBackendReady()) {
      return { success: true, message: "Mock upload ok" };
    }
    const backendBase = process.env.BACKEND_URL?.replace(/\/$/, "");
    if (!backendBase) {
      throw new Error("BACKEND_URL is not configured");
    }
    const formData = new FormData();
    formData.append("LabClientId", labClientId);
    formData.append("From", from);
    formData.append("To", to);
    formData.append("Notes", notes);
    formData.append("File", file, fileName);
    const res = await fetch(`${backendBase}${endpoint.statementsPdf}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const text = await res.text();
    if (!res.ok) {
      throw new Error(text || `Upload failed (${res.status})`);
    }
    try {
      return JSON.parse(text) as unknown;
    } catch {
      return { message: text };
    }
  }

  async listPayments(params: ListPaymentsParams): Promise<PaginatedPayments> {
    const { token, query } = params;
    if (!isUpstreamBackendReady()) {
      return mockAccountingListPayments({
        labClientId: query.labClientId,
        from: query.from,
        to: query.to,
        page: query.page ? Number(query.page) : 1,
        pageSize: query.pageSize ? Number(query.pageSize) : 20,
      });
    }
    const res = await super
      .sharedGet({
        endpoint: appendQueryParams(endpoint.payments, query),
      })
      .withAuth(token)
      .perform<{ success?: boolean; data?: PaginatedPayments } | PaginatedPayments>();
    return unwrapData<PaginatedPayments>(res.data);
  }

  async createPayment(params: CreatePaymentParams): Promise<AccountingPayment> {
    const { token, ...body } = params;
    if (!isUpstreamBackendReady()) {
      return mockAccountingCreatePayment(body);
    }
    const res = await super
      .sharedPost({ endpoint: endpoint.payments, body })
      .withAuth(token)
      .perform<{ success?: boolean; data?: AccountingPayment } | AccountingPayment>();
    return unwrapData<AccountingPayment>(res.data);
  }

  async updatePayment(params: UpdatePaymentParams): Promise<AccountingPayment> {
    const { token, id, ...body } = params;
    if (!isUpstreamBackendReady()) {
      const updated = mockAccountingUpdatePayment(id, body);
      if (!updated) throw new Error("Payment not found");
      return updated;
    }
    const res = await super
      .sharedPut({ endpoint: endpoint.paymentById(id), body })
      .withAuth(token)
      .perform<{ success?: boolean; data?: AccountingPayment } | AccountingPayment>();
    return unwrapData<AccountingPayment>(res.data);
  }

  async deletePayment(params: DeletePaymentParams): Promise<void> {
    const { token, id } = params;
    if (!isUpstreamBackendReady()) {
      if (!mockAccountingDeletePayment(id)) {
        throw new Error("Payment not found");
      }
      return;
    }
    await super
      .sharedDelete({ endpoint: endpoint.paymentById(id) })
      .withAuth(token)
      .perform();
  }
}

export { Client as AccountingBackendClient };
