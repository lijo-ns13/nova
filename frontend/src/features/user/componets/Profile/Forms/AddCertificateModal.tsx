import { useState, useRef } from "react";
import BaseModal from "../../modals/BaseModal";
import { uploadToCloudinary } from "../../../../company/services/cloudinaryService";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { addCertificate } from "../../../services/ProfileService";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import { CropIcon, Upload, X } from "lucide-react";
import BigModal from "../../modals/BigModal";
import toast from "react-hot-toast";
interface AddCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCertificateAdded: () => void;
}

interface CertificateFormData {
  title: string;
  issuer: string;
  issueDate: string;
  expirationDate: string;
  certificateUrl: string;
  certificateImageUrl: string;
  description?: string;
}

export default function AddCertificateModal({
  isOpen,
  onClose,
  onCertificateAdded,
}: AddCertificateModalProps) {
  const { id } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState<CertificateFormData>({
    title: "",
    issuer: "",
    issueDate: "",
    expirationDate: "",
    certificateUrl: "",
    certificateImageUrl: "",
    description: "",
  });

  const [uploading, setUploading] = useState(false);
  const [srcImage, setSrcImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  });
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSrcImage(reader.result as string);
      setIsCropping(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = () => {
    if (!imageRef.current || !crop.width || !crop.height) return;

    const canvas = document.createElement("canvas");
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(
      imageRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      setUploading(true);
      try {
        const url = await uploadToCloudinary(blob);
        console.log("url", url);
        setFormData((prev) => ({
          ...prev,
          certificateImageUrl: url,
        }));
        setIsCropping(false);
        setSrcImage(null);
      } catch (error) {
        console.error("Image upload failed:", error);
      } finally {
        setUploading(false);
      }
    });
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      certificateImageUrl: "",
    }));
    setSrcImage(null);
    setIsCropping(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCertificate(id, formData);
      toast.success("new certificate added")
      onCertificateAdded();
      onClose();
      setFormData({
        title: "",
        issuer: "",
        issueDate: "",
        expirationDate: "",
        certificateUrl: "",
        certificateImageUrl: "",
        description: "",
      });
    } catch (error) {
      toast.error("failed to add certificate")
      console.error("Failed to submit form:", error);
    }
  };

  return (
    <BigModal isOpen={isOpen} onClose={onClose} title="Add Certificate">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="title"
          placeholder="Certificate Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="issuer"
          placeholder="Issuer"
          value={formData.issuer}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="date"
          name="issueDate"
          value={formData.issueDate}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="date"
          name="expirationDate"
          value={formData.expirationDate}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="url"
          name="certificateUrl"
          placeholder="Certificate URL"
          value={formData.certificateUrl}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        {/* Image Upload Section */}
        <div className="mt-4">
          <label className="block mb-2 font-medium">Certificate Image</label>

          {!isCropping && !formData.certificateImageUrl && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <label className="cursor-pointer flex flex-col items-center">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500 mb-2">
                  Click to upload an image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-1 rounded text-sm"
                  onClick={() => document.querySelector('input[type="file"]')}
                >
                  Select Image
                </button>
              </label>
            </div>
          )}

          {isCropping && srcImage && (
            <div className="border rounded-lg p-4">
              <div className="mb-2 flex justify-between items-center">
                <span className="font-medium flex items-center">
                  <CropIcon className="h-4 w-4 mr-1" /> Crop Image
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsCropping(false);
                    setSrcImage(null);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
                <img
                  src={srcImage}
                  ref={imageRef}
                  alt="Image to crop"
                  className="max-w-full"
                />
              </ReactCrop>

              <div className="flex justify-end mt-2 space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCropping(false);
                    setSrcImage(null);
                  }}
                  className="bg-gray-300 px-3 py-1 rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCropComplete}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                >
                  Apply Crop
                </button>
              </div>
            </div>
          )}

          {formData.certificateImageUrl && !isCropping && (
            <div className="relative border rounded-lg p-2">
              <img
                src={formData.certificateImageUrl}
                alt="Certificate Preview"
                className="w-full h-auto max-h-48 object-contain"
              />
              <div className="absolute top-2 right-2 flex space-x-1">
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
                {/* <button
                    type="button"
                    onClick={() => {
                      setSrcImage(formData.certificateImageUrl);
                      setIsCropping(true);
                    }}
                    className="bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600"
                    title="Re-crop image"
                  >
                    <CropIcon className="h-4 w-4" />
                  </button> */}
              </div>
            </div>
          )}

          {uploading && (
            <div className="mt-2 text-center">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-1"></div>
              <span className="text-sm text-gray-600">Uploading image...</span>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="bg-green-600 text-white px-4 py-2 rounded w-full disabled:bg-green-400"
        >
          Add Certificate
        </button>
      </form>
    </BigModal>
  );
}
