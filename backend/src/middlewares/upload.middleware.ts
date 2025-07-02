// middleware/uploadMiddleware.ts
import multer from "multer";

export const memoryUpload = multer({ storage: multer.memoryStorage() });
