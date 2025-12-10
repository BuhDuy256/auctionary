import { Router } from "express";
import * as sellerController from "../controllers/seller.controller";
import { requireAuth } from "../middlewares/require-auth.middleware";

const router = Router();

router.get("/dashboard", requireAuth, sellerController.getSellerDashboard);

export default router;
