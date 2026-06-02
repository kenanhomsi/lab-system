import type {
  CreatePaymentInput,
  UpdateAccountingSettingsInput,
  UpdatePaymentInput,
} from "../abstraction/schemas";

export type GetStatementFrontendParams = {
  labClientId: string;
  from?: string;
  to?: string;
};

export type ListPaymentsFrontendParams = {
  labClientId?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
};

export type CreatePaymentFrontendParams = CreatePaymentInput;
export type UpdatePaymentFrontendParams = UpdatePaymentInput & { id: number };
export type UpdateSettingsFrontendParams = UpdateAccountingSettingsInput;

export type UploadStatementPdfFrontendParams = {
  labClientId: string;
  from: string;
  to: string;
  file: File;
  notes: string;
};

export type DownloadStatementPdfFrontendParams = GetStatementFrontendParams;
