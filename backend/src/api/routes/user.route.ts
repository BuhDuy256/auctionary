import { Router } from "express";
import { requireAuth } from "../middlewares/require-auth.middleware";
import * as userController from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  updateProfileSchema,
  updateEmailSchema,
  changePasswordSchema,
} from "../dtos/requests/user.schema";

const router = Router();

router.get("/me/stats", requireAuth, userController.getStats);
router.get("/me/watchlist", requireAuth, userController.getWatchlist);
router.get("/me/bids", requireAuth, userController.getActiveBids);
router.get("/me/won-auctions", requireAuth, userController.getWonAuctions);

router.patch(
  "/me/profile",
  requireAuth,
  validate(updateProfileSchema),
  userController.updateProfile
);
router.patch(
  "/me/email",
  requireAuth,
  validate(updateEmailSchema),
  userController.updateEmail
);
router.patch(
  "/me/password",
  requireAuth,
  validate(changePasswordSchema),
  userController.changePassword
);

export default router;
