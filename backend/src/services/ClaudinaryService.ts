import { inject, injectable } from "inversify";
import { v2 as cloudinary } from "cloudinary";
import { IUserRepository } from "../interfaces/repositories/IUserRepository";
import { ICompanyRepository } from "../interfaces/repositories/ICompanyRepository";
import { TYPES } from "../di/types";

export interface ICloudinaryService {
  generateSignedUrl(publicId: string): Promise<string>;
  uploadFile(buffer: Buffer, folder: string, userId: string): Promise<string>;
}
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});
@injectable()
export class CloudinaryService implements ICloudinaryService {
  constructor(
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository,
    @inject(TYPES.CompanyRepository) private _companyRepo: ICompanyRepository
  ) {}

  async generateSignedUrl(publicId: string): Promise<string> {
    const expiresAt = Math.floor(Date.now() / 1000) + 60 * 5;
    return cloudinary.url(publicId, {
      type: "authenticated",
      sign_url: true,
      secure: true,
      expires_at: expiresAt,
    });
  }

  async uploadFile(
    buffer: Buffer,
    folder: string,
    userId: string
  ): Promise<string> {
    const publicId = await new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          type: "authenticated",
          resource_type: "auto",
        },
        (error, result) => {
          if (error || !result)
            return reject(error || new Error("Upload failed"));
          resolve(result.public_id); // return only publicId
        }
      );
      uploadStream.end(buffer);
    });

    // 🧠 Determine whether it's a user or a company, then update
    await this._handleUploadSave(userId, publicId, "profilePicture");

    return publicId;
  }

  private async _handleUploadSave(
    id: string,
    publicId: string,
    field: string
  ): Promise<void> {
    const user = await this._userRepo.findById(id);
    if (user) {
      await this._userRepo.updateUser(id, { [field]: publicId });
      return;
    }

    const company = await this._companyRepo.findById(id);
    if (company) {
      await this._companyRepo.update(id, { [field]: publicId });
      return;
    }

    throw new Error("Neither user nor company found with the provided ID");
  }
}
