import axios from "axios";

import {
  Router,
  RequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";
import { JWTService } from "../shared/util/jwt.service";
import { HTTP_STATUS_CODES } from "../core/enums/httpStatusCode";
import userModel from "../repositories/models/user.model";

// ENV variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;

const router = Router();
const jwtService = new JWTService();
/**
 * Google OAuth: Redirect to Google consent screen
 */
router.get("/google", ((_req, res) => {
  const scope = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ].join(" ");

  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth` +
    `?client_id=${GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${GOOGLE_REDIRECT_URI}` +
    `&response_type=code&scope=${scope}`;

  return res.redirect(authUrl);
}) as RequestHandler);
async function generateUniqueUsername(baseName: string): Promise<string> {
  const baseUsername = baseName.toLowerCase().replace(/\s+/g, "");
  let username = baseUsername;
  let suffix = 1;

  while (await userModel.exists({ username })) {
    username = `${baseUsername}${suffix}`;
    suffix++;
  }

  return username;
}

/**
 * Google OAuth: Handle callback, exchange code for tokens, log in or sign up user
 */
router.get("/google/callback", (async (req: Request, res: Response) => {
  const code = req.query.code as string;

  if (!code) {
    return res
      .status(HTTP_STATUS_CODES.BAD_REQUEST)
      .json({ message: "No code provided" });
  }

  try {
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
    let username = await generateUniqueUsername(name);
    let user = await userModel.findOne({ googleId });

    if (!user) {
      user = await userModel.findOne({ email });

      if (user) {
        user.googleId = googleId;
        await user.save();
      } else {
        user = new userModel({ googleId, email, name, username });
        await user.save();
      }
    }

    // Generate tokens
    const accessTokenGen = jwtService.generateAccessToken("user", {
      id: user._id.toString(),
      email: user.email,
      role: "user",
    });

    const refreshTokenGen = jwtService.generateRefreshToken("user", {
      id: user._id.toString(),
      email: user.email,
      role: "user",
    });

    // Set cookies
    res.cookie("accessToken", accessTokenGen, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshTokenGen, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.redirect(
      `${process.env.FRONTEND_URL}/oauth-success?token=${accessToken}`
    );
  } catch (error: any) {
    console.error(
      "Error in Google OAuth callback:",
      error.response?.data || error.message
    );
    return res
      .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: "Authentication failed", error: error });
  }
}) as RequestHandler);

/**
 * Refresh access token using refresh token cookie
 */
router.post("/refresh-token", (async (
  req: Request,
  res: Response
): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res
      .status(HTTP_STATUS_CODES.UNAUTHORIZED)
      .json({ message: "No refresh token provided" });
    return;
  }

  try {
    const decoded = jwtService.verifyRefreshToken("user", refreshToken);

    if (!decoded) {
      res
        .status(HTTP_STATUS_CODES.UNAUTHORIZED)
        .json({ message: "Invalid refresh token" });
      return;
    }

    const user = await userModel.findById(decoded.id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const newAccessToken = jwtService.generateAccessToken("user", {
      id: user._id.toString(),
      email: user.email,
      role: "user",
    });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res
      .status(HTTP_STATUS_CODES.OK)
      .json({ message: "Access token refreshed" });
    return;
  } catch (error) {
    console.error("Error refreshing token:", (error as Error).message);
    res
      .status(HTTP_STATUS_CODES.UNAUTHORIZED)
      .json({ message: "Invalid or expired refresh token" });
    return;
  }
}) as RequestHandler);
router.get("/me", (async (req: Request, res: Response) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res
        .status(HTTP_STATUS_CODES.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    const decoded = jwtService.verifyAccessToken("user", token);

    if (!decoded) {
      return res
        .status(HTTP_STATUS_CODES.UNAUTHORIZED)
        .json({ message: "Invalid token" });
    }

    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      name: user.name,
      email: user.email,
      role: "user",
      user: user,
    });
  } catch (error) {
    console.error("Error getting user info:", (error as Error).message);
    res
      .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
}) as RequestHandler);
router.get("/refresh-user", (async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res
      .status(HTTP_STATUS_CODES.UNAUTHORIZED)
      .json({ message: "No refresh token found" });
  }

  try {
    // Verify refresh token
    const decoded = jwtService.verifyRefreshToken("user", refreshToken);

    if (!decoded) {
      return res
        .status(HTTP_STATUS_CODES.UNAUTHORIZED)
        .json({ message: "Invalid refresh token" });
    }

    // Find user by ID
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a new access token
    const newAccessToken = jwtService.generateAccessToken("user", {
      id: user._id.toString(),
      email: user.email,
      role: "user",
    });

    // Set the new access token cookie
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Return user data to frontend
    res.status(HTTP_STATUS_CODES.OK).json({
      name: user.name,
      email: user.email,
      role: "user",
      profileImage: "",
    });
  } catch (error) {
    console.error("Error in /refresh-user:", (error as Error).message);
    res
      .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
}) as RequestHandler);
const catchAsync =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.get(
  "/refresh",
  catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res
        .status(HTTP_STATUS_CODES.UNAUTHORIZED)
        .json({ message: "No refresh token provided" });
    }

    const decoded = jwtService.verifyRefreshToken("user", refreshToken);

    if (!decoded) {
      return res
        .status(HTTP_STATUS_CODES.UNAUTHORIZED)
        .json({ message: "Invalid or expired refresh token" });
    }

    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const payload = {
      id: user._id.toString(),
      email: user.email,
      role: "user",
    };

    const newAccessToken = jwtService.generateAccessToken("user", payload);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return res
      .status(HTTP_STATUS_CODES.OK)
      .json({ message: "Access token refreshed" });
  })
);

/**
 * ✅ Corrected Export (no typo!)
 */
export default router;
