type ExternalPatient = {
  id: number;
  fullName: string;
  age: number;
  gender: string;
  phoneNumber: string;
  externalId: string;
  linkedDirectPatientId: string | null;
  createdAt: string;
};

type AuthParams = {
  token: string;
};

type FindAllExternalPatientsParams = AuthParams;

type FindOneExternalPatientParams = AuthParams & {
  id: string;
};

type CreateExternalPatientParams = AuthParams & {
  fullName: string;
  age: number;
  gender: string;
  phoneNumber: string;
  externalId: string;
};

type LinkDirectPatientParams = AuthParams & {
  id: string;
  directPatientUserId: string;
};

export type {
  CreateExternalPatientParams,
  ExternalPatient,
  FindAllExternalPatientsParams,
  FindOneExternalPatientParams,
  LinkDirectPatientParams,
};
