import { Router } from "express";
import { getCart, addItemToCart, updateCartItem, clearCart, removeItemFromCart } from '../controllers/cartController.js';
import { authMiddleware }  from '../middleware/authMiddleware.js';


const router = Router();

router.get('/', authMiddleware, getCart);
router.post('/item', authMiddleware, addItemToCart);
router.put('/item/:id', authMiddleware, updateCartItem);
router.delete('/item/:id',authMiddleware, removeItemFromCart);
router.delete('/clear', authMiddleware, clearCart);

export default router;