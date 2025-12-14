import { Router } from "express";
import * as homeController from "../controllers/home.controller";

const router = Router();

// Public route - no authentication required
router.get("/sections", homeController.getHomeSections);

export default router;
