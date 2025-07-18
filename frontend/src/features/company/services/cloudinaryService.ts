// // frontend cloudinaryService.ts
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// export const uploadToCloudinary = async (blob: Blob): Promise<string> => {
//   const formData = new FormData();
//   formData.append("file", blob);

//   try {
//     const response = await fetch(`${API_BASE_URL}/cloudinary/upload`, {
//       method: "POST",
//       body: formData,
//       credentials: "include",
//     });

//     const data = await response.json();
//     if (!response.ok) throw new Error(data.message || "Upload failed");

//     // Get the signed URL for the uploaded image
//     const signedUrlResponse = await fetch(
//       `${API_BASE_URL}/cloudinary/media/${data.publicId}`
//     );
//     const signedUrlData = await signedUrlResponse.json();

//     return signedUrlData.url;
//   } catch (error) {
//     console.error("Upload error:", error);
//     throw error;
//   }
// };
