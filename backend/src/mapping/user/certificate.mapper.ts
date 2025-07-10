// src/mapping/user/CertificateMapper.ts

import { CertificateResponseDTO } from "../../core/dtos/user/certificate.dto";
import { IUserCertificate } from "../../models/userCertificate.model";

export class CertificateMapper {
  static toDTO(certificate: IUserCertificate): CertificateResponseDTO {
    return {
      id: certificate._id.toString(),
      userId: certificate.userId.toString(),
      title: certificate.title,
      issuer: certificate.issuer,
      issueDate: certificate.issueDate.toISOString(),
      expirationDate: certificate.expirationDate?.toISOString(),
      certificateUrl: certificate.certificateUrl,
      certificateImageUrl: certificate.certificateImageUrl,
    };
  }
}
