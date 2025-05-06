// src/infrastructure/database/repositories/mongo/CompanyRepository.ts
import { inject, injectable } from "inversify";
import { Model } from "mongoose";
import { ICompanyRepository } from "../../core/interfaces/repositories/ICompanyRepository";
import companyModal, { ICompany } from "../../models/company.modal";
import { BaseRepository } from "./BaseRepository";
import { TYPES } from "../../di/types";

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

  async findCompaniesByFilter(
    filter: Record<string, any>,
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;

    const companies = await companyModal
      .find({ isVerified: false, verificationStatus: "pending" })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalCompanies = await companyModal.countDocuments(filter);

    return { companies, totalCompanies };
  }
}
