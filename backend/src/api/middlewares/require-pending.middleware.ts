import { Request, Response, NextFunction } from "express";

export const requirePendingUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (user.isVerified === true) {
    return res.status(400).json({
      message: "User is already verified. Action not allowed.",
    });
  }

  return next();
};
