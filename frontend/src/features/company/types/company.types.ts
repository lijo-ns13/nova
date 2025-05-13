export type IndustryType =
  | "Technology"
  | "Healthcare"
  | "Finance"
  | "Education"
  | "Manufacturing"
  | "Retail"
  | "Services"
  | "Entertainment"
  | "Transportation"
  | "Construction"
  | "Agriculture"
  | "Energy"
  | "Other";

// src/features/company/types/companyProfileTypes.ts
export type UpdateProfileInput = {
  companyName?: string;
  username?: string;
  about?: string;
  industryType?: string;
  foundedYear?: number;
  website?: string;
  location?: string;
  companySize?: number;
};

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type ProfileImageInput = {
  imageUrl: string;
};
