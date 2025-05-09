// src/middlewares/auth.middleware.ts
import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS_CODES } from "../core/enums/httpStatusCode";
import { IAuthMiddleware } from "../interfaces/middlewares/IAuthMiddleware";
import { IJWTService } from "../interfaces/services/IJwtService";
import { TYPES } from "../di/types";
import { IUserService } from "../interfaces/services/IUserService";
import { ICompanyService } from "../interfaces/services/ICompanyService";
interface IUserr {
  id: string;
  email: string;
  role: "admin" | "company" | "user";
}
@injectable()
export class AuthMiddleware implements IAuthMiddleware {
  constructor(
    @inject(TYPES.JWTService) private jwtService: IJWTService,
    @inject(TYPES.UserService) private userService: IUserService,
    @inject(TYPES.CompanyService) private companyService: ICompanyService
  ) {}

  authenticate(role: "user" | "admin" | "company") {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;

        if (!accessToken) {
          res
            .status(HTTP_STATUS_CODES.UNAUTHORIZED)
            .json({ message: "Unauthorized: No access token" });
          return;
        }

        let decodedAccess = this.jwtService.verifyAccessToken(
          role,
          accessToken
        );
        let userPayload: { id: string; email: string; role: string } | null =
          null;

        if (!decodedAccess) {
          if (!refreshToken) {
            res
              .status(HTTP_STATUS_CODES.UNAUTHORIZED)
              .json({ message: "Unauthorized: No refresh token" });
            return;
          }

          const decodedRefresh = this.jwtService.verifyRefreshToken(
            role,
            refreshToken
          );
          if (!decodedRefresh) {
            res
              .status(HTTP_STATUS_CODES.UNAUTHORIZED)
              .json({ message: "Unauthorized: Invalid refresh token" });
            return;
          }

          const newAccessToken = this.jwtService.generateAccessToken(role, {
            id: decodedRefresh.id,
            email: decodedRefresh.email,
            role: decodedRefresh.role,
          });

          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000,
          });

          decodedAccess = this.jwtService.verifyAccessToken(
            role,
            newAccessToken
          );
          userPayload = decodedRefresh;
        } else {
          userPayload = decodedAccess;
        }

        if (!userPayload) {
          res
            .status(HTTP_STATUS_CODES.UNAUTHORIZED)
            .json({ message: "Unauthorized: Invalid token" });
          return;
        }

        req.user = {
          id: userPayload.id,
          email: userPayload.email,
          role: userPayload.role,
        };
        console.log("req user is authenticated", req.user);
        next();
      } catch (error) {
        console.error("Auth Middleware Error:", error);
        res
          .status(HTTP_STATUS_CODES.UNAUTHORIZED)
          .json({ message: "Unauthorized" });
        return;
      }
    };
  }
  authenticateMultiple(roles: ("user" | "admin" | "company")[]) {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;

        if (!accessToken) {
          res
            .status(HTTP_STATUS_CODES.UNAUTHORIZED)
            .json({ message: "Unauthorized: No access token" });
          return;
        }

        let decodedAccess = null;
        let userPayload = null;

        // Try verifying access token with each role
        for (const role of roles) {
          decodedAccess = this.jwtService.verifyAccessToken(role, accessToken);
          if (decodedAccess) break;
        }

        // If access token is invalid, try refresh
        if (!decodedAccess) {
          if (!refreshToken) {
            res
              .status(HTTP_STATUS_CODES.UNAUTHORIZED)
              .json({ message: "Unauthorized: No refresh token" });
            return;
          }

          for (const role of roles) {
            const decodedRefresh = this.jwtService.verifyRefreshToken(
              role,
              refreshToken
            );
            if (decodedRefresh) {
              const newAccessToken = this.jwtService.generateAccessToken(role, {
                id: decodedRefresh.id,
                email: decodedRefresh.email,
                role: decodedRefresh.role,
              });

              res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 60 * 60 * 1000,
              });

              decodedAccess = this.jwtService.verifyAccessToken(
                role,
                newAccessToken
              );
              userPayload = decodedRefresh;
              break;
            }
          }

          if (!decodedAccess) {
            res
              .status(HTTP_STATUS_CODES.UNAUTHORIZED)
              .json({ message: "Unauthorized: Invalid refresh token" });
            return;
          }
        } else {
          userPayload = decodedAccess;
        }

        if (!userPayload) {
          res
            .status(HTTP_STATUS_CODES.UNAUTHORIZED)
            .json({ message: "Unauthorized: Invalid token" });
          return;
        }

        req.user = {
          id: userPayload.id,
          email: userPayload.email,
          role: userPayload.role,
        };

        console.log("Authenticated user (multi-role):", req.user);
        next();
      } catch (error) {
        console.error("Multi-role Auth Middleware Error:", error);
        res
          .status(HTTP_STATUS_CODES.UNAUTHORIZED)
          .json({ message: "Unauthorized" });
      }
    };
  }

  // for block users /company at a time
  check() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const user = req.user as IUserr;

        if (!user) {
          res
            .status(HTTP_STATUS_CODES.UNAUTHORIZED)
            .json({ message: "Unauthorized: No user data" });
          return;
        }

        if (user.role === "user") {
          const dbUser = await this.userService.getUserData(user.id);
          if (!dbUser || dbUser.isBlocked) {
            res
              .status(HTTP_STATUS_CODES.FORBIDDEN)
              .json({ message: "Access denied: User is blocked" });
            return;
          }
        }

        if (user.role === "company") {
          const dbCompany = await this.companyService.getCompanyData(user.id);
          if (!dbCompany || dbCompany.isBlocked) {
            res
              .status(HTTP_STATUS_CODES.FORBIDDEN)
              .json({ message: "Access denied: Company is blocked" });
            return;
          }
        }

        next();
      } catch (error) {
        console.error("CheckBlockedMiddleware Error:", error);
        res
          .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json({ message: "Server error during block check" });
      }
    };
  }
}
