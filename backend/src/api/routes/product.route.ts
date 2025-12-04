import { Router } from "express";
import { validate } from "../middlewares/validate.middleware";
import { searchProductsSchema, createProductSchema } from "../dtos/requests/product.schema";
import * as productController from "../controllers/product.controller";

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

export default router;