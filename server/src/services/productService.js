import { Order, Product } from '../models/index.js';
import mongoose from 'mongoose';

export async function getProductPerformance(productId) {
  const pid = new mongoose.Types.ObjectId(productId);
  const pipeline = [
    { $match: { 'items.product': pid } },
    { $addFields: { subtotal: { $sum: { $map: { input: '$items', as: 'it', in: { $cond: [{ $eq: ['$$it.product', pid] }, { $multiply: ['$$it.quantity', '$$it.priceAtPurchase'] }, 0] } } } } } },
    { $addFields: { discountsOnProduct: { $min: [
      { $sum: { $map: { input: '$discounts', as: 'd', in: {
        $switch: {
          branches: [
            { case: { $eq: ['$$d.type', 'percentage'] }, then: { $multiply: ['$subtotal', { $divide: ['$$d.value', 100] }] } },
            { case: { $eq: ['$$d.type', 'fixed'] }, then: '$$d.value' },
            { case: { $eq: ['$$d.type', 'campaign'] }, then: '$$d.value' },
          ],
          default: 0
        }
      } } } }, '$subtotal'] } } },
    { $addFields: { revenue: { $subtract: ['$subtotal', '$discountsOnProduct'] } } },
    { $group: { _id: null, revenue: { $sum: '$revenue' }, orders: { $sum: 1 }, qty: { $sum: { $sum: { $map: { input: '$items', as: 'it', in: { $cond: [{ $eq: ['$$it.product', pid] }, '$$it.quantity', 0] } } } } } } },
    { $project: { _id: 0, revenue: 1, orders: 1, qty: 1 } }
  ];

  const [perf] = await Order.aggregate(pipeline);
  const product = await Product.findById(pid);
  return { product, performance: perf || { revenue: 0, orders: 0, qty: 0 } };
}
