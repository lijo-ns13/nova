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
