import { Router } from "express";
import { requireAuth } from "../middlewares/require-auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { validate } from "../middlewares/validate.middleware";
import * as adminController from "../controllers/admin.controller";
import {
  upgradeRequestActionSchema,
  suspendUserSchema,
} from "../dtos/requests/admin.schema";

const router = Router();

// All admin routes require authentication and admin role/permission
const adminAuth = [requireAuth, authorize("admin")];

// User management
router.get("/users", adminAuth, adminController.getAllUsers);
router.patch(
  "/users/:id/suspend",
  adminAuth,
  validate(suspendUserSchema, "params"),
  adminController.suspendUser
);

// Upgrade request management
router.get(
  "/upgrade-requests",
  adminAuth,
  adminController.getAllUpgradeRequests
);
router.patch(
  "/upgrade-requests/:id/approve",
  adminAuth,
  validate(upgradeRequestActionSchema, "params"),
  adminController.approveUpgradeRequest
);
router.patch(
  "/upgrade-requests/:id/reject",
  adminAuth,
  validate(upgradeRequestActionSchema, "params"),
  adminController.rejectUpgradeRequest
);

export default router;
