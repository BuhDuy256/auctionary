import { Router } from "express";
import { requireAuth } from "../middlewares/require-auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import * as upgradeRequestController from "../controllers/upgradeRequest.controller";
import { submitUpgradeRequestSchema } from "../dtos/requests/upgradeRequest.schema";

const router = Router();

// All upgrade request routes require authentication
router.post(
  "/upgrade-request",
  requireAuth,
  validate(submitUpgradeRequestSchema, "body"),
  upgradeRequestController.submitUpgradeRequest
);

router.get(
  "/upgrade-request/status",
  requireAuth,
  upgradeRequestController.getUpgradeRequestStatus
);

router.patch(
  "/upgrade-request/cancel",
  requireAuth,
  upgradeRequestController.cancelUpgradeRequest
);

export default router;
