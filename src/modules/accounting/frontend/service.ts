import { inject, injectable } from "inversify";
import { accountingModuleNames } from "../names";
import { AccountingFrontendClient } from "./client";
import {
  CreatePaymentFrontendParams,
  DownloadStatementPdfFrontendParams,
  GetStatementFrontendParams,
  ListPaymentsFrontendParams,
  UpdatePaymentFrontendParams,
  UpdateSettingsFrontendParams,
  UploadStatementPdfFrontendParams,
} from "./types";

@injectable()
class Service {
  @inject(accountingModuleNames.client)
  private Client: AccountingFrontendClient;

  getSettings() {
    return this.Client.getSettings();
  }

  updateSettings(body: UpdateSettingsFrontendParams) {
    return this.Client.updateSettings(body);
  }

  getStatement(params: GetStatementFrontendParams) {
    return this.Client.getStatement(params);
  }

  downloadStatementPdf(params: DownloadStatementPdfFrontendParams) {
    return this.Client.downloadStatementPdf(params);
  }

  uploadStatementPdf(params: UploadStatementPdfFrontendParams) {
    return this.Client.uploadStatementPdf(params);
  }

  listPayments(params: ListPaymentsFrontendParams) {
    return this.Client.listPayments(params);
  }

  createPayment(body: CreatePaymentFrontendParams) {
    return this.Client.createPayment(body);
  }

  updatePayment(params: UpdatePaymentFrontendParams) {
    return this.Client.updatePayment(params);
  }

  deletePayment(id: number) {
    return this.Client.deletePayment(id);
  }
}

export { Service as AccountingFrontendService };
