export type WelcomePageMediaType = "Image" | "Video";

export type WelcomePageItem = {
  id: number;
  name: string;
  description: string;
  mediaType: WelcomePageMediaType;
  mediaUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type WelcomePagesResponse = WelcomePageItem[];

export type CreateWelcomePageRequest = {
  name: string;
  description: string;
  mediaType: WelcomePageMediaType;
  media: File;
  isActive: boolean;
};

export type UpdateWelcomePageRequest = {
  id: number;
  name: string;
  description: string;
  mediaType: WelcomePageMediaType;
  media?: File;
  isActive: boolean;
};

export type WelcomePageModalType = "create" | "edit" | "delete" | "view" | null;
