// src/services/jwt.service.ts
import jwt, { Secret } from "jsonwebtoken";
import { injectable } from "inversify";
import { JWT_SECRETS } from "./jwt.constants";
import { IJWTService } from "../../core/interfaces/services/IJwtService";

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

@injectable()
export class JWTService implements IJWTService {
  signToken(payload: JwtPayload, secret: Secret, expiresIn: any): string {
    return jwt.sign(payload, secret, { expiresIn });
  }

  verifyToken(token: string, secret: Secret): JwtPayload | null {
    try {
      return jwt.verify(token, secret) as JwtPayload;
    } catch (err) {
      console.log("Token verification failed", err);
      return null;
    }
  }

  decodeToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch (err) {
      console.log("Token decoding failed", err);
      return null;
    }
  }

  generateAccessToken(role: "user" | "admin" | "company", payload: JwtPayload) {
    const { access, accessExpiry } = this.getSecret(role);
    return this.signToken(payload, access, accessExpiry);
  }

  generateRefreshToken(
    role: "user" | "admin" | "company",
    payload: JwtPayload
  ) {
    const { refresh, refreshExpiry } = this.getSecret(role);
    return this.signToken(payload, refresh, refreshExpiry);
  }

  verifyAccessToken(
    role: "user" | "admin" | "company",
    token: string
  ): JwtPayload | null {
    const { access } = this.getSecret(role);
    return this.verifyToken(token, access);
  }

  verifyRefreshToken(
    role: "user" | "admin" | "company",
    token: string
  ): JwtPayload | null {
    const { refresh } = this.getSecret(role);
    return this.verifyToken(token, refresh);
  }

  private getSecret(role: "user" | "admin" | "company") {
    const secrets = JWT_SECRETS[role];
    if (!secrets) throw new Error(`Unknown role: ${role}`);
    return {
      access: secrets.access,
      refresh: secrets.refresh,
      accessExpiry: secrets.accessExpiry,
      refreshExpiry: secrets.refreshExpiry,
    };
  }
}
