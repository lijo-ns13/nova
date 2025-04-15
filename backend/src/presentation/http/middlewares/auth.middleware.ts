// src/middlewares/auth.middleware.ts
import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";
import { JWTService } from "../../../shared/util/jwt.service";
import { HTTP_STATUS_CODES } from "../../../core/enums/httpStatusCode";
import { IAuthMiddleware } from "../../../core/interfaces/middlewares/IAuthMiddleware";

@injectable()
export class AuthMiddleware implements IAuthMiddleware {
  constructor(
    @inject(JWTService) private jwtService: JWTService // If JWTService is also injected
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
}
