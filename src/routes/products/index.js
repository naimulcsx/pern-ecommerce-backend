import { Router } from "express";
import imageRoute from "./imageRoute.js";
import variantRoute from "./variantRoute.js";
import productRoute from "./productRoute.js";

const router = Router();

router.use('/image', imageRoute); // /product/image
router.use('/variant', variantRoute); // /product/variant
router.use('/', productRoute); // /product


export default router;