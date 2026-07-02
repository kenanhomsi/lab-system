import type { AdMediaType } from "@/types/ad";
import type { DisplayMode } from "@/lib/banners/display-mode";

type WithToken = {
  token: string;
};

type FindAllAdParams = WithToken & {
  query?: Record<string, string>;
};

type FindOneAdParams = WithToken & {
  id: number;
};

type DeleteAdParams = WithToken & {
  id: number;
};

type CreateAdParams = WithToken & {
  name: string;
  description: string;
  displayMode: DisplayMode;
  mediaType: AdMediaType;
  media: File;
  addressName: string;
};

type UpdateAdParams = WithToken & {
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
