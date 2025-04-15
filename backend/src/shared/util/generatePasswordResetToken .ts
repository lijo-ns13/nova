import crypto from "crypto";

export const generatePasswordResetToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
  return { rawToken, hashedToken, expiresAt };
};
