import { Router } from "express";
import { getAllVariant, getVariantById, createVariant } from '../../controllers/product/index.js';

const router = Router();

router.get('/', getAllVariant); 
router.post('/', createVariant);
router.get('/:id', getVariantById);

export default router;