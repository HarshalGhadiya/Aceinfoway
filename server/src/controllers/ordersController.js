import mongoose from 'mongoose';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { buildPagination } from '../utils/pagination.js';
import { listOrders, createOrderTransactional } from '../services/orderService.js';
import { connectDB } from '../config/db.js';
import { Order } from '../models/index.js';

export const getOrders = asyncHandler(async (req, res) => {
  const { skip, limit, page } = buildPagination(req.query);
  const filters = {
    from: req.query.from,
    to: req.query.to,
    campaignId: req.query.campaign,
    productId: req.query.product,
  };
  const { data, total } = await listOrders({ filters, skip, limit });
  res.json({ page, limit, total, data });
});

export const createOrder = asyncHandler(async (req, res) => {
  // Demonstration of MongoDB transaction for order insertion
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const order = await createOrderTransactional({ orderDoc: req.body, session });
    await session.commitTransaction();
    res.status(201).json(order);
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
});
