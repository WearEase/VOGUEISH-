import crypto from "crypto";

const TOKEN_BYTES = 32;

export const createTokenPair = () => {
  const rawToken = crypto.randomBytes(TOKEN_BYTES).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  return { rawToken, hashedToken };
};

export const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const tokenExpiryFromNow = (minutes: number) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};
