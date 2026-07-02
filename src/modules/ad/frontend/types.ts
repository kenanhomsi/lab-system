import type { AdMediaType } from "@/types/ad";
import type { DisplayMode } from "@/lib/banners/display-mode";

type FindAllAdParams = {
  query?: {
    Page?: string;
    PageSize?: string;
  };
};

type FindOneAdParams = {
  id: number;
};

type DeleteAdParams = {
  id: number;
};

type CreateAdParams = {
  name: string;
  description: string;
  displayMode: DisplayMode;
  mediaType: AdMediaType;
  media: File;
  addressName: string;
};

type UpdateAdParams = {
  id: number;
  name: string;
  description: string;
  displayMode: DisplayMode;
  mediaType: AdMediaType;
  media?: File;
  addressName: string;
};

export type {
  CreateAdParams,
  DeleteAdParams,
  FindAllAdParams,
  FindOneAdParams,
  UpdateAdParams,
};
