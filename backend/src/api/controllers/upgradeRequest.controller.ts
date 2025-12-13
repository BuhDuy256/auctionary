import { Request, Response, NextFunction } from "express";
import * as upgradeRequestService from "../../services/upgradeRequest.service";
import type { SubmitUpgradeRequestSchema } from "../dtos/requests/upgradeRequest.schema";

/**
 * Submit upgrade request
 * POST /users/upgrade-request
 */
export const submitUpgradeRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user!.id;
    const { message } = req.body as SubmitUpgradeRequestSchema;

    const data = await upgradeRequestService.submitUpgradeRequest(
      userId,
      message
    );

    res
      .status(201)
      .message("Upgrade request submitted successfully")
      .json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user's upgrade request status
 * GET /users/upgrade-request/status
 */
export const getUpgradeRequestStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user!.id;
    const data = await upgradeRequestService.getMyUpgradeRequestStatus(userId);

    res.status(200).message("Upgrade request status retrieved").json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel user's pending upgrade request
 * PATCH /users/upgrade-request/cancel
 */
export const cancelUpgradeRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user!.id;
    const data = await upgradeRequestService.cancelMyUpgradeRequest(userId);

    res
      .status(200)
      .message("Upgrade request cancelled successfully")
      .json(data);
  } catch (error) {
    next(error);
  }
};
