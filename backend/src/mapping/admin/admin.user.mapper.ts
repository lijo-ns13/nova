import { UserSummaryDTO } from "../../dtos/response/admin/admin.user.response.dto";
import { IUser } from "../../models/user.modal";

export class UserMapper {
  static toSummaryDTO(user: IUser): UserSummaryDTO {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture || null,
      isBlocked: user.isBlocked,
    };
  }
}
