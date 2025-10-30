import { Router } from 'express';
import dashboardRoutes from './dashboardRoutes.js';
import orderRoutes from './orderRoutes.js';
import productRoutes from './productRoutes.js';

const router = Router();

router.use('/dashboard', dashboardRoutes);
router.use('/orders', orderRoutes);
router.use('/products', productRoutes);

export default router;
