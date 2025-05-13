// src/features/company/services/CompanyProfileService.ts

import companyAxios from "../../../utils/companyAxios";
import {
  UpdateProfileInput,
  ChangePasswordInput,
  ProfileImageInput,
} from "../types/company.types";

export interface CompanyProfile {
  id: string;
  companyName: string;
  username: string;
  email: string;
  about?: string;
  industryType: string;
  foundedYear: number;
  website?: string;
  location: string;
  companySize?: number;
  profileImage?: string;
}

export interface CompanyProfileDetails extends CompanyProfile {
  jobListingsCount: number;
  activeHiresCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CompanyProfileService = {
  async getCompanyProfile(): Promise<CompanyProfile> {
    try {
      const response = await companyAxios.get("/");
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to fetch company profile");
    }
  },

  async getCompanyProfileWithDetails(): Promise<CompanyProfileDetails> {
    try {
      const response = await companyAxios.get("/details");
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to fetch company profile details");
    }
  },

  async updateCompanyProfile(
    data: UpdateProfileInput
  ): Promise<CompanyProfile> {
    try {
      const response = await companyAxios.put("/", data);
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to update company profile");
    }
  },

  async updateProfileImage(data: ProfileImageInput): Promise<CompanyProfile> {
    try {
      const response = await companyAxios.put("/image", data);
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to update profile image");
    }
  },

  async deleteProfileImage(): Promise<void> {
    try {
      await companyAxios.delete("/image");
    } catch (error) {
      throw new Error("Failed to delete profile image");
    }
  },

  async changePassword(data: ChangePasswordInput): Promise<void> {
    try {
      await companyAxios.put("/change-password", data);
    } catch (error) {
      throw new Error("Failed to change password");
    }
  },
};

export default CompanyProfileService;
