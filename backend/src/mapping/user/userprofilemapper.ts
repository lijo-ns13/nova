import { GetUserProfileResponseDTO } from "../../core/dtos/user/getuserresponse.dto";
import { IUser } from "../../models/user.modal";
export class UserProfileMapper {
  static toProfileDTO(
    user: IUser,
    signedProfilePictureUrl?: string
  ): GetUserProfileResponseDTO {
    return {
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      headline: user.headline || "",
      about: user.about || "",
      profilePicture: signedProfilePictureUrl || null, // signed URL injected here
      skills: user.skills.map((id) => id.toString()),
      certifications: user.certifications.map((id) => id.toString()),
      experiences: user.experiences.map((id) => id.toString()),
      educations: user.educations.map((id) => id.toString()),
      projects: user.projects.map((id) => id.toString()),
      followersCount: user.followers.length,
      followingCount: user.following.length,
      appliedJobs: user.appliedJobs.map((id) => id.toString()),
      savedJobs: user.savedJobs.map((id) => id.toString()),
      appliedJobCount: user.appliedJobCount || 0,
      createdPostCount: user.createdPostCount || 0,
    };
  }
}
