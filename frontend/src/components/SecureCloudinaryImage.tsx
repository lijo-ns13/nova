// // components/SecureImage.tsx
// import React, { useEffect, useState } from "react";
// import userAxios from "../utils/userAxios";
// import { cloudinaryService } from "../services/cloudinaryService";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// // const DEFAULT_IMAGE_URL = "././assets/default.png"; // Path to your default image
// const DEFAULT_IMAGE_URL = "/default.png";

// interface SecureImageProps {
//   publicId: string;
//   alt?: string;
//   className?: string;
//   width?: number;
//   height?: number;
//   style?: React.CSSProperties;
//   onClick?: () => void;
// }

// export const SecureCloudinaryImage: React.FC<SecureImageProps> = ({
//   publicId,
//   alt = "Image",
//   className = "",
//   width,
//   height,
//   style,
//   onClick,
// }) => {
//   const [imageUrl, setImageUrl] = useState<string>("");

//   useEffect(() => {
//     if (!publicId) {
//       setImageUrl(DEFAULT_IMAGE_URL);
//       return;
//     }

//     const fetchImage = async () => {
//       try {
//         const { url } = await cloudinaryService.getMediaUrl(publicId);
//         setImageUrl(url || DEFAULT_IMAGE_URL);
//       } catch (error) {
//         console.error("Failed to load secure image", error);
//         setImageUrl(DEFAULT_IMAGE_URL);
//       }
//     };

//     fetchImage();
//   }, [publicId]);

//   if (!imageUrl) {
//     return (
//       <div
//         className={`bg-gray-200 animate-pulse ${className}`}
//         style={{ width, height, ...style }}
//       />
//     );
//   }

//   return (
//     <img
//       src={imageUrl}
//       alt={alt}
//       className={className}
//       width={width}
//       height={height}
//       style={style}
//       loading="lazy"
//       onClick={onClick}
//     />
//   );
// };
