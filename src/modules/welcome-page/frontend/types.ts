import type { WelcomePageMediaType } from "@/types/welcome-page";

type FindAllWelcomePageParams = {
  query?: {
    Page?: string;
    PageSize?: string;
  };
};

type FindOneWelcomePageParams = {
  id: number;
};

type DeleteWelcomePageParams = {
  id: number;
};

type CreateWelcomePageParams = {
  name: string;
  description: string;
  mediaType: WelcomePageMediaType;
  media: File;
  isActive: boolean;
};

type UpdateWelcomePageParams = {
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
