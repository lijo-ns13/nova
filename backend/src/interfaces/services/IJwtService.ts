import { Secret } from "jsonwebtoken";
import { JwtPayload } from "../../shared/util/jwt.service";

export interface IJWTService {
  signToken(payload: JwtPayload, secret: Secret, expiresIn: any): string;

  verifyToken(token: string, secret: Secret): JwtPayload | null;

  decodeToken(token: string): JwtPayload | null;

  generateAccessToken(
    role: "user" | "admin" | "company",
    payload: JwtPayload
  ): string;

  generateRefreshToken(
    role: "user" | "admin" | "company",
    payload: JwtPayload
  ): string;

  verifyAccessToken(
    role: "user" | "admin" | "company",
    token: string
  ): JwtPayload | null;

  verifyRefreshToken(
    role: "user" | "admin" | "company",
    token: string
  ): JwtPayload | null;
}
