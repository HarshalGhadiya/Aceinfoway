import { Router } from 'express';
import { getDashboard, getTrends, getTopProducts, getOrdersPerCustomer, getCampaigns } from '../controllers/dashboardController.js';
import { cache } from '../middlewares/cacheMiddleware.js';

const router = Router();

// Cache dashboard as it is expensive to compute
router.get('/dashboard', cache(() => 'cache:dashboard'), getDashboard);
// Alias to match spec: GET /api/dashboard
router.get('/', cache(() => 'cache:dashboard'), getDashboard);
// Trends with unified param name campaignId
router.get('/trends', cache((req) => `cache:trends:${req.query.period || 'monthly'}:${req.query.campaignId || 'all'}`), getTrends);
// Top products (optional campaignId)
router.get('/top-products', cache((req) => `cache:top-products:${req.query.campaignId || 'all'}`), getTopProducts);
// Orders per customer chart
router.get('/orders-per-customer', cache(() => 'cache:orders-per-customer'), getOrdersPerCustomer);
// List campaigns (id + name)
router.get('/campaigns', cache(() => 'cache:campaigns'), getCampaigns);

export default router;
