import { Router } from "express";
import { getAllCategory, getACategory, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js'
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = Router();

router.get('/', getAllCategory);
router.get('/:id', getACategory);

// app.js -> router -> auth-middleware -> admin -middleware -> controller -> data-return
router.post('/', authMiddleware, adminMiddleware, createCategory);
router.put('/:id', authMiddleware, adminMiddleware, updateCategory);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCategory);

export default router;