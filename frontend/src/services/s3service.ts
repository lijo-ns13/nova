// services/mediaService.ts
import userAxios from "../utils/userAxios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const MEDIA_URL = `${API_BASE_URL}`; // Adjust if base path changes

export interface MediaResponse {
  url: string;
  mimeTYpe: string;
}

class MediaService {
  async getSignedMediaUrl(s3key: string): Promise<MediaResponse> {
    try {
      const res = await userAxios.get<MediaResponse>(
        `${MEDIA_URL}/media/view/${s3key}`,
        {
          withCredentials: true, // if protected by auth
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching signed media URL:", error);
      throw error;
    }
  }
}

export const mediaService = new MediaService();
