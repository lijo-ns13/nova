const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

console.log(cloudName, uploadPreset);

export const uploadToCloudinary = async (
  file: File | Blob
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  // Use environment variables for these values!
  formData.append("upload_preset", uploadPreset);
  formData.append("cloud_name", cloudName);
  // formData.append("resource_type", "raw");

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload file to Cloudinary");
    }

    const data = await response.json();
    return data.secure_url; // URL of the uploaded image
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
