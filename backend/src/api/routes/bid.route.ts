import Router from 'express';
import * as bidController from "../controllers/bid.controller";
import { validate } from '../../middlewares/validate.middleware';
import { placebidSchema } from '../schemas/bid.schema';

const router = Router();

router.get("",
    bidController.getHighestBidById
);

router.post("",
    validate(placebidSchema, 'body'), 
    bidController.placeBidOnProductById
);