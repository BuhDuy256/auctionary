import { Request, Response, NextFunction } from "express";
import * as userService from "../../services/user.service";

export const getStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.id;
    const stats = await userService.getStats(userId);
    res.message("User stats retrieved successfully").json(stats);
  } catch (error) {
    next(error);
  }
};

export const getWatchlist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.id;
    const watchlist = await userService.getWatchlist(userId);
    res.message("Watchlist retrieved successfully").json(watchlist);
  } catch (error) {
    next(error);
  }
};

export const getActiveBids = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.id;
    const bids = await userService.getActiveBids(userId);
    res.message("Active bids retrieved successfully").json(bids);
  } catch (error) {
    next(error);
  }
};

export const getWonAuctions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.id;
    const auctions = await userService.getWonAuctions(userId);
    res.message("Won auctions retrieved successfully").json(auctions);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.id;
    const { fullName, address } = req.body;
    const updatedUser = await userService.updateProfile(userId, {
      fullName,
      address,
    });
    res.message("Profile updated successfully").json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const updateEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.id;
    const { email, password } = req.body;
    if (!password) {
      throw new Error("Password is required to change email");
    }
    const updatedUser = await userService.updateEmail(userId, email, password);
    res.message("Email updated successfully").json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.id;
    const { currentPassword, newPassword } = req.body;

    const updatedUser = await userService.changePassword(
      userId,
      currentPassword,
      newPassword
    );
    res.message("Password updated successfully").json(updatedUser);
  } catch (error) {
    next(error);
  }
};
