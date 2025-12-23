import { Router } from 'express';
import { createOrder, getOrderById, getOrders, updateOrder, deleteOrder} from '../controllers/orderController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js'


const router = Router();


router.get('/',authMiddleware, getOrders);
router.get('/:id', authMiddleware, getOrderById);
router.post('/', authMiddleware, createOrder);
router.put('/:id', authMiddleware, updateOrder);
router.delete('/:id', authMiddleware, adminMiddleware, deleteOrder);

export default router;


// -> callback - > higher order function -> promise -> async await