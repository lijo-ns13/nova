import { z } from "zod";
import { ITempCompany } from "../../../repositories/entities/temp.comany.entity";

export const TempCompanyResponseSchema = z.object({
  id: z.string(),
  companyName: z.string(),
  email: z.string().email(),
  industryType: z.string(),
  foundedYear: z.number(),
  location: z.string(),
  documents: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TempCompanyResponseDTO = z.infer<typeof TempCompanyResponseSchema>;
// src/core/mappers/TempCompanyMapper.ts

export class TempCompanyMapper {
  static toDTO(tempCompany: ITempCompany): TempCompanyResponseDTO {
    return {
      id: tempCompany._id.toString(),
      companyName: tempCompany.companyName,
      email: tempCompany.email,
      industryType: tempCompany.industryType,
      foundedYear: tempCompany.foundedYear,
      location: tempCompany.location,
      documents: tempCompany.documents,
      createdAt: tempCompany.createdAt.toISOString(),
      updatedAt: tempCompany.updatedAt.toISOString(),
    };
  }
}
