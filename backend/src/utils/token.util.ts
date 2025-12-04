import jwt from "jsonwebtoken";
import { envConfig } from "../configs/env.config";

export const generateAccessToken = (user: any) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    envConfig.JWT_ACCESS_SECRET as any,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = (user: any) => {
  return jwt.sign(
    { id: user.id },
    envConfig.JWT_REFRESH_SECRET as any,
    { expiresIn: "7d" }
  );
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, envConfig.JWT_REFRESH_SECRET as any);
};
