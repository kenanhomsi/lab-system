export type MeUser = {
  id: string;
  email: string;
  fullName: string;
  city: string | null;
  phoneNumber: string | null;
  isActive: boolean;
  emailConfirmed: boolean;
  lockoutEnabled?: boolean;
  lockoutEnd?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  roles?: string[];
  profileMetadata?: string | null;
};

export type UpdateMeRequest = {
  fullName: string;
  city: string;
  phoneNumber: string;
  profileMetadata: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

