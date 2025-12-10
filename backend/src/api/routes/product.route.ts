import { Router } from "express";
import { validate } from "../middlewares/validate.middleware";
import { searchProductsSchema } from "../dtos/requests/product.schema";
import { placeBidSchema } from "../dtos/requests/place-bid.schema";
import { authorize } from "../middlewares/authorize.middleware";
import * as productController from "../controllers/product.controller";
import { requireAuth } from "../middlewares/require-auth.middleware";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
});

const router = Router();

router.get(
  "/",
  validate(searchProductsSchema, "query"),
  productController.searchProducts
);

router.post(
  "/",
  upload.array("images", 10),
  requireAuth,
  productController.createProduct
);

router.get("/:id", productController.getProductDetail);

router.get("/:id/bids", productController.getProductBidHistory);

router.get("/:id/questions", productController.getProductQuestions);

router.post(
  "/:id/bid",
  requireAuth,
  authorize("auctions.bid"),
  validate(placeBidSchema, "body"),
  productController.placeBid
);

export default router;
