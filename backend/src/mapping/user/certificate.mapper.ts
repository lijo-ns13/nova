import { CertificateResponseDTO } from "../../core/dtos/user/certificate.dto";
import { IUserCertificate } from "../../repositories/entities/certificate.entity";

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
