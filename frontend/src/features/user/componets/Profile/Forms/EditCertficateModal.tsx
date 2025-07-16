// import { useEffect, useRef, useState } from "react";
// import BigModal from "../../modals/BigModal";
// import { uploadToCloudinary } from "../../../../company/services/CloudinaryNormalService";
// import { editCertificate } from "../../../services/ProfileService";
// import { useAppSelector } from "../../../../../hooks/useAppSelector";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import toast from "react-hot-toast";
// import { X, CropIcon, Upload } from "lucide-react";
// import ReactCrop, { Crop } from "react-image-crop";
// import "react-image-crop/dist/ReactCrop.css";

// import {
//   UpdateCertificateInputDTO,
//   UpdateCertificateInputSchema,
// } from "../../../schema/certificateSchema";
// import { handleApiError } from "../../../../../utils/apiError";
// import { CertificateResponseDTO } from "../../../dto/certificateResponse.dto";

// interface EditCertificateModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   certificate: CertificateResponseDTO;
//   onCertificateUpdated: () => void;
// }

// export default function EditCertificateModal({
//   isOpen,
//   onClose,
//   certificate,
//   onCertificateUpdated,
// }: EditCertificateModalProps) {
//   const { id } = useAppSelector((state) => state.auth);

//   const [srcImage, setSrcImage] = useState<string | null>(null);
//   const [isCropping, setIsCropping] = useState(false);
//   const [uploading, setUploading] = useState(false);

//   const imageRef = useRef<HTMLImageElement | null>(null);
//   const [crop, setCrop] = useState<Crop>({
//     unit: "%",
//     x: 25,
//     y: 25,
//     width: 50,
//     height: 50,
//   });

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     reset,
//     watch,
//     setError,
//     formState: { errors },
//   } = useForm<UpdateCertificateInputDTO>({
//     resolver: zodResolver(UpdateCertificateInputSchema),
//     defaultValues: {
//       title: "",
//       issuer: "",
//       issueDate: "",
//       expirationDate: "",
//       certificateUrl: "",
//       certificateImageUrl: "",
//     },
//   });

//   useEffect(() => {
//     if (certificate) {
//       reset({
//         title: certificate.title,
//         issuer: certificate.issuer,
//         issueDate: certificate.issueDate.split("T")[0],
//         expirationDate: certificate.expirationDate?.split("T")[0] ?? "",
//         certificateUrl: certificate.certificateUrl ?? "",
//         certificateImageUrl: certificate.certificateImageUrl,
//       });
//     }
//   }, [certificate, reset]);

//   const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = () => {
//       setSrcImage(reader.result as string);
//       setIsCropping(true);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleCropComplete = () => {
//     if (!imageRef.current || !crop.width || !crop.height) return;

//     const canvas = document.createElement("canvas");
//     const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
//     const scaleY = imageRef.current.naturalHeight / imageRef.current.height;

//     canvas.width = crop.width * scaleX;
//     canvas.height = crop.height * scaleY;

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     ctx.drawImage(
//       imageRef.current,
//       crop.x * scaleX,
//       crop.y * scaleY,
//       crop.width * scaleX,
//       crop.height * scaleY,
//       0,
//       0,
//       crop.width * scaleX,
//       crop.height * scaleY
//     );

//     canvas.toBlob(async (blob) => {
//       if (!blob) return;
//       setUploading(true);
//       try {
//         const url = await uploadToCloudinary(blob);
//         setValue("certificateImageUrl", url);
//         setIsCropping(false);
//         setSrcImage(null);
//       } catch (error) {
//         toast.error("Image upload failed");
//         console.error(error);
//       } finally {
//         setUploading(false);
//       }
//     });
//   };

//   const handleRemoveImage = () => {
//     setValue("certificateImageUrl", "");
//     setSrcImage(null);
//     setIsCropping(false);
//   };

//   const onSubmit = async (data: UpdateCertificateInputDTO) => {
//     try {
//       await editCertificate(id, certificate.id, data);
//       toast.success("Certificate updated successfully");
//       onCertificateUpdated();
//       handleClose();
//     } catch (err) {
//       const parsed = handleApiError(err, "Failed to update certificate");
//       toast.error(parsed.message);
//       if (parsed.errors) {
//         for (const [key, value] of Object.entries(parsed.errors)) {
//           setError(key as keyof UpdateCertificateInputDTO, {
//             type: "manual",
//             message: value,
//           });
//         }
//       }
//     }
//   };

//   const handleClose = () => {
//     reset();
//     setSrcImage(null);
//     setIsCropping(false);
//     onClose();
//   };

//   return (
//     <BigModal isOpen={isOpen} onClose={handleClose} title="Edit Certificate">
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <input
//           {...register("title")}
//           placeholder="Certificate Title"
//           className="w-full border px-3 py-2 rounded"
//         />
//         {errors.title && (
//           <p className="text-red-500 text-sm">{errors.title.message}</p>
//         )}

//         <input
//           {...register("issuer")}
//           placeholder="Issuer"
//           className="w-full border px-3 py-2 rounded"
//         />
//         {errors.issuer && (
//           <p className="text-red-500 text-sm">{errors.issuer.message}</p>
//         )}

//         <input
//           type="date"
//           {...register("issueDate")}
//           className="w-full border px-3 py-2 rounded"
//         />
//         {errors.issueDate && (
//           <p className="text-red-500 text-sm">{errors.issueDate.message}</p>
//         )}

//         <input
//           type="date"
//           {...register("expirationDate")}
//           className="w-full border px-3 py-2 rounded"
//         />
//         {errors.expirationDate && (
//           <p className="text-red-500 text-sm">
//             {errors.expirationDate.message}
//           </p>
//         )}

//         <input
//           {...register("certificateUrl")}
//           placeholder="Certificate URL"
//           className="w-full border px-3 py-2 rounded"
//         />
//         {errors.certificateUrl && (
//           <p className="text-red-500 text-sm">
//             {errors.certificateUrl.message}
//           </p>
//         )}

//         {/* Image Upload */}
//         <div>
//           <label className="font-medium text-sm block mb-2">
//             Certificate Image
//           </label>
//           {!isCropping && !watch("certificateImageUrl") && (
//             <label className="cursor-pointer border-dashed border-2 rounded p-4 flex flex-col items-center">
//               <Upload className="h-8 w-8 text-gray-400 mb-2" />
//               <span className="text-sm text-gray-500 mb-2">
//                 Click to upload an image
//               </span>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageSelect}
//                 className="hidden"
//               />
//             </label>
//           )}

//           {isCropping && srcImage && (
//             <div className="p-4 border rounded">
//               <div className="flex justify-between items-center mb-2">
//                 <span className="font-medium flex items-center">
//                   <CropIcon className="h-4 w-4 mr-1" /> Crop Image
//                 </span>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setIsCropping(false);
//                     setSrcImage(null);
//                   }}
//                   className="text-red-500"
//                 >
//                   <X className="h-5 w-5" />
//                 </button>
//               </div>
//               <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
//                 <img
//                   src={srcImage}
//                   ref={imageRef}
//                   alt="Preview"
//                   className="max-w-full"
//                 />
//               </ReactCrop>
//               <div className="flex justify-end mt-2">
//                 <button
//                   type="button"
//                   onClick={handleCropComplete}
//                   className="bg-green-600 text-white px-3 py-1 rounded"
//                 >
//                   Apply Crop
//                 </button>
//               </div>
//             </div>
//           )}

//           {watch("certificateImageUrl") && !isCropping && (
//             <div className="relative mt-2 border rounded">
//               <img
//                 src={watch("certificateImageUrl")}
//                 alt="Certificate"
//                 className="w-full max-h-48 object-contain"
//               />
//               <button
//                 type="button"
//                 onClick={handleRemoveImage}
//                 className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </div>
//           )}

//           {uploading && (
//             <p className="text-sm text-gray-500 mt-2">Uploading image...</p>
//           )}

//           {errors.certificateImageUrl && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.certificateImageUrl.message}
//             </p>
//           )}
//         </div>

//         <button
//           type="submit"
//           disabled={uploading}
//           className="bg-indigo-600 text-white px-4 py-2 rounded w-full disabled:bg-indigo-400"
//         >
//           Update Certificate
//         </button>
//       </form>
//     </BigModal>
//   );
// }
