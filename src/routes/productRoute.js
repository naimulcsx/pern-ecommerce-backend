import { Router } from "express";
import { getAllProduct, getAProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js'
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = Router();

router.get('/', getAllProduct);
router.get('/:id', getAProduct);

// app.js -> router -> auth-middleware -> admin -middleware -> controller -> data-return
router.post('/', authMiddleware, adminMiddleware, createProduct);
router.put('/:id', authMiddleware, adminMiddleware, updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

export default router;

