import mongoose from 'mongoose';
import { Ad, Campaign, Order, Product } from '../models/index.js';

// Helper pipelines for analytics
export async function getTopProductsByRevenue({ limit = 5, campaignId = null }) {
  const match = {};
  if (campaignId) match['discounts.campaign'] = new mongoose.Types.ObjectId(campaignId);

  const pipeline = [
    { $match: match },
    { $unwind: '$items' },
    { $group: {
        _id: '$items.product',
        revenue: { $sum: { $multiply: ['$items.quantity', '$items.priceAtPurchase'] } },
      }
    },
    { $sort: { revenue: -1 } },
    { $limit: limit },
    { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
    { $unwind: '$product' },
    { $project: { _id: 0, productId: '$product._id', name: '$product.name', revenue: 1 } }
  ];
  return Order.aggregate(pipeline);
}

// ROAS: revenue from orders linked to campaign / spend from ads in campaign
export async function getCampaignROAS({ minRoas = 0 }) {
  const pipeline = [
    // Compute revenue attributed to campaign via campaign discount lines
    { $lookup: { from: 'orders', localField: '_id', foreignField: 'discounts.campaign', as: 'orders' } },
    { $lookup: { from: 'ads', localField: '_id', foreignField: 'campaign', as: 'ads' } },
    { $addFields: {
        revenue: {
          $sum: {
            $map: {
              input: '$orders',
              as: 'o',
              in: {
                $subtract: [
                  { $sum: { $map: { input: '$$o.items', as: 'it', in: { $multiply: ['$$it.quantity', '$$it.priceAtPurchase'] } } } },
                  { $min: [{ $sum: {
                    $map: {
                      input: '$$o.discounts', as: 'd',
                      in: {
                        $switch: {
                          branches: [
                            { case: { $eq: ['$$d.type', 'percentage'] }, then: { $multiply: [ { $sum: { $map: { input: '$$o.items', as: 'it', in: { $multiply: ['$$it.quantity', '$$it.priceAtPurchase'] } } } }, { $divide: ['$$d.value', 100] } ] } },
                            { case: { $eq: ['$$d.type', 'fixed'] }, then: '$$d.value' },
                            { case: { $eq: ['$$d.type', 'campaign'] }, then: '$$d.value' },
                          ],
                          default: 0
                        }
                      }
                    }
                  } }, { $sum: { $map: { input: '$$o.items', as: 'it', in: { $multiply: ['$$it.quantity', '$$it.priceAtPurchase'] } } } } ] }
                ]
              }
            }
          }
        },
        spend: { $sum: '$ads.spend' }
      }
    },
    { $addFields: { roas: { $cond: [{ $eq: ['$spend', 0] }, null, { $divide: ['$revenue', '$spend'] }] } } },
    { $match: { $or: [ { roas: { $gte: minRoas } }, { roas: null } ] } },
    { $project: { _id: 1, name: 1, revenue: 1, spend: 1, roas: 1 } }
  ];
  return Campaign.aggregate(pipeline);
}

export async function getCampaignRevenueTrends({ period = 'monthly', campaignId = null }) {
  const dateFormat = period === 'weekly' ? '%G-%V' : '%Y-%m';
  const match = {};
  if (campaignId) match['discounts.campaign'] = new mongoose.Types.ObjectId(campaignId);

  const pipeline = [
    { $match: match },
    { $addFields: { subtotal: { $sum: { $map: { input: '$items', as: 'it', in: { $multiply: ['$$it.quantity', '$$it.priceAtPurchase'] } } } } } },
    { $addFields: {
        discountTotal: { $min: [
          { $sum: { $map: { input: '$discounts', as: 'd', in: {
            $switch: {
              branches: [
                { case: { $eq: ['$$d.type', 'percentage'] }, then: { $multiply: ['$subtotal', { $divide: ['$$d.value', 100] }] } },
                { case: { $eq: ['$$d.type', 'fixed'] }, then: '$$d.value' },
                { case: { $eq: ['$$d.type', 'campaign'] }, then: '$$d.value' },
              ],
              default: 0
            }
          } } } }, '$subtotal'] }
      }
    },
    { $addFields: { revenue: { $subtract: ['$subtotal', '$discountTotal'] } } },
    { $group: {
        _id: { $dateToString: { date: '$placedAt', format: dateFormat } },
        revenue: { $sum: '$revenue' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { '_id': 1 } },
    { $project: { period: '$_id', revenue: 1, orders: 1, _id: 0 } }
  ];
  return Order.aggregate(pipeline);
}

export async function getDashboardMetrics() {
  // High-level summary: revenue, orders, avg order value, top products, ROAS
  const [ordersAgg, topProducts, roasAgg] = await Promise.all([
    Order.aggregate([
      { $addFields: { subtotal: { $sum: { $map: { input: '$items', as: 'it', in: { $multiply: ['$$it.quantity', '$$it.priceAtPurchase'] } } } } } },
      { $addFields: {
          discountTotal: { $min: [
            { $sum: { $map: { input: '$discounts', as: 'd', in: {
              $switch: {
                branches: [
                  { case: { $eq: ['$$d.type', 'percentage'] }, then: { $multiply: ['$subtotal', { $divide: ['$$d.value', 100] }] } },
                  { case: { $eq: ['$$d.type', 'fixed'] }, then: '$$d.value' },
                  { case: { $eq: ['$$d.type', 'campaign'] }, then: '$$d.value' },
                ],
                default: 0
              }
            } } } }, '$subtotal'] }
        }
      },
      { $addFields: { revenue: { $subtract: ['$subtotal', '$discountTotal'] } } },
      { $group: { _id: null, revenue: { $sum: '$revenue' }, orders: { $sum: 1 }, aov: { $avg: '$revenue' } } },
      { $project: { _id: 0, revenue: 1, orders: 1, aov: 1 } }
    ]),
    getTopProductsByRevenue({ limit: 5 }),
    getCampaignROAS({})
  ]);

  const metrics = ordersAgg[0] || { revenue: 0, orders: 0, aov: 0 };
  // Compute average ROAS across campaigns with spend > 0
  const valid = roasAgg.filter(c => c.spend > 0);
  const roas = valid.length ? valid.reduce((s, c) => s + (c.roas || 0), 0) / valid.length : 0;

  return { ...metrics, roas, topProducts, topCampaigns: roasAgg };
}

// Orders per customer aggregation for charting
export async function getOrdersPerCustomerAgg({ limit = 10 } = {}) {
  const pipeline = [
    { $group: { _id: '$customer', orders: { $sum: 1 } } },
    { $sort: { orders: -1 } },
    { $limit: limit },
    { $lookup: { from: 'customers', localField: '_id', foreignField: '_id', as: 'customer' } },
    { $unwind: '$customer' },
    { $project: { _id: 0, customerId: '$customer._id', name: '$customer.name', email: '$customer.email', orders: 1 } }
  ];
  return Order.aggregate(pipeline);
}

// List campaigns (id + name) for dropdowns
export async function listCampaignsLite() {
  const camps = await Campaign.find({}, { name: 1 }).sort({ name: 1 });
  return camps.map(c => ({ id: c._id, name: c.name }));
}
