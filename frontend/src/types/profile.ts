// Define TypeScript types for the profile data
export interface Experience {
  _id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string | null;
  description?: string;
}

export interface Education {
  _id: string;
  institutionName: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string | null;
  grade?: string;
  description?: string;
}

export interface Certification {
  _id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  certificateUrl?: string;
  certificateImageUrl?: string;
}

export interface Project {
  _id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string | null;
  projectUrl?: string;
  technologies: string[] | string; // Can be array or comma-separated string
}

export interface UserData {
  _id: string;
  name: string;
  username: string;
  headline?: string;
  profilePicture?: string;
  coverPhoto?: string;
  about?: string;
  location?: string;
  connections?: number;
  isVerified?: boolean;
  experiences?: Experience[];
  educations?: Education[];
  certifications?: Certification[];
  projects?: Project[];
}
