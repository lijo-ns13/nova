// controllers/UserGoogleController.ts
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { handleControllerError } from "../../utils/errorHandler";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { IUserGoogleService } from "../../interfaces/services/IUserGoogleService";
import { IUserGoogleController } from "../../interfaces/controllers/IUserGoogleController";

@injectable()
export class UserGoogleController implements IUserGoogleController {
  constructor(
    @inject(TYPES.UserGoogleService)
    private readonly _userGoogleService: IUserGoogleService
  ) {}

  redirectToGoogle(req: Request, res: Response): void {
    try {
      const authUrl = this._userGoogleService.redirectToGoogle();
      res.redirect(authUrl);
    } catch (err) {
      handleControllerError(err, res);
    }
  }

  handleGoogleCallback = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const code = req.query.code as string;

    try {
      const { accessToken, refreshToken } =
        await this._userGoogleService.handleGoogleCallback(code);

      // Set cookies
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Redirect to frontend with access token
      res.redirect(
        `${process.env.FRONTEND_URL}/oauth-success?token=${accessToken}`
      );
    } catch (error: any) {
      console.error("Error in Google OAuth callback:", error.message);
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: "Authentication failed", error: error.message });
    }
  };
  refreshAccessToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const refreshToken = req.cookies.refreshToken;

    try {
      const { accessToken } = await this._userGoogleService.refreshAccessToken(
        refreshToken
      );

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ message: "Access token refreshed" });
    } catch (error: any) {
      console.error("Error refreshing token:", error.message);
      res
        .status(HTTP_STATUS_CODES.UNAUTHORIZED)
        .json({ message: error.message });
    }
  };

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.accessToken;
      const user = await this._userGoogleService.getUserFromAccessToken(token);

      res.json({
        name: user.name,
        email: user.email,
        role: "user",
        user,
      });
    } catch (error: any) {
      console.error("Error getting user info:", error.message);
      res
        .status(
          error.message === "User not found"
            ? HTTP_STATUS_CODES.NOT_FOUND
            : HTTP_STATUS_CODES.UNAUTHORIZED
        )
        .json({ message: error.message });
    }
  };

  refreshUser = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    try {
      const { user, accessToken } = await this._userGoogleService.refreshUser(
        refreshToken
      );

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.status(HTTP_STATUS_CODES.OK).json({
        name: user.name,
        email: user.email,
        role: "user",
        profileImage: user.profilePicture || "",
      });
    } catch (error: any) {
      console.error("Error in /refresh-user:", error.message);
      res
        .status(
          error.message === "User not found"
            ? HTTP_STATUS_CODES.NOT_FOUND
            : HTTP_STATUS_CODES.UNAUTHORIZED
        )
        .json({ message: error.message });
    }
  };
}
