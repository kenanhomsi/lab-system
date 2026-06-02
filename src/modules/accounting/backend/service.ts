import { inject, injectable } from "inversify";
import { accountingModuleNames } from "../names";
import { AccountingBackendClient } from "./client";
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

@injectable()
class Service {
  @inject(accountingModuleNames.client)
  private Client: AccountingBackendClient;

  getSettings(params: GetSettingsParams) {
    return this.Client.getSettings(params);
  }

  updateSettings(params: UpdateSettingsParams) {
    return this.Client.updateSettings(params);
  }

  getStatement(params: GetStatementParams) {
    return this.Client.getStatement(params);
  }

  downloadStatementPdf(params: GetStatementPdfParams) {
    return this.Client.downloadStatementPdf(params);
  }

  uploadStatementPdf(params: UploadStatementPdfParams) {
    return this.Client.uploadStatementPdf(params);
  }

  listPayments(params: ListPaymentsParams) {
    return this.Client.listPayments(params);
  }

  createPayment(params: CreatePaymentParams) {
    return this.Client.createPayment(params);
  }

  updatePayment(params: UpdatePaymentParams) {
    return this.Client.updatePayment(params);
  }

  deletePayment(params: DeletePaymentParams) {
    return this.Client.deletePayment(params);
  }
}

export { Service as AccountingBackendService };
