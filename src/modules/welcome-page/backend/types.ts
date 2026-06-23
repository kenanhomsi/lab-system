import type { WelcomePageMediaType } from "@/types/welcome-page";

type WithToken = {
  token: string;
};

type FindAllWelcomePageParams = WithToken & {
  query?: Record<string, string>;
};

type FindOneWelcomePageParams = WithToken & {
  id: number;
};

type DeleteWelcomePageParams = WithToken & {
  id: number;
};

type CreateWelcomePageParams = WithToken & {
  name: string;
  description: string;
  mediaType: WelcomePageMediaType;
  media: File;
  isActive: boolean;
};

type UpdateWelcomePageParams = WithToken & {
  id: number;
  name: string;
  description: string;
  mediaType: WelcomePageMediaType;
  media?: File;
  isActive: boolean;
};

export type {
  CreateWelcomePageParams,
  DeleteWelcomePageParams,
  FindAllWelcomePageParams,
  FindOneWelcomePageParams,
  UpdateWelcomePageParams,
};
