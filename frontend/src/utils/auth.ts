import { jwtDecode } from "jwt-decode";

interface JWTPayload {
  exp: number;
}

export const isExpired = (token: string | null): boolean => {
  if (!token) return true; // No token? Consider it expired.
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Invalid token:", error);
    return true; // If decoding fails, treat as expired
  }
};
