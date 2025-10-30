import { asyncHandler } from '../middlewares/asyncHandler.js';
import { getDashboardMetrics, getCampaignRevenueTrends, getTopProductsByRevenue, getOrdersPerCustomerAgg, listCampaignsLite } from '../services/analyticsService.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const metrics = await getDashboardMetrics();
  res.json(metrics);
});

export const getTrends = asyncHandler(async (req, res) => {
  const { period = 'monthly', campaignId = null } = req.query;
  const data = await getCampaignRevenueTrends({ period, campaignId });
  res.json({ period, data });
});

export const getTopProducts = asyncHandler(async (req, res) => {
  const { campaignId = null, limit = 5 } = req.query;
  const data = await getTopProductsByRevenue({ limit: parseInt(limit, 10) || 5, campaignId });
  res.json({ data });
});

export const getOrdersPerCustomer = asyncHandler(async (req, res) => {
  const data = await getOrdersPerCustomerAgg();
  res.json({ data });
});

export const getCampaigns = asyncHandler(async (req, res) => {
  const data = await listCampaignsLite();
  res.json({ data });
});
