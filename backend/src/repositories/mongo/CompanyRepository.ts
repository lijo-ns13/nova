// src/infrastructure/database/repositories/mongo/CompanyRepository.ts
import { inject, injectable } from "inversify";
import { Model } from "mongoose";
import { ICompanyRepository } from "../../interfaces/repositories/ICompanyRepository";
import companyModal, { ICompany } from "../../models/company.modal";
import { BaseRepository } from "./BaseRepository";
import { TYPES } from "../../di/types";
import bcrypt from "bcryptjs";
@injectable()
export class CompanyRepository
  extends BaseRepository<ICompany>
  implements ICompanyRepository
{
  constructor(@inject(TYPES.CompanyModal) companyModal: Model<ICompany>) {
    super(companyModal);
  }

  // In CompanyRepository
  async findByEmail(email: string): Promise<ICompany | null> {
    return companyModal.findOne({ email }).select("+password").exec(); // Include password
  }

  async findByGoogleId(googleId: string): Promise<ICompany | null> {
    return companyModal.findOne({ googleId }).exec();
  }
  async findById(companyId: string) {
    return companyModal.findById(companyId);
  }
  async updatePassword(companyId: string, newPassword: string): Promise<void> {
    await companyModal.findByIdAndUpdate(companyId, { password: newPassword });
  }
  async updateCompany(companyId: string, updateData: any) {
    return companyModal.findByIdAndUpdate(companyId, updateData, { new: true });
  }
  async deleteCompany(companyId: string) {
    const data = await companyModal.findById(companyId);
    if (data) {
      await companyModal.findOneAndDelete({ email: data.email });
    }
    return companyModal.findByIdAndDelete(companyId);
  }

  async findCompanies(page: number, limit: number, searchQuery?: string) {
    const skip = (page - 1) * limit;
    let query = {};

    if (searchQuery && searchQuery.trim()) {
      const regex = new RegExp(searchQuery, "i");
      query = {
        $or: [{ companyName: regex }, { email: regex }],
      };
    }

    const companies = await companyModal
      .find(query)
      .skip(skip)
      .limit(limit)
      .select("-password") // Exclude password field
      .exec();

    const totalCompanies = await companyModal.countDocuments(query);

    return { companies, totalCompanies };
  }

  // async findCompaniesByFilter(
  //   filter: Record<string, any>,
  //   page: number = 1,
  //   limit: number = 10
  // ) {
  //   const skip = (page - 1) * limit;

  //   const companies = await companyModal
  //     .find({ isVerified: false, verificationStatus: "pending" })
  //     .skip(skip)
  //     .limit(limit)
  //     .exec();

  //   const totalCompanies = await companyModal.countDocuments(filter);

  //   return { companies, totalCompanies };
  // }
  async getPendingVerificationCompanies(
    page: number = 1,
    limit: number = 10
  ): Promise<{ companies: ICompany[]; totalCompanies: number }> {
    const skip = (page - 1) * limit;

    const filter = { verificationStatus: "pending" as const };

    const [companies, totalCompanies] = await Promise.all([
      companyModal.find(filter).skip(skip).limit(limit).exec(),
      companyModal.countDocuments(filter),
    ]);

    return { companies, totalCompanies };
  }
  async changePassword(
    companyId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    const company = await companyModal.findById(companyId).select("+password");
    if (!company) throw new Error("User not found");
    if (!company.password)
      throw new Error("google users cant change there password");
    const isMatch = await bcrypt.compare(currentPassword, company.password);
    if (!isMatch) throw new Error("Current password is incorrect");

    company.password = newPassword;
    await company.save();
    return true;
  }
  async getCompanyProfile(companyId: string): Promise<ICompany | null> {
    return await companyModal.findById(companyId);
  }
  // Update Profile Image
  async updateProfileImage(
    companyId: string,
    imageUrl: string
  ): Promise<ICompany | null> {
    return await companyModal.findByIdAndUpdate(
      companyId,
      { profilePicture: imageUrl },
      { new: true }
    );
  }

  //  Delete Profile Image
  async deleteProfileImage(companyId: string): Promise<boolean> {
    return (
      (await companyModal.findByIdAndUpdate(companyId, {
        profilePicture: null,
      })) !== null
    );
  }
  async updateCompanyProfile(
    companyId: string,
    data: Partial<ICompany>
  ): Promise<ICompany | null> {
    return await companyModal.findByIdAndUpdate(companyId, data, { new: true });
  }
  async isUsernameTaken(
    username: string,
    excludeCompanyId?: string
  ): Promise<boolean> {
    const existingUser = await companyModal.findOne({
      username,
      _id: { $ne: excludeCompanyId }, // exclude the current user
    });
    return !!existingUser;
  }
  async getCompanyProfileWithDetails(
    companyId: string
  ): Promise<ICompany | null> {
    return companyModal.findById(companyId); // or populate if needed
  }
}
