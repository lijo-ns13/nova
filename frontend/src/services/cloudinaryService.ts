// services/cloudinaryService.ts
import companyAxios from "../utils/companyAxios";
import userAxios from "../utils/userAxios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface SecureMediaResponse {
  url: string;
  mimeTYpe: string;
}

class CloudinaryService {
  async getMediaUrl(publicId: string): Promise<SecureMediaResponse> {
    try {
      const res = await userAxios.get<SecureMediaResponse>(
        `${API_BASE_URL}/cloudinary/media/${publicId}`,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      console.error("Failed to load secure image", error);
      throw error;
    }
  }
}

export const cloudinaryService = new CloudinaryService();
