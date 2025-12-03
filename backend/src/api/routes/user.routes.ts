import express from "express";
import * as userController from "../controllers/user.controller";
import { validate } from "../../middlewares/validate.middleware";
import { requireAuth } from "../../middlewares/requireAuth.middleware";
import {
  updateProfileSchema,
  changePasswordSchema,
  paginationSchema,
} from "../schemas/user.schema";

const router = express.Router();

router.use(requireAuth);

router.get("/profile", userController.getProfile);
router.patch(
  "/profile",
  validate(updateProfileSchema, "body"),
  userController.updateProfile
);
router.patch(
  "/change-password",
  validate(changePasswordSchema, "body"),
  userController.changePassword
);

router.get(
  "/watchlist",
  validate(paginationSchema, "query"),
  userController.getWatchlist
);
router.get(
  "/active-bids",
  validate(paginationSchema, "query"),
  userController.getActiveBids
);
router.get(
  "/won-auctions",
  validate(paginationSchema, "query"),
  userController.getWonAuctions
);
router.get(
  "/my-listings",
  validate(paginationSchema, "query"),
  userController.getMyListings
);

export default router;
