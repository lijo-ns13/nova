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
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching signed media URL:", error);
      throw error;
    }
  }

  async streamMediaById(mediaId: string): Promise<Response> {
    try {
      const response = await fetch(`${MEDIA_URL}/media/view`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaId }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to stream media: ${errorText}`);
      }

      return response;
    } catch (err) {
      console.error("Error streaming media:", err);
      throw err;
    }
  }
}

export const mediaService = new MediaService();
