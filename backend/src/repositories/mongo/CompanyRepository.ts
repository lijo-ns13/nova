import { inject, injectable } from "inversify";
import { Model } from "mongoose";
import { ICompanyRepository } from "../../interfaces/repositories/ICompanyRepository";
import { BaseRepository } from "./BaseRepository";
import { TYPES } from "../../di/types";
import bcrypt from "bcryptjs";
import { ICompany } from "../entities/company.entity";
import companyModel from "../models/company.model";
@injectable()
export class CompanyRepository
  extends BaseRepository<ICompany>
  implements ICompanyRepository
{
  constructor(@inject(TYPES.CompanyModel) companyModel: Model<ICompany>) {
    super(companyModel);
  }

  // In CompanyRepository
  async findByEmail(email: string): Promise<ICompany | null> {
    return companyModel.findOne({ email }).select("+password").exec(); // Include password
  }

  async findByGoogleId(googleId: string): Promise<ICompany | null> {
    return companyModel.findOne({ googleId }).exec();
  }
  async findById(companyId: string) {
    return companyModel.findById(companyId);
  }
  async updatePassword(companyId: string, newPassword: string): Promise<void> {
    await companyModel.findByIdAndUpdate(companyId, { password: newPassword });
  }
  async updateCompany(companyId: string, updateData: any) {
    return companyModel.findByIdAndUpdate(companyId, updateData, { new: true });
  }
  async deleteCompany(companyId: string) {
    const data = await companyModel.findById(companyId);
    if (data) {
      await companyModel.findOneAndDelete({ email: data.email });
    }
    return companyModel.findByIdAndDelete(companyId);
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

    const companies = await companyModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .select("-password") // Exclude password field
      .exec();

    const totalCompanies = await companyModel.countDocuments(query);

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
      companyModel.find(filter).skip(skip).limit(limit).exec(),
      companyModel.countDocuments(filter),
    ]);

    return { companies, totalCompanies };
  }
  async changePassword(
    companyId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    const company = await companyModel.findById(companyId).select("+password");
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
    return await companyModel.findById(companyId);
  }
  // Update Profile Image
  async updateProfileImage(
    companyId: string,
    imageUrl: string
  ): Promise<ICompany | null> {
    return await companyModel.findByIdAndUpdate(
      companyId,
      { profilePicture: imageUrl },
      { new: true }
    );
  }

  //  Delete Profile Image
  async deleteProfileImage(companyId: string): Promise<boolean> {
    return (
      (await companyModel.findByIdAndUpdate(companyId, {
        profilePicture: null,
      })) !== null
    );
  }
  async updateCompanyProfile(
    companyId: string,
    data: Partial<ICompany>
  ): Promise<ICompany | null> {
    return await companyModel.findByIdAndUpdate(companyId, data, { new: true });
  }
  async isUsernameTaken(
    username: string,
    excludeCompanyId?: string
  ): Promise<boolean> {
    const existingUser = await companyModel.findOne({
      username,
      _id: { $ne: excludeCompanyId }, // exclude the current user
    });
    return !!existingUser;
  }
  async getCompanyProfileWithDetails(
    companyId: string
  ): Promise<ICompany | null> {
    return companyModel.findById(companyId); // or populate if needed
  }
}
