import type { ExternalPatient } from "../backend/types";

type CreateExternalPatientFrontendParams = {
  fullName: string;
  age: number;
  gender: string;
  phoneNumber: string;
  externalId: string;
};

type FindOneExternalPatientFrontendParams = {
  id: string;
};

type LinkDirectPatientFrontendParams = {
  id: string;
  directPatientUserId: string;
};

export type {
  CreateExternalPatientFrontendParams,
  ExternalPatient,
  FindOneExternalPatientFrontendParams,
  LinkDirectPatientFrontendParams,
};
