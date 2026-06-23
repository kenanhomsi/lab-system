export type AdMediaType = "Image" | "Video";

export type AdItem = {
  id: number;
  name: string;
  description: string;
  mediaType: AdMediaType;
  mediaUrl: string;
  websiteUrl?: string;
  latitude?: number;
  longitude?: number;
  addressName?: string;
  createdAt: string;
  updatedAt: string | null;
};

export type AdsResponse = AdItem[];

export type CreateAdRequest = {
  name: string;
  description: string;
  mediaType: AdMediaType;
  media: File;
  addressName: string;
};

export type UpdateAdRequest = {
  id: number;
  name: string;
  description: string;
  mediaType: AdMediaType;
  media?: File;
  addressName: string;
};

export type AdModalType = "create" | "edit" | "delete" | "view" | null;
