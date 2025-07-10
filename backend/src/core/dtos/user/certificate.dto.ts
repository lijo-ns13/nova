// src/core/dtos/user/UserCertificate.dto.ts

export interface CreateCertificateInputDTO {
  title: string;
  issuer: string;
  issueDate: Date; // ISO string
  expirationDate?: Date; // ISO string (optional)
  certificateUrl?: string;
  certificateImageUrl: string;
}

export interface CertificateResponseDTO {
  id: string;
  userId: string;
  title: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  certificateUrl?: string;
  certificateImageUrl: string;
}
