import type {
  CreatePaymentInput,
  UpdateAccountingSettingsInput,
  UpdatePaymentInput,
} from "../abstraction/schemas";

export type WithToken = { token: string };

export type GetStatementParams = WithToken & {
  query: {
    labClientId: string;
    from?: string;
    to?: string;
  };
};

export type GetStatementPdfParams = WithToken & {
  query: {
    labClientId: string;
    from?: string;
    to?: string;
  };
};

export type UploadStatementPdfParams = WithToken & {
  labClientId: string;
  from: string;
  to: string;
  file: Blob;
  notes: string;
  fileName: string;
};

export type ListPaymentsParams = WithToken & {
  query: Record<string, string | undefined>;
};

export type CreatePaymentParams = WithToken & CreatePaymentInput;

export type UpdatePaymentParams = WithToken & UpdatePaymentInput & { id: number };

export type DeletePaymentParams = WithToken & { id: number };

export type UpdateSettingsParams = WithToken & UpdateAccountingSettingsInput;

export type GetSettingsParams = WithToken;
