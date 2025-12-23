import { Router } from "express";
import { getAllVariant, getVariantById, createVariant, updateVariant, deleteVariant } from '../../controllers/product/index.js';
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { adminMiddleware } from "../../middleware/adminMiddleware.js";

const router = Router();

router.get('/', getAllVariant); 
router.get('/:id', getVariantById);
router.post('/', authMiddleware, adminMiddleware, createVariant);
router.put('/:id', authMiddleware, adminMiddleware, updateVariant);
router.delete('/:id', authMiddleware, adminMiddleware, deleteVariant);

export default router;