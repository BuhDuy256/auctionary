import { Request, Response, NextFunction } from "express";
import * as adminService from "../../services/admin.service";
import type { UpgradeRequestActionSchema } from "../dtos/requests/admin.schema";

/**
 * Get all users for admin management
 * GET /admin/users
 */
export const getAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await adminService.getAllUsers();
    res.status(200).message("Users retrieved successfully").json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all upgrade requests
 * GET /admin/upgrade-requests
 */
export const getAllUpgradeRequests = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await adminService.getAllUpgradeRequests();
    res
      .status(200)
      .message("Upgrade requests retrieved successfully")
      .json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Approve an upgrade request
 * PATCH /admin/upgrade-requests/:id/approve
 */
export const approveUpgradeRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params as unknown as UpgradeRequestActionSchema;
    const data = await adminService.approveUpgradeRequest(id);
    res.status(200).message("Upgrade request approved successfully").json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Reject an upgrade request
 * PATCH /admin/upgrade-requests/:id/reject
 */
export const rejectUpgradeRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params as unknown as UpgradeRequestActionSchema;
    const data = await adminService.rejectUpgradeRequest(id);
    res.status(200).message("Upgrade request rejected").json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Suspend a user
 * PATCH /admin/users/:id/suspend
 */
export const suspendUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params as unknown as UpgradeRequestActionSchema;
    const data = await adminService.suspendUser(id);
    res.status(200).message("User suspended successfully").json(data);
  } catch (error) {
    next(error);
  }
};
