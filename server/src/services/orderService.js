import mongoose from 'mongoose';
import { Order } from '../models/index.js';

export async function listOrders({ filters = {}, skip = 0, limit = 10 }) {
  const query = {};
  if (filters.from || filters.to) {
    query.placedAt = {};
    if (filters.from) query.placedAt.$gte = new Date(filters.from);
    if (filters.to) query.placedAt.$lte = new Date(filters.to);
  }
  if (filters.campaignId) query['discounts.campaign'] = new mongoose.Types.ObjectId(filters.campaignId);
  if (filters.productId) query['items.product'] = new mongoose.Types.ObjectId(filters.productId);

  const [data, total] = await Promise.all([
    Order.find(query)
      .populate('customer', 'name email')
      .populate('items.product', 'name sku')
      .populate('discounts.campaign', 'name')
      .sort({ placedAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(query)
  ]);

  return { data, total };
}

export async function createOrderTransactional({ orderDoc, session }) {
  // Use session for transaction safety
  const order = new Order(orderDoc);
  await order.save({ session });
  return order;
}
