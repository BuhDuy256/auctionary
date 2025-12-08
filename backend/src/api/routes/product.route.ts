import { Router } from "express";
import { validate } from "../middlewares/validate.middleware";
import { searchProductsSchema, createProductSchema } from "../dtos/requests/product.schema";
import { placeBidSchema } from "../dtos/requests/place-bid.schema";
import { authorize } from "../middlewares/authorize.middleware";
import * as productController from "../controllers/product.controller";
import { requireAuth } from "../middlewares/require-auth.middleware";

const router = Router();

router.get("/",
  validate(searchProductsSchema, 'query'),
  productController.searchProducts
);

router.post("/",
  validate(createProductSchema, 'body'),
  productController.createProduct
);

router.get("/:id",
  productController.getProductDetail
);

router.get("/:id/bids",
  productController.getProductBidHistory
);

router.get("/:id/questions",
  productController.getProductQuestions
);

router.post("/:id/bid",
  requireAuth,
  authorize("auctions.bid"),
  validate(placeBidSchema, "body"),
  productController.placeBid
);

export default router;