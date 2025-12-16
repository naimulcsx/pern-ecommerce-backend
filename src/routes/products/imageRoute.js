import { Router } from "express";
import { getAllImage, getImageById, createImage } from '../../controllers/product/index.js';


const router = Router(); 

router.get('/', getAllImage);
router.post('/', createImage);
router.get('/:id', getImageById);

export default router;