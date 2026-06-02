import { injectable, injectFromBase } from "inversify";
import { AxiosState } from "@/modules/axios";
import { AccountingClient } from "../abstraction";
import type {
  AccountingPayment,
  AccountingSettings,
  AccountingStatement,
  PaginatedPayments,
} from "../abstraction/schemas";
import { endpoint } from "./endpoint";
import {
  CreatePaymentFrontendParams,
  DownloadStatementPdfFrontendParams,
  GetStatementFrontendParams,
  ListPaymentsFrontendParams,
  UpdatePaymentFrontendParams,
  UpdateSettingsFrontendParams,
  UploadStatementPdfFrontendParams,
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

@injectable()
@injectFromBase({ extendProperties: true })
class Client extends AccountingClient<AxiosState> {
  async getSettings() {
    const res = await super
      .sharedGet({ endpoint: endpoint.settings })
      .perform<AccountingSettings>();
    return res.data;
  }

  async updateSettings(body: UpdateSettingsFrontendParams) {
    const res = await super
      .sharedPut({ endpoint: endpoint.settings, body })
      .perform<AccountingSettings>();
    return res.data;
  }

  async getStatement(params: GetStatementFrontendParams) {
    const res = await super
      .sharedGet({
        endpoint: appendQueryParams(endpoint.statements, {
          labClientId: params.labClientId,
          from: params.from,
          to: params.to,
        }),
      })
      .perform<AccountingStatement>();
    return res.data;
  }

  async downloadStatementPdf(params: DownloadStatementPdfFrontendParams) {
    const res = await super
      .sharedGet({
        endpoint: appendQueryParams(endpoint.statementsPdf, {
          labClientId: params.labClientId,
          from: params.from,
          to: params.to,
        }),
      })
      .setResponseType("blob")
      .perform<Blob>();
    return res.data;
  }

  async uploadStatementPdf(params: UploadStatementPdfFrontendParams) {
    const formData = new FormData();
    formData.append("labClientId", params.labClientId);
    formData.append("from", params.from);
    formData.append("to", params.to);
    formData.append("notes", params.notes);
    formData.append("file", params.file);
    const res = await super
      .sharedPost({ endpoint: endpoint.statementsPdf, body: formData })
      .perform<unknown>();
    return res.data;
  }

  async listPayments(params: ListPaymentsFrontendParams) {
    const res = await super
      .sharedGet({
        endpoint: appendQueryParams(endpoint.payments, {
          labClientId: params.labClientId,
          from: params.from,
          to: params.to,
          page: params.page?.toString(),
          pageSize: params.pageSize?.toString(),
        }),
      })
      .perform<PaginatedPayments>();
    return res.data;
  }

  async createPayment(body: CreatePaymentFrontendParams) {
    const res = await super
      .sharedPost({ endpoint: endpoint.payments, body })
      .perform<AccountingPayment>();
    return res.data;
  }

  async updatePayment(params: UpdatePaymentFrontendParams) {
    const { id, ...body } = params;
    const res = await super
      .sharedPut({ endpoint: endpoint.paymentById(id), body })
      .perform<AccountingPayment>();
    return res.data;
  }

  async deletePayment(id: number) {
    await super.sharedDelete({ endpoint: endpoint.paymentById(id) }).perform();
  }
}

export { Client as AccountingFrontendClient };
