import axios from "axios";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IUserGoogleService } from "../../interfaces/services/IUserGoogleService";
import { IJWTService } from "../../interfaces/services/IJwtService";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { IUser } from "../../repositories/entities/user.entity";

// ENV variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;

@injectable()
export class UserGoogleService implements IUserGoogleService {
  constructor(
    @inject(TYPES.JWTService) private readonly _jwtService: IJWTService,
    @inject(TYPES.UserRepository) private readonly _userRepo: IUserRepository
  ) {}

  redirectToGoogle(): string {
    const scope = [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" ");

    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=${scope}`;
  }

  async handleGoogleCallback(code: string): Promise<{
    user: IUser;
    accessToken: string;
    refreshToken: string;
  }> {
    if (!code) {
      throw new Error("No code provided");
    }

    // Exchange code for tokens
    const { data } = await axios.post(
      `https://oauth2.googleapis.com/token`,
      null,
      {
        params: {
          code,
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: GOOGLE_REDIRECT_URI,
          grant_type: "authorization_code",
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = data.access_token;

    // Get user info from Google API
    const { data: userInfo } = await axios.get(
      `https://www.googleapis.com/oauth2/v2/userinfo`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const { email, name, id: googleId } = userInfo;

    // Generate unique username
    const username = await this.generateUniqueUsername(name);

    // Check for existing user by Google ID
    let user = await this._userRepo.findByGoogleId(googleId);

    if (!user) {
      // Check if user exists by email
      user = await this._userRepo.findByEmail(email);

      if (user) {
        // Update existing user with Google ID
        user = await this._userRepo.update(user._id.toString(), { googleId });
      } else {
        // Create new user
        user = await this._userRepo.createUser({
          googleId,
          email,
          name,
          username,
        });
      }
    }

    if (!user) {
      throw new Error("Failed to create or update user");
    }

    // Generate tokens
    const accessTokenGen = this._jwtService.generateAccessToken("user", {
      id: user._id.toString(),
      email: user.email,
      role: "user",
    });

    const refreshTokenGen = this._jwtService.generateRefreshToken("user", {
      id: user._id.toString(),
      email: user.email,
      role: "user",
    });

    return { user, accessToken: accessTokenGen, refreshToken: refreshTokenGen };
  }

  private async generateUniqueUsername(name: string): Promise<string> {
    const baseUsername = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 20);
    let username = baseUsername;
    let counter = 1;

    while (await this._userRepo.isUsernameTaken(username, "")) {
      username = `${baseUsername}${counter}`;
      counter++;
    }

    return username;
  }
  async refreshAccessToken(
    refreshToken: string
  ): Promise<{ accessToken: string }> {
    if (!refreshToken) {
      throw new Error("No refresh token provided");
    }

    const decoded = this._jwtService.verifyRefreshToken("user", refreshToken);
    if (!decoded) {
      throw new Error("Invalid or expired refresh token");
    }

    const user = await this._userRepo.findById(decoded.id);
    if (!user) {
      throw new Error("User not found");
    }

    const newAccessToken = this._jwtService.generateAccessToken("user", {
      id: user._id.toString(),
      email: user.email,
      role: "user",
    });

    return { accessToken: newAccessToken };
  }

  async getUserFromAccessToken(token: string): Promise<IUser> {
    if (!token) {
      throw new Error("No access token provided");
    }

    const decoded = this._jwtService.verifyAccessToken("user", token);
    if (!decoded) {
      throw new Error("Invalid access token");
    }

    const user = await this._userRepo.findById(decoded.id);
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async refreshUser(refreshToken: string): Promise<{
    user: IUser;
    accessToken: string;
  }> {
    if (!refreshToken) {
      throw new Error("No refresh token provided");
    }

    const decoded = this._jwtService.verifyRefreshToken("user", refreshToken);
    if (!decoded) {
      throw new Error("Invalid or expired refresh token");
    }

    const user = await this._userRepo.findById(decoded.id);
    if (!user) {
      throw new Error("User not found");
    }

    const newAccessToken = this._jwtService.generateAccessToken("user", {
      id: user._id.toString(),
      email: user.email,
      role: "user",
    });

    return { user, accessToken: newAccessToken };
  }

  //   private async generateUniqueUsername(name: string): Promise<string> {
  //     const baseUsername = name
  //       .toLowerCase()
  //       .replace(/[^a-z0-9]/g, "")
  //       .slice(0, 20);
  //     let username = baseUsername;
  //     let counter = 1;

  //     while (await this._userRepo.isUsernameTaken(username, "")) {
  //       username = `${baseUsername}${counter}`;
  //       counter++;
  //     }

  //     return username;
  //   }
}
