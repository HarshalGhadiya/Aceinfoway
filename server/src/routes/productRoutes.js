import { Router } from 'express';
import { getProductDetails } from '../controllers/productsController.js';

const router = Router();

router.get('/:id/details', getProductDetails);

export default router;
