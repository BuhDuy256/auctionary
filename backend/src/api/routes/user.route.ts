import { Router } from "express";
import { requireAuth } from "../middlewares/require-auth.middleware";
import * as userController from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  updateProfileSchema,
  updateEmailSchema,
  changePasswordSchema,
  getRatingsQuerySchema,
  getUserByIdParamSchema,
} from "../dtos/requests/user.schema";

const router = Router();

// Own profile routes (require /me prefix)
router.get("/me/stats", requireAuth, userController.getStats);
router.get("/me/bids", requireAuth, userController.getActiveBids);
router.get("/me/won-auctions", requireAuth, userController.getWonAuctions);
router.get(
  "/me/ratings",
  requireAuth,
  validate(getRatingsQuerySchema, "query"),
  userController.getRatings
);

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

// Public user profile routes (require authentication to view)
router.get(
  "/:id/profile",
  requireAuth,
  validate(getUserByIdParamSchema, "params"),
  userController.getPublicUserProfile
);

router.get(
  "/:id/won-auctions",
  requireAuth,
  validate(getUserByIdParamSchema, "params"),
  userController.getPublicUserWonAuctions
);

router.get(
  "/:id/ratings",
  requireAuth,
  validate(getUserByIdParamSchema, "params"),
  validate(getRatingsQuerySchema, "query"),
  userController.getPublicUserRatings
);

export default router;
